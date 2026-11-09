"use server";

import { headers } from "next/headers";
import {
  esRepetido,
  gastarFicha,
  liberarLimite,
  limpiarTexto,
  olvidarMensaje,
  revisarContenido,
  revisarFicha,
  revisarLimite,
} from "@/lib/antispam";
import { enviarCorreo, faltantesBrevo } from "@/lib/brevo";
import { CANALES, UNIDADES } from "@/lib/contacto";
import type { EstadoLead } from "./estado-lead";
import type { Idioma } from "@/lib/idioma";

/**
 * Recepción de leads del formulario de contacto.
 *
 * ENTREGA POR CORREO, VÍA BREVO (octubre de 2026): cada mensaje válido llega a
 * CONTACTO_DESTINO con el «Responder» apuntando a quien escribió, así que
 * contestar es darle a responder. Ver lib/brevo.ts para las variables.
 *
 * ⚠ UN SOLO DESTINO PARA LAS CUATRO UNIDADES. El brief habla de repartir —CRM
 * para Vivienda, ventas para Comercial, contacto industrial para Industrial—;
 * cuando existan esos destinos, se elige aquí por `unidad`.
 *
 * ANTISPAM: trampa oculta, ficha firmada con hora, límites por IP y global,
 * repetidos y contenido. Todo en lib/antispam.ts, con sus límites y su letra
 * pequeña (la memoria es del proceso). A un bot detectado se le responde
 * «enviado» sin enviar nada, para no enseñarle qué lo delató.
 *
 * Si Brevo falla, el usuario NO ve «gracias»: ve el error con el correo y el
 * WhatsApp para que no se pierda el contacto. Decirle que lo contactarán cuando
 * el mensaje no salió es lo peor que puede hacer un formulario.
 */

/*
 * El tipo y el estado inicial viven en estado-lead.ts: un archivo "use server"
 * sólo puede exportar funciones asíncronas, y la constante aquí rompía la
 * acción en tiempo de ejecución (el build no lo detecta; `next dev` sí).
 */

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Topes para que nadie use el formulario para mandar novelas o basura. */
const MAX = { nombre: 120, correo: 200, telefono: 40, mensaje: 5000 };

/** Lo que escribió el usuario va dentro de HTML: se escapa siempre. */
const escapar = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * LOS MENSAJES PARA LA PERSONA, en el idioma de la página desde la que escribe
 * (noviembre de 2026). El formulario manda `idioma` en un campo oculto. El
 * correo que le llega a Altea sigue en español: sólo agrega el idioma, para que
 * sepan en cuál contestar.
 */
const MENSAJES = {
  es: {
    nombre: "Escribe tu nombre.",
    nombreLargo: "El nombre es demasiado largo.",
    correo: "Revisa tu correo electrónico.",
    telefono: "Revisa tu teléfono.",
    mensajeCorto: "Cuéntanos un poco más sobre tu proyecto.",
    mensajeLargo: (max: number) => `El mensaje es demasiado largo (máximo ${max} caracteres).`,
    envio: (correo: string) =>
      `No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos, o escríbenos a ${correo} o por WhatsApp.`,
  },
  en: {
    nombre: "Please enter your name.",
    nombreLargo: "The name is too long.",
    correo: "Please check your email address.",
    telefono: "Please check your phone number.",
    mensajeCorto: "Please tell us a little more about your project.",
    mensajeLargo: (max: number) => `The message is too long (maximum ${max} characters).`,
    envio: (correo: string) =>
      `We could not send your message. Please try again in a few minutes, or write to us at ${correo} or via WhatsApp.`,
  },
} as const;

