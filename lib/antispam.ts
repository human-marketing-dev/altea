/**
 * Las defensas del formulario de contacto contra bots y abuso. SÓLO SERVIDOR.
 *
 * Son capas baratas y sin servicios de terceros, cada una para un tipo de bot:
 *
 *   1. FICHA FIRMADA CON HORA. /contacto se renderiza por petición y le da al
 *      formulario una ficha `hora.firma` (HMAC). Sin ficha válida no se envía:
 *      corta a los bots que mandan el POST directo sin cargar la página, y a los
 *      que la llenan en menos de MIN_SEGUNDOS, cosa que una persona no hace.
 *   2. LÍMITE POR IP Y GLOBAL. Pocas veces por IP en una ventana corta y en el
 *      día, y un techo para todo el sitio por hora: aunque las IPs se repartan,
 *      la bandeja y la cuota de Brevo no se inundan.
 *   3. MENSAJE REPETIDO. El mismo correo con el mismo mensaje en 24 h no se
 *      vuelve a mandar (y al usuario se le dice que sí: ya llegó).
 *   4. CONTENIDO. Demasiados enlaces o etiquetas de foro ([url=…]) es spam.
 *
 * ⚠ LA MEMORIA ES DE ESTE PROCESO. Los contadores, las fichas usadas y los
 * repetidos viven en un Map: con `next start` en un servidor funcionan tal
 * cual; en un hosting serverless cada instancia lleva los suyos y se reinician
 * con ella, así que el límite se vuelve aproximado. Ahí lo correcto es moverlos
 * a un almacén compartido (Redis/Upstash) o sumar un captcha —Cloudflare
 * Turnstile— delante. La ficha firmada no depende de esto: vale en cualquier
 * hosting.
 *
 * El secreto de la firma es FORM_SECRET si existe; si no, se deriva de
 * BREVO_API_KEY (nunca sale del servidor). Con FORM_SECRET se puede rotar uno
 * sin el otro.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Menos que esto entre que se abre la página y se envía: bot. */
const MIN_SEGUNDOS = 3;
/** Más que esto: la página lleva abierta demasiado; que la recargue. */
const MAX_HORAS = 12;

const LIMITES = {
  /** Por IP: 3 en 10 minutos y 10 en el día. */
  ipVentana: { cuantos: 3, ms: 10 * 60_000 },
  ipDia: { cuantos: 10, ms: 24 * 3_600_000 },
  /** Para todo el sitio: 40 por hora. Un día bueno de Altea no llega ni cerca. */
  global: { cuantos: 40, ms: 3_600_000 },
};

/** Más de esto en el mensaje ya no es alguien contando su proyecto. */
const MAX_ENLACES = 2;

function secreto() {
  const propio = process.env.FORM_SECRET?.trim();
  if (propio) return propio;
  const clave = process.env.BREVO_API_KEY?.trim();
  if (!clave) return null;
  return createHash("sha256").update(`altea-formulario:${clave}`).digest("hex");
}

const firmar = (hora: string, s: string) =>
  createHmac("sha256", s).update(hora).digest("base64url");

/** La ficha que lleva el formulario. La emite la página en cada petición. */
export function emitirFicha(): string {
  const s = secreto();
  const hora = String(Date.now());
  return s ? `${hora}.${firmar(hora, s)}` : "";
}

/* Fichas ya usadas, para que una sola no sirva para cien envíos. */
const usadas = new Map<string, number>();

export type Veredicto =
  | { ok: true }
  /** `silencio`: responder «enviado» sin enviar, para no darle señal al bot. */
  | { ok: false; silencio: true }
  | { ok: false; silencio: false; mensaje: string };

export function revisarFicha(ficha: string): Veredicto {
  const s = secreto();
  const [hora, firma] = ficha.split(".");
  if (!s || !hora || !firma) return { ok: false, silencio: true };

  const esperada = Buffer.from(firmar(hora, s));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida))
    return { ok: false, silencio: true };

  const edad = Date.now() - Number(hora);
  if (!Number.isFinite(edad) || edad < MIN_SEGUNDOS * 1000)
    return { ok: false, silencio: true };
  if (edad > MAX_HORAS * 3_600_000)
    return {
      ok: false,
      silencio: false,
      mensaje: "La página lleva mucho tiempo abierta. Recárgala y vuelve a enviar.",
    };

  limpiar(usadas, MAX_HORAS * 3_600_000);
  if (usadas.has(ficha)) return { ok: false, silencio: true };
  return { ok: true };
}

/**
 * La ficha se gasta SÓLO CUANDO EL MENSAJE SALE. Si se gastara al revisarla,
 * quien corrige un error de validación y reenvía —con la misma ficha, porque
 * la página no se recarga— caería en «ya usada» y su mensaje se perdería en
 * silencio.
 */
export function gastarFicha(ficha: string) {
  usadas.set(ficha, Date.now());
}

/* ── Límites ─────────────────────────────────────────────────────────── */

const porIp = new Map<string, number[]>();
let globales: number[] = [];

const recientes = (marcas: number[], ms: number, ahora: number) =>
  marcas.filter((t) => ahora - t < ms);

export function revisarLimite(ip: string): Veredicto {
  const ahora = Date.now();
  const marcas = recientes(porIp.get(ip) ?? [], LIMITES.ipDia.ms, ahora);
  globales = recientes(globales, LIMITES.global.ms, ahora);

  const enVentana = recientes(marcas, LIMITES.ipVentana.ms, ahora).length;
  if (
    enVentana >= LIMITES.ipVentana.cuantos ||
    marcas.length >= LIMITES.ipDia.cuantos ||
    globales.length >= LIMITES.global.cuantos
  ) {
    return {
      ok: false,
      silencio: false,
      mensaje:
        "Recibimos varios mensajes en poco tiempo. Espera unos minutos o escríbenos directo.",
    };
  }

  marcas.push(ahora);
  porIp.set(ip, marcas);
  globales.push(ahora);
  /* Que el Map no crezca sin fin con IPs de un solo envío. */
  if (porIp.size > 5000) {
    for (const [clave, lista] of porIp)
      if (!recientes(lista, LIMITES.ipDia.ms, ahora).length) porIp.delete(clave);
  }
  return { ok: true };
}

/* ── Repetidos ───────────────────────────────────────────────────────── */

const vistos = new Map<string, number>();

/** true si este correo ya mandó este mismo mensaje en las últimas 24 h. */
export function esRepetido(correo: string, mensaje: string): boolean {
  limpiar(vistos, 24 * 3_600_000);
  const huella = createHash("sha256")
    .update(`${correo.toLowerCase()}\n${mensaje.replace(/\s+/g, " ").toLowerCase()}`)
    .digest("hex");
  if (vistos.has(huella)) return true;
  vistos.set(huella, Date.now());
  return false;
}

/* ── Contenido ───────────────────────────────────────────────────────── */

export function revisarContenido(mensaje: string): Veredicto {
  /* Etiquetas de foro: ningún humano las escribe en un formulario de contacto. */
  if (/\[(url|link)=|<a\s+href=/i.test(mensaje)) return { ok: false, silencio: true };
  const enlaces = mensaje.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (enlaces > MAX_ENLACES)
    return {
      ok: false,
      silencio: false,
      mensaje: `Tu mensaje tiene demasiados enlaces. Deja ${MAX_ENLACES} como máximo.`,
    };
  return { ok: true };
}

/**
 * Quita caracteres de control y de dirección del texto (los que permiten
 * disfrazar un asunto o romper una línea). En el mensaje se respetan los saltos.
 */
export function limpiarTexto(s: string, conSaltos = false): string {
  const sinControl = s.replace(
    conSaltos
      ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g
      : /[\u0000-\u001F\u007F​-‏‪-‮⁦-⁩]/g,
    conSaltos ? "" : " ",
  );
  return conSaltos ? sinControl.replace(/\r\n?/g, "\n") : sinControl.replace(/\s+/g, " ");
}

function limpiar(mapa: Map<string, number>, ms: number) {
  const ahora = Date.now();
  if (mapa.size < 1000) return;
  for (const [clave, t] of mapa) if (ahora - t > ms) mapa.delete(clave);
}