/** Los avisos del antispam (lib/antispam.ts) vienen en español: aquí su inglés. */
function avisoEn(mensaje: string): string {
  if (mensaje.startsWith("La página lleva mucho tiempo abierta"))
    return "This page has been open for a long time. Please reload it and submit again.";
  if (mensaje.startsWith("Recibimos varios mensajes"))
    return "We received several messages in a short time. Please wait a few minutes or contact us directly.";
  const enlaces = mensaje.match(/^Tu mensaje tiene demasiados enlaces\. Deja (\d+)/);
  if (enlaces)
    return `Your message contains too many links. Please include no more than ${enlaces[1]}.`;
  return mensaje;
}

export async function enviarLead(
  _previo: EstadoLead,
  datos: FormData,
): Promise<EstadoLead> {
  // Honeypot: un bot llena todos los campos, incluido el que está oculto.
  // Se le responde éxito para no darle señal de que fue detectado.
  if (String(datos.get("sitio-web") ?? "").trim()) {
    return { estado: "enviado" };
  }

  const idioma: Idioma = datos.get("idioma") === "en" ? "en" : "es";
  const M = MENSAJES[idioma];

  // La ficha firmada que puso la página: sin ella, o demasiado rápida, es bot.
  const ficha = String(datos.get("ficha") ?? "");
  const deFicha = revisarFicha(ficha);
  if (!deFicha.ok && deFicha.silencio) return { estado: "enviado" };

  /* Sin caracteres de control ni de dirección: el nombre va en el asunto. */
  const texto = (clave: keyof typeof MAX | "unidad") =>
    limpiarTexto(String(datos.get(clave) ?? "")).trim();
  const nombre = texto("nombre");
  const correo = texto("correo");
  const telefono = texto("telefono");
  const unidadCruda = texto("unidad");
  const mensaje = limpiarTexto(String(datos.get("mensaje") ?? ""), true).trim();
  /* Sólo una de las cuatro: el select se puede manipular desde el navegador. */
  const unidad = UNIDADES.find((u) => u === unidadCruda);

  // La validación del cliente es conveniencia; ésta es la que cuenta.
  const errores: Record<string, string> = {};
  if (nombre.length < 2) errores.nombre = M.nombre;
  else if (nombre.length > MAX.nombre) errores.nombre = M.nombreLargo;
  if (!CORREO.test(correo) || correo.length > MAX.correo) errores.correo = M.correo;
  if (telefono.length > MAX.telefono) errores.telefono = M.telefono;
  if (mensaje.length < 10) errores.mensaje = M.mensajeCorto;
  else if (mensaje.length > MAX.mensaje) errores.mensaje = M.mensajeLargo(MAX.mensaje);

  const valores = { nombre, correo, telefono, unidad: unidad ?? "", mensaje };

  if (Object.keys(errores).length > 0) {
    return { estado: "error", errores, valores };
  }

  /* Los avisos que sí se le muestran a una persona: página vieja, demasiados
     enlaces, demasiados envíos seguidos. Lo que escribió se le devuelve. */
  const aviso = (mensajeAviso: string): EstadoLead => ({
    estado: "error",
    errores: { envio: idioma === "en" ? avisoEn(mensajeAviso) : mensajeAviso },
    valores,
  });
  if (!deFicha.ok) return aviso(deFicha.mensaje);

  const deContenido = revisarContenido(mensaje);
  if (!deContenido.ok)
    return deContenido.silencio ? { estado: "enviado" } : aviso(deContenido.mensaje);

  /*
   * LA IP LA PONE EL SERVIDOR, NO EL VISITANTE (9 nov 2026). Antes se tomaba la
   * PRIMERA de x-forwarded-for, y ésa la puede escribir cualquiera: el nginx de
   * RunCloud AÑADE la IP real al final de lo que mande el cliente. Con una IP
   * inventada por envío se saltaba el límite por IP, y se podía agotar el techo
   * global y bloquear una hora a los visitantes reales.
   *
   * Ahora, en orden: x-real-ip, que nginx pone con la IP de la conexión y
   * sustituye a la que mande el cliente; si no viene, la ÚLTIMA de
   * x-forwarded-for, que es la que añadió el proxy más cercano.
   *
   * ⚠ Si algún día se pone Cloudflare u otro proxy delante, las dos traerían la
   * IP del proxy y no la del visitante: habría que leer la suya
   * (cf-connecting-ip) y revisar esto.
   */
  const cabeceras = await headers();
  const ip =
    cabeceras.get("x-real-ip")?.trim() ||
    cabeceras.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "desconocida";
  const deLimite = revisarLimite(ip);
  if (!deLimite.ok)
    return deLimite.silencio ? { estado: "enviado" } : aviso(deLimite.mensaje);

  /* El mismo mensaje dos veces —doble clic, recarga— llega una sola vez. */
  if (esRepetido(correo, mensaje)) return { estado: "enviado" };

  /* Si no sale, ni el límite ni el «repetido» cuentan: el visitante tiene que
     poder reintentar. Ver liberarLimite y olvidarMensaje en lib/antispam.ts. */
  const noSalio = () => {
    liberarLimite(ip);
    olvidarMensaje(correo, mensaje);
    return errorDeEnvio(valores, idioma);
  };

  const destino = process.env.CONTACTO_DESTINO?.trim();
  const faltan = faltantesBrevo();
  if (!destino || faltan.length) {
    console.error("[lead] Brevo sin configurar; faltan:", faltan.join(", "));
    return noSalio();
  }

  const fecha = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Monterrey",
  }).format(new Date());

  const filas: [string, string][] = [
    ["Nombre", nombre],
    ["Correo", correo],
    ["Teléfono", telefono || "—"],
    ["Unidad de interés", unidad ?? "Sin especificar"],
    ["Idioma del sitio", idioma === "en" ? "Inglés" : "Español"],
    ["Fecha", fecha],
  ];

  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#F5F5F3;font-family:Arial,Helvetica,sans-serif;color:#212222">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#C2493D">Formulario de contacto · alteadesarrollos.com</p>
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">Nuevo mensaje de ${escapar(nombre)}</h1>
<table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px">
${filas
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #e6e6e3;color:#6b6c6c;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0;border-top:1px solid #e6e6e3">${
        k === "Correo"
          ? `<a href="mailto:${escapar(v)}" style="color:#212222">${escapar(v)}</a>`
          : escapar(v)
      }</td></tr>`,
  )
  .join("\n")}
</table>
<h2 style="margin:24px 0 8px;font-size:15px">Mensaje</h2>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapar(mensaje)}</p>
<p style="margin:28px 0 0;font-size:13px;color:#6b6c6c">Para contestar, responde a este correo: va directo a ${escapar(correo)}.</p>
</td></tr></table></body></html>`;

  const textoPlano = [
    "Nuevo mensaje desde el formulario de contacto de alteadesarrollos.com",
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    "",
    "Mensaje:",
    mensaje,
    "",
    `Para contestar, responde a este correo: va directo a ${correo}.`,
  ].join("\n");

  const resultado = await enviarCorreo({
    para: destino,
    /* La unidad primero: es lo que se usa para repartir en la bandeja. */
    asunto: `Nuevo contacto web · ${unidad ?? "Sin unidad"} · ${nombre}`,
    html,
    texto: textoPlano,
    responderA: { email: correo, name: nombre },
  });

  if (!resultado.ok) {
    /* El motivo técnico al log del servidor; el usuario no lo necesita. */
    console.error("[lead] Brevo no entregó el mensaje:", resultado.motivo);
    return noSalio();
  }

  gastarFicha(ficha);
  return { estado: "enviado" };
}

/** El fallo de envío, con los canales directos para que el contacto no se pierda. */
function errorDeEnvio(valores: Record<string, string>, idioma: Idioma): EstadoLead {
  return {
    estado: "error",
    valores,
    errores: { envio: MENSAJES[idioma].envio(CANALES.correo) },
  };
}
