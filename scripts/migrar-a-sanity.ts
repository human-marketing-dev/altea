/**
 * MIGRACIÓN DEL CONTENIDO A SANITY: de los .ts de hoy a los documentos del
 * Studio (sanity/schemaTypes), EN LOS DOS IDIOMAS. El sitio NO cambia con esto:
 * sigue leyendo los .ts hasta que cada página se pase a Sanity, una por una.
 *
 *   npx tsx scripts/migrar-a-sanity.ts               pasada en seco: no escribe
 *   npx tsx scripts/migrar-a-sanity.ts --escribir    sube las imágenes y escribe
 *
 *   --forzar        sobrescribe documentos que ya existen y son distintos
 *   --build <dir>   dónde está el build (`next build`) contra el que se comparan
 *                   titulares y legales: la raíz de un proyecto o su `.next`.
 *                   Por omisión, la raíz de este proyecto.
 *
 * Se corre desde la raíz del proyecto. Los titulares y los legales se comparan
 * contra el HTML del build, en español (/, /nosotros…) y en inglés (/en…).
 *
 * BILINGÜE (noviembre de 2026). Cada texto es `{ es, en }` (sanity/bilingue.ts).
 * El español sale de los .ts de siempre; el inglés, de sus pares —
 * app/_home/content.en.ts, app/_nosotros/content.en.ts,
 * app/_unidad/contenido/en/*, app/_legal/en/*— y de la mitad `en` de los demás
 * (lib/contacto.ts, app/ui/textos.ts, los TEXTOS de PaginaContacto.tsx y la
 * metadata de app/en/…). Los legales son cuatro documentos, uno por idioma. Lo
 * que no es texto —fotos, números, enlaces— va una sola vez.
 *
 * SE PUEDE CORRER DOS VECES. Los ids son fijos —los documentos únicos tienen el
 * suyo; un proyecto es `proyecto-<slug>` y un giro `giro-<id>`— y las `_key` de
 * las listas salen de un hash de su lugar, así que una segunda corrida escribe
 * exactamente lo mismo encima. Las imágenes tampoco se duplican: Sanity nombra
 * cada archivo por el SHA-1 de su contenido, y lo que ya está no se vuelve a
 * subir. Si un documento ya existe y es distinto de lo que se escribiría, el
 * script se detiene antes de escribir nada (ver --forzar). Los documentos que
 * escribió la migración de octubre (sólo español) tienen otra forma: una corrida
 * real los encuentra «distintos» y necesita --forzar; la pasada en seco dice
 * cuáles son de esa forma vieja y cuándo se tocaron por última vez.
 *
 * LO QUE NO MIGRA, a propósito (inventario §10): la palabra del hero de las
 * unidades, el emblema, la frase de Origen y los campos de estructura. Tampoco
 * borra nada, ni en Sanity ni en /public.
 *
 * La pasada en seco:
 *   1. arma los documentos en memoria;
 *   2. compara los titulares con acento y los legales contra el HTML del build:
 *      el acento tiene que caer en las mismas palabras, en los dos idiomas;
 *   3. los valida con los validadores del Studio (`sanity documents validate
 *      --file`), sin tocar el dataset. Los errores bloquean; los avisos (los
 *      límites de caracteres en inglés) se listan y no bloquean.
 * Al escribir, después vuelve a validar, ya contra el dataset.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

import * as HOME from "@/app/_home/content";
import * as HOME_EN from "@/app/_home/content.en";
import * as NOS from "@/app/_nosotros/content";
import * as NOS_EN from "@/app/_nosotros/content.en";
import { AVISO_DE_PRIVACIDAD } from "@/app/_legal/aviso-de-privacidad";
import { TERMINOS } from "@/app/_legal/terminos";
import { AVISO_DE_PRIVACIDAD as AVISO_DE_PRIVACIDAD_EN } from "@/app/_legal/en/aviso-de-privacidad";
import { TERMINOS as TERMINOS_EN } from "@/app/_legal/en/terminos";
import type { Bloque, DocumentoLegal } from "@/app/_legal/tipos";
import { COMERCIAL } from "@/app/_unidad/contenido/comercial";
import { FORESTAL } from "@/app/_unidad/contenido/forestal";
import { INDUSTRIAL } from "@/app/_unidad/contenido/industrial";
import { VIVIENDA } from "@/app/_unidad/contenido/vivienda";
import { COMERCIAL as COMERCIAL_EN } from "@/app/_unidad/contenido/en/comercial";
import { FORESTAL as FORESTAL_EN } from "@/app/_unidad/contenido/en/forestal";
import { INDUSTRIAL as INDUSTRIAL_EN } from "@/app/_unidad/contenido/en/industrial";
import { VIVIENDA as VIVIENDA_EN } from "@/app/_unidad/contenido/en/vivienda";
import type {
  ContenidoUnidad,
  Giro,
  LineaNegocio,
  ParDato,
  Proyecto,
  ProximoProyecto,
} from "@/app/_unidad/tipos";
import { TEXTOS as TEXTOS_UI } from "@/app/ui/textos";
import { CANALES, MENSAJE_WHATSAPP, REDES } from "@/lib/contacto";
import { rutaDe } from "@/lib/idioma";
import {
  ESTADOS_CON_PRESENCIA,
  M2_CONSTRUIDOS,
  PRESENCIA_INTERNACIONAL,
} from "@/lib/proyectos";
import { PREFIJOS, SIGNOS, SIGNOS_EN, UNIDADES } from "@/sanity/reglas";
import { ESTADOS_MX } from "@/sanity/schemaTypes/estados";
import { UNICOS } from "@/sanity/schemaTypes/index";
import { FORMATOS } from "@/sanity/schemaTypes/proyecto";
import { ICONOS } from "@/sanity/schemaTypes/unidad";

const RAIZ = process.cwd();
const ESCRIBIR = process.argv.includes("--escribir");
const FORZAR = process.argv.includes("--forzar");
const SALIDA = path.join(tmpdir(), "altea-migracion-sanity");

/**
 * El HTML del build: `--build <dir>` acepta la raíz de un proyecto (se le añade
 * `.next`) o el `.next` mismo. Por omisión, el de este proyecto.
 */
const BUILD = (() => {
  const i = process.argv.indexOf("--build");
  const dir = i >= 0 ? process.argv[i + 1] : undefined;
  if (i >= 0 && (!dir || dir.startsWith("--"))) throw new Error("--build necesita una carpeta.");
  const base = path.resolve(RAIZ, dir ?? ".");
  const next = existsSync(path.join(base, "server", "app")) ? base : path.join(base, ".next");
  return path.join(next, "server", "app");
})();

/** Lo que impide escribir. Se junta todo y la pasada para al final. */
const errores: string[] = [];
/** Lo que se migra con una decisión o una transformación que hay que conocer. */
const notas: string[] = [];
/** Lo que se queda fuera: no tiene campo, o no se pudo convertir con certeza. */
const fuera: string[] = [];
/** Lo que se infirió o se eligió, o falta: para que alguien lo revise. */
const revisar: string[] = [];

const sha1 = (x: string | Buffer) => createHash("sha1").update(x).digest("hex");
/** `_key` determinista: el mismo lugar da la misma clave en cada corrida. */
const clave = (...partes: (string | number)[]) => sha1(partes.join("·")).slice(0, 12);

type Doc = { _id: string; _type: string } & Record<string, unknown>;
type Idioma = "es" | "en";
const IDIOMAS: Idioma[] = ["es", "en"];

/** Quita las claves `undefined`: Sanity no las necesita y ensucian la comparación. */
function limpio<T>(valor: T): T {
  if (Array.isArray(valor)) return valor.map(limpio) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, limpio(v)]),
    ) as T;
  }
  return valor;
}

/* ── Los dos idiomas ──────────────────────────────────────────────────── */

const vacio = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

/**
 * Un campo bilingüe `{ es, en }`. Lo que falta en un idioma se queda vacío —
 * nunca se copia del otro— y se anota para revisarlo. `enOpcional`: el inglés
 * puede faltar a propósito (hoy, nada lo pide así sino `soloSiCambia`).
 */
function dos<T>(es: T | undefined, en: T | undefined, donde: string, o: { enOpcional?: boolean } = {}) {
  const sinEs = vacio(es);
  const sinEn = vacio(en);
  if (sinEs && sinEn) return undefined;
  if (sinEs) revisar.push(`${donde}: hay inglés y falta el español; se deja vacío.`);
  if (sinEn && !o.enOpcional) revisar.push(`${donde}: falta el inglés; se deja vacío.`);
  return limpio({ es: sinEs ? undefined : es, en: sinEn ? undefined : en });
}

/**
 * Nombre y ubicación de un proyecto: el inglés sólo si cambia. Vacío, el sitio
 * usa el español (ver proyecto.ts).
 */
const soloSiCambia = (es: string | undefined, en: string | undefined, donde: string) =>
  dos(es, en === es ? undefined : en, donde, { enOpcional: true });

/* ── Archivos: imágenes ───────────────────────────────────────────────── */

interface Archivo {
  /** Como la escribe el contenido: /images/… */
  ruta: string;
  bytes: number;
  /** El id que Sanity le da al subirlo: `image-<sha1>-<ancho>x<alto>-<ext>`. */
  idPrevisto: string;
  /** El que devolvió Sanity al subirlo, si ya se subió en esta corrida. */
  idReal?: string;
  usos: Set<string>;
}
const archivos = new Map<string, Archivo>();

/** Ancho y alto de un WebP, leídos de su cabecera. Todas las fotos del sitio son WebP. */
function medidas(b: Buffer, ruta: string): { ancho: number; alto: number } {
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`${ruta}: no es WebP, y el script sólo sabe medir WebP.`);
  }
  const trozo = b.toString("ascii", 12, 16);
  if (trozo === "VP8X") return { ancho: 1 + b.readUIntLE(24, 3), alto: 1 + b.readUIntLE(27, 3) };
  if (trozo === "VP8L") {
    const [b0, b1, b2, b3] = [b[21], b[22], b[23], b[24]];
    return {
      ancho: 1 + (((b1 & 0x3f) << 8) | b0),
      alto: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }
  if (trozo === "VP8 ") return { ancho: b.readUInt16LE(26) & 0x3fff, alto: b.readUInt16LE(28) & 0x3fff };
  throw new Error(`${ruta}: WebP con un bloque que no conozco (${trozo}).`);
}

function registrar(ruta: string, uso: string): Archivo {
  const previo = archivos.get(ruta);
  if (previo) {
    previo.usos.add(uso);
    return previo;
  }
  const abs = path.join(RAIZ, "public", ruta);
  let archivo: Archivo;
  if (!existsSync(abs)) {
    errores.push(`No existe public${ruta} (${uso}).`);
    archivo = { ruta, bytes: 0, idPrevisto: "image-falta", usos: new Set([uso]) };
  } else {
    const datos = readFileSync(abs);
    const ext = path.extname(ruta).slice(1).toLowerCase();
    const { ancho, alto } = medidas(datos, ruta);
    archivo = { ruta, bytes: datos.length, idPrevisto: `image-${sha1(datos)}-${ancho}x${alto}-${ext}`, usos: new Set([uso]) };
  }
  archivos.set(ruta, archivo);
  return archivo;
}

const idDe = (a: Archivo) => a.idReal ?? a.idPrevisto;

/**
 * El punto de enfoque. Hoy sólo lo tienen las fotos del hero de las unidades:
 * `ancla` es qué punto del ALTO de la foto cae en el centro de la ventana
 * (app/_unidad/tipos.ts), que es justo la `y` del hotspot de Sanity. A lo ancho
 * se centran, como hoy. El tamaño del óvalo no lo usa nadie: sólo marca el punto
 * en el Studio. El resto de las fotos hoy se pinta centrado, que es lo que
 * Sanity hace sin hotspot, así que no lo llevan.
 */
const enfoque = (ancla: number) => ({
  hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: ancla, width: 0.3, height: 0.3 },
  crop: { _type: "sanity.imageCrop", top: 0, bottom: 0, left: 0, right: 0 },
});

/**
 * Una foto. `alt` es `{ es, en }`; sin ninguno de los dos no lleva `alt`, y con
 * uno solo se anota (`dos`).
 */
function imagen(
  ruta: string | undefined,
  uso: string,
  opciones: { alt?: { es?: string; en?: string }; ancla?: number; _key?: string } = {},
) {
  if (!ruta) {
    errores.push(`Falta la foto (${uso}).`);
    return undefined;
  }
  const a = registrar(ruta, uso);
  return limpio({
    _type: "image",
    _key: opciones._key,
    asset: { _type: "reference", _ref: idDe(a) },
    alt: opciones.alt ? dos(opciones.alt.es, opciones.alt.en, `${uso}, descripción de la foto`) : undefined,
    ...(opciones.ancla !== undefined ? enfoque(opciones.ancla) : {}),
  });
}

const referencia = (id: string, _key: string) => ({ _type: "reference", _key, _ref: id });

/* ── Portable Text ────────────────────────────────────────────────────── */

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}
interface Enlace {
  _type: "link";
  _key: string;
  href: string;
}
interface BloquePT {
  _type: "block";
  _key: string;
  style: string;
  markDefs: Enlace[];
  children: Span[];
  listItem?: "bullet";
  level?: number;
}
type Crudo = { text: string; marks: string[] };

/** Junta los tramos vecinos con las mismas marcas: es como los guarda el Studio. */
function juntar(crudos: Crudo[]): Crudo[] {
  const out: Crudo[] = [];
  for (const c of crudos) {
    if (!c.text) continue;
    const ultimo = out.at(-1);
    if (ultimo && ultimo.marks.join() === c.marks.join()) ultimo.text += c.text;
    else out.push({ text: c.text, marks: [...c.marks] });
  }
  return out;
}

const bloque = (base: string, style: string, crudos: Crudo[], markDefs: Enlace[] = []): BloquePT => ({
  _type: "block",
  _key: clave(base),
  style,
  markDefs,
  children: juntar(crudos).map((c, j) => ({ _type: "span", _key: clave(base, j), ...c })),
});

type Trozo = { texto: string; atenuado?: boolean; acento?: boolean };

/**
 * Una línea de titular: hoy, trozos `{ texto, atenuado }` (home) o
 * `{ texto, acento }` (/nosotros); aquí, un bloque con la marca dentro del
 * texto. `separador` es lo que el componente pone entre trozos: el home los
 * separa con un espacio (HeroA.tsx), /nosotros los pega (HeroNube.tsx).
 */
function lineaPT(trozos: readonly Trozo[] | undefined, marca: "atenuado" | "acento", separador: string, base: string): BloquePT[] | undefined {
  if (!trozos) {
    errores.push(`${base}: no hay línea.`);
    return undefined;
  }
  const otra = marca === "atenuado" ? "acento" : "atenuado";
  const crudos: Crudo[] = [];
  trozos.forEach((t, i) => {
    if (t[otra]) errores.push(`${base}: el trozo «${t.texto}» trae «${otra}», que este titular no tiene.`);
    if (i > 0 && separador) crudos.push({ text: separador, marks: [] });
    crudos.push({ text: t.texto, marks: t[marca] ? [marca] : [] });
  });
  return [bloque(base, "normal", crudos)];
}

/** Las dos versiones de una línea del titular, `{ es, en }`. */
const lineaDos = (
  es: readonly Trozo[] | undefined,
  en: readonly Trozo[] | undefined,
  marca: "atenuado" | "acento",
  separador: string,
  base: string,
) => ({ es: lineaPT(es, marca, separador, `${base}·es`), en: lineaPT(en, marca, separador, `${base}·en`) });

/**
 * Un texto legal: el mismo marcado que entiende PaginaLegal.tsx —`**negrita**`,
 * `[texto](url)` y `\n` como salto dentro del párrafo—, con la misma expresión
 * regular. El salto se queda como `\n` en el texto: así lo guarda Portable Text.
 */
function legalPT(bloques: readonly Bloque[], base: string): BloquePT[] {
  const out: BloquePT[] = [];
  const uno = (texto: string, style: string, k: string) => {
    const markDefs: Enlace[] = [];
    const crudos: Crudo[] = [];
    const linea = (t: string, activas: string[]) => {
      const patron = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
      let ultimo = 0;
      for (const m of t.matchAll(patron)) {
        const i = m.index ?? 0;
        if (i > ultimo) crudos.push({ text: t.slice(ultimo, i), marks: activas });
        if (m[1] !== undefined) linea(m[1], [...activas, "strong"]);
        else {
          const enlace: Enlace = { _type: "link", _key: clave(k, "enlace", markDefs.length), href: m[3] };
          markDefs.push(enlace);
          crudos.push({ text: m[2], marks: [...activas, enlace._key] });
        }
        ultimo = i + m[0].length;
      }
      if (ultimo < t.length) crudos.push({ text: t.slice(ultimo), marks: activas });
    };
    texto.split("\n").forEach((l, n) => {
      if (n > 0) crudos.push({ text: "\n", marks: [] });
      linea(l, []);
    });
    return bloque(k, style, crudos, markDefs);
  };
  bloques.forEach((b, i) => {
    const k = `${base}·${i}`;
    if (b.tipo === "p") out.push(uno(b.texto, "normal", k));
    else if (b.tipo === "subtitulo") out.push(uno(b.texto, "h3", k));
    else b.items.forEach((item, j) => out.push({ ...uno(item, "normal", `${k}·${j}`), listItem: "bullet", level: 1 }));
  });
  return out;
}

/* ── Textos escritos directo en páginas y componentes ─────────────────── */

const fuente = (archivoFuente: string) => readFileSync(path.join(RAIZ, archivoFuente), "utf8");

/**
 * Lo poco que no vive en un .ts de contenido sino en el JSX o en la metadata de
 * una página. Se lee del fuente, no se copia aquí: si el patrón no aparece
 * exactamente una vez, es un error y no un texto inventado.
 */
function delFuente(archivoFuente: string, patron: RegExp, que: string): string[] {
  const hallados = [...fuente(archivoFuente).matchAll(new RegExp(patron.source, "g"))];
  if (hallados.length !== 1) {
    errores.push(`${que}: se esperaba una vez en ${archivoFuente} y aparece ${hallados.length}.`);
    return [];
  }
  return hallados[0].slice(1).map((s) => s.replace(/\s+/g, " ").trim());
}

/** La metadata de una página: `metadatosDe("/ruta", "es", { title, description })`. */
const metaDe = (archivoFuente: string) => {
  const [idioma, titulo, descripcion] = delFuente(
    archivoFuente,
    /metadatosDe\(\s*"[^"]*",\s*"(es|en)",\s*\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/,
    `Metadata de ${archivoFuente}`,
  );
  return { idioma, titulo, descripcion };
};
const metaDos = (archivoEs: string, archivoEn: string, donde: string) => {
  const es = metaDe(archivoEs);
  const en = metaDe(archivoEn);
  if (es.idioma && es.idioma !== "es") errores.push(`${archivoEs}: su metadata no es la de español.`);
  if (en.idioma && en.idioma !== "en") errores.push(`${archivoEn}: su metadata no es la de inglés.`);
  return {
    metaTitulo: dos(es.titulo, en.titulo, `${donde}, título para Google`),
    metaDescripcion: dos(es.descripcion, en.descripcion, `${donde}, descripción para Google`),
  };
};

/**
 * Un objeto literal de cadenas, sin exportar, dentro de un fuente: `nombre = {
 * es: { clave: "…" }, en: { … } }` → el bloque de `idioma`, como mapa.
 */
function textosDelFuente(archivoFuente: string, nombre: string, idioma: Idioma): Record<string, string> {
  const texto = fuente(archivoFuente);
  const cuerpo = texto.match(new RegExp(`const ${nombre}\\b[^=]*=\\s*\\{([\\s\\S]*?)\\n\\};`))?.[1];
  const bloqueIdioma = cuerpo?.match(new RegExp(`\\n\\s*${idioma}:\\s*\\{([\\s\\S]*?)\\n\\s*\\},`))?.[1];
  if (!bloqueIdioma) {
    errores.push(`No encontré ${nombre}.${idioma} en ${archivoFuente}.`);
    return {};
  }
  return Object.fromEntries(
    [...bloqueIdioma.matchAll(/(\w+):\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => [m[1], m[2].replace(/\s+/g, " ").trim()]),
  );
}

/**
 * Los países en inglés: el mapa `PAISES` de app/_nosotros/content.en.ts, que no
 * se exporta (es como se leen dentro de la frase: «the United States»).
 */
function paisesEn(): Record<string, string> {
  const cuerpo = fuente("app/_nosotros/content.en.ts").match(/const PAISES\b[^=]*=\s*\{([\s\S]*?)\};/)?.[1];
  if (!cuerpo) {
    errores.push("No encontré PAISES en app/_nosotros/content.en.ts.");
    return {};
  }
  return Object.fromEntries(
    [...cuerpo.matchAll(/(?:"([^"]+)"|([\p{L}]+)):\s*"([^"]+)"/gu)].map((m) => [m[1] ?? m[2], m[3]]),
  );
}

/* ── Las piezas ───────────────────────────────────────────────────────── */

const valoresDe = (lista: readonly { value: string }[]) => new Set(lista.map((x) => x.value));
const PREFIJO_OK = valoresDe(PREFIJOS);
const SIGNO_OK = valoresDe(SIGNOS);
const SIGNO_EN_OK = valoresDe(SIGNOS_EN);
const ICONO_OK = valoresDe(ICONOS);
const ESTADO_OK = valoresDe(ESTADOS_MX);

type CifraTexto = { prefijo?: string; valor: number; signo?: string; nota?: string; etiqueta: string };
const verCifra = (c: CifraTexto, locale: string) => `${c.prefijo ?? ""}${c.valor.toLocaleString(locale)}${c.signo ?? ""}`;

/**
 * Una cifra. El número, el prefijo y el signo se guardan del español. El inglés
 * se pinta con `valorEn ?? valor` y `signoEn ?? signo`, y el «+» del prefijo
 * pasa solo detrás del número (objetos.ts, `cifra`). `valorEn` y `signoEn` se
 * llenan SÓLO cuando hacen falta para reproducir el inglés de hoy, y se sacan
 * del contenido en inglés: su signo sin el «+» es el signo, y el «+» —delante o
 * detrás— es el prefijo. Después se comprueba que lo que pintaría el sitio es lo
 * de hoy.
 */
const inglesDeHoy = (c: CifraTexto) => {
  const signo = c.signo ?? "";
  return { mas: c.prefijo === "+" || signo.includes("+"), valor: c.valor, signo: signo.replace("+", "") };
};
const verEn = (x: { mas: boolean; valor: number; signo: string }) => `${x.valor.toLocaleString("en-US")}${x.signo}${x.mas ? " (+)" : ""}`;

function cifra(tipo: "cifraHome" | "cifraHuella" | "cifraUnidad", es: CifraTexto, en: CifraTexto | undefined, _key: string, donde: string) {
  if (!PREFIJO_OK.has(es.prefijo ?? "")) errores.push(`${donde}: el prefijo «${es.prefijo}» no está en la lista del esquema.`);
  if (!SIGNO_OK.has(es.signo ?? "")) errores.push(`${donde}: el signo «${es.signo}» no está en la lista del esquema.`);
  let valorEn: number | undefined;
  let signoEn: string | undefined;
  if (en) {
    const hoy = inglesDeHoy(en);
    if (hoy.valor !== es.valor) valorEn = hoy.valor;
    if (hoy.signo !== (es.signo ?? "")) signoEn = hoy.signo;
    if (signoEn !== undefined && !SIGNO_EN_OK.has(signoEn)) errores.push(`${donde}: el signo en inglés «${signoEn}» no está en SIGNOS_EN del esquema.`);
    /* Lo que pintaría el sitio con lo que se guarda, contra lo de hoy. */
    const pintaria = { mas: es.prefijo === "+", valor: valorEn ?? es.valor, signo: signoEn ?? es.signo ?? "" };
    const igual = verEn(pintaria) === verEn(hoy);
    cifrasEn.push(
      `${igual ? "igual" : "DISTINTA"}  ${donde}: español «${verCifra(es, "es-MX")}» · inglés hoy «${verCifra(en, "en-US")}» · se guarda${
        valorEn !== undefined ? ` valorEn ${valorEn}` : ""
      }${signoEn !== undefined ? ` signoEn «${signoEn}»` : ""}${valorEn === undefined && signoEn === undefined ? " sólo el español" : ""} → ${verEn(pintaria)}`,
    );
    if (!igual) errores.push(`${donde}: la cifra en inglés no se puede reproducir con valorEn/signoEn (ver CIFRAS EN INGLÉS).`);
  } else revisar.push(`${donde}: no hay cifra en inglés.`);
  return limpio({
    _type: tipo,
    _key,
    prefijo: es.prefijo ?? "",
    valor: es.valor,
    signo: es.signo ?? "",
    valorEn,
    signoEn,
    nota: tipo === "cifraHome" ? dos(es.nota, en?.nota, `${donde}, inicio de la etiqueta`) : undefined,
    etiqueta: dos(es.etiqueta, en?.etiqueta, `${donde}, etiqueta`),
  });
}
/** Cada cifra: lo de hoy en inglés contra lo que pintaría el sitio. */
const cifrasEn: string[] = [];

/** Un texto de una lista con sus dos idiomas (pilares, pie del grupo, países). */
const textoDeLista = (tipo: string, es: string | undefined, en: string | undefined, _key: string, donde: string) =>
  limpio({ _type: tipo, _key, ...dos(es, en, donde) });

/** Junta dos listas que van en el mismo orden; si no miden lo mismo, error. */
function aPares<A, B>(es: readonly A[], en: readonly B[] | undefined, donde: string): [A, B | undefined][] {
  if (en && en.length !== es.length) errores.push(`${donde}: hay ${es.length} en español y ${en.length} en inglés.`);
  return es.map((x, i) => [x, en?.[i]]);
}

/* ── Proyectos ────────────────────────────────────────────────────────── */

const claveUnidad = (u: ContenidoUnidad) => u.unidad.toLowerCase();
const UNIDAD_OK = new Set(UNIDADES.map((u) => u.value as string));
const UNIDADES_CONTENIDO = [COMERCIAL, INDUSTRIAL, VIVIENDA, FORESTAL];
const EN_DE: Record<string, ContenidoUnidad> = {
  comercial: COMERCIAL_EN,
  industrial: INDUSTRIAL_EN,
  vivienda: VIVIENDA_EN,
  forestal: FORESTAL_EN,
};
const enDe = (u: ContenidoUnidad) => EN_DE[claveUnidad(u)];

/**
 * El estado: la página de la unidad no lo dice —sólo separa la lista de los
 * próximos—, el carril del home sí («En operación» / «En desarrollo»). Se toma
 * del home para los destacados y, para el resto de la lista, «En operación».
 */
function estadoDe(p: Proyecto): "operacion" | "desarrollo" {
  const destacado = HOME.FEATURED_PROJECTS.find((f) => f.slug === p.id);
  return destacado?.estado === "En desarrollo" ? "desarrollo" : "operacion";
}
const inferidos = { desarrollo: [] as string[], operacion: [] as string[] };

/** Los pares de la ficha en los dos idiomas, emparejados por posición. */
function datos(tipo: "dato" | "datoGiro", es: readonly ParDato[], en: readonly ParDato[] | undefined, base: string) {
  if (!es.length) return undefined;
  if (!en) revisar.push(`${base}: los datos no tienen inglés.`);
  return aPares(es, en, `${base}, datos`).map(([d, e], i) =>
    limpio({
      _type: tipo,
      _key: clave(base, "dato", i),
      etiqueta: dos(d.etiqueta, e?.etiqueta, `${base}, dato «${d.etiqueta}», etiqueta`),
      valor: dos(d.valor, e?.valor, `${base}, dato «${d.etiqueta}», valor`),
    }),
  );
}

/** El primer dato es el formato: el esquema lo guarda aparte, una sola vez. */
function sinFormato(id: string, es: readonly ParDato[], en: readonly ParDato[] | undefined) {
  const [primero, ...resto] = es;
  const formato = primero?.etiqueta === "Formato" ? primero.valor : undefined;
  if (!formato) {
    errores.push(`proyecto-${id}: su primer dato no es «Formato», y el esquema lo pide como campo propio.`);
    return { formato, resto: es, restoEn: en };
  }
  if (!FORMATOS.includes(formato)) errores.push(`proyecto-${id}: el formato «${formato}» no está en la lista del esquema.`);
  if (en && en[0]?.etiqueta !== "Format") errores.push(`proyecto-${id}: en inglés el primer dato no es «Format».`);
  return { formato, formatoEn: en?.[0]?.valor, resto, restoEn: en?.slice(1) };
}
/** Cómo se escribe hoy cada formato en inglés: el esquema guarda sólo el español. */
const formatosEn = new Map<string, Set<string>>();

function proyectoDeLista(p: Proyecto, u: ContenidoUnidad): Doc {
  const id = `proyecto-${p.id}`;
  const pEn = enDe(u)?.proyectos.lista.find((x) => x.id === p.id);
  if (!pEn) revisar.push(`${id}: no está en la unidad en inglés; todo su inglés queda vacío.`);
  const { formato, formatoEn, resto, restoEn } = sinFormato(p.id, p.datos, pEn?.datos);
  if (formato && formatoEn) formatosEn.set(formato, new Set([...(formatosEn.get(formato) ?? []), formatoEn]));
  const estado = estadoDe(p);
  inferidos[estado].push(p.id);
  return limpio({
    _id: id,
    _type: "proyecto",
    nombre: soloSiCambia(p.nombre, pEn?.nombre, `${id}, nombre`),
    unidad: claveUnidad(u),
    estado,
    ubicacion: soloSiCambia(p.ubicacion, pEn?.ubicacion, `${id}, ubicación`),
    formato,
    foto: p.foto ? imagen(p.foto, `proyecto ${p.id}`, { alt: { es: p.alt, en: pEn?.alt } }) : undefined,
    descripcion: dos(p.descripcion, pEn?.descripcion, `${id}, descripción`),
    aviso: dos(p.aviso, pEn?.aviso, `${id}, chapa`),
    datos: datos("dato", resto, restoEn, id),
    sitio: p.sitio,
  });
}

function proyectoProximo(p: ProximoProyecto, u: ContenidoUnidad): Doc {
  const id = `proyecto-${p.slug}`;
  const pEn = enDe(u)?.proximos.proyectos.find((x) => x.slug === p.slug);
  if (!pEn) revisar.push(`${id}: no está en la unidad en inglés; todo su inglés queda vacío.`);
  /* «Ampliación comercial» en vez de «Comercial»: sólo cuando no es la unidad. */
  const otraEtiqueta = p.unit !== u.unidad;
  return limpio({
    _id: id,
    _type: "proyecto",
    nombre: soloSiCambia(p.name, pEn?.name, `${id}, nombre`),
    unidad: claveUnidad(u),
    estado: "proximo",
    ubicacion: soloSiCambia(p.location, pEn?.location, `${id}, ubicación`),
    foto: p.image ? imagen(p.image, `proyecto ${p.slug}`) : undefined,
    descripcion: dos(p.descripcion, pEn?.descripcion, `${id}, descripción`),
    datos: datos("dato", p.datos ?? [], pEn?.datos ?? (p.datos ? undefined : []), id),
    etiquetaUnidad: otraEtiqueta ? dos(p.unit, pEn?.unit, `${id}, texto de «Unidad»`) : undefined,
  });
}

/* ── Unidades ─────────────────────────────────────────────────────────── */

const ICONO_DE = (titulo: string, icono: string | undefined, donde: string) => {
  if (!icono || !ICONO_OK.has(icono)) errores.push(`${donde}: «${titulo}» trae el icono «${icono}», que no está en la lista del esquema.`);
  return icono;
};

function lineaForestal(l: LineaNegocio | undefined, lEn: LineaNegocio | undefined, nombre: string) {
  if (!l) {
    errores.push(`Forestal: no encontré la línea «${nombre}».`);
    return undefined;
  }
  if (!lEn) revisar.push(`unidad-forestal, ${nombre}: no está en inglés; su inglés queda vacío.`);
  const base = `unidad-forestal·${l.id}`;
  const donde = `unidad-forestal.${nombre}`;
  return limpio({
    rotulo: dos(l.rotulo, lEn?.rotulo, `${donde}, rótulo`),
    parrafos: dos(l.parrafos, lEn?.parrafos, `${donde}, párrafos`),
    fotos: l.fotos.map((f, i) => {
      const fEn = lEn?.fotos.find((x) => x.src === f.src);
      return imagen(f.src, `forestal ${l.id}`, { alt: { es: f.alt, en: fEn?.alt }, _key: clave(base, "foto", i) });
    }),
    listaTitulo: dos(l.lista.rotulo, lEn?.lista.rotulo, `${donde}, título de la lista`),
    listaItems: l.lista.items.map((it, i) => {
      const itEn = lEn?.lista.items.find((x) => x.icono === it.icono);
      return {
        _type: "itemLista",
        _key: clave(base, "item", i),
        titulo: dos(it.titulo, itEn?.titulo, `${donde}, elemento «${it.titulo}»`),
        icono: ICONO_DE(it.titulo, it.icono, `Forestal ${l.titulo}`),
      };
    }),
  });
}

function unidad(u: ContenidoUnidad): Doc {
  const k = claveUnidad(u);
  const id = `unidad-${k}`;
  const uEn = enDe(u);
  if (!UNIDAD_OK.has(k)) errores.push(`${id}: «${u.unidad}» no es una de las cuatro unidades del esquema.`);
  if (!uEn) errores.push(`${id}: no hay contenido en inglés.`);
  const carpeta = HOME.BUSINESS_UNITS.find((b) => b.slug === k);
  const carpetaEn = HOME_EN.BUSINESS_UNITS.find((b) => b.slug === k);
  if (!carpeta) errores.push(`${id}: no tiene carpeta en el home.`);
  if (!carpetaEn) revisar.push(`${id}: no tiene carpeta en el home en inglés.`);

  const doc: Doc = {
    _id: id,
    _type: "unidad",
    frase: dos(carpeta?.apertura, carpetaEn?.apertura, `${id}, frase de la carpeta`),
    descripcion: dos(carpeta?.descripcion, carpetaEn?.descripcion, `${id}, descripción de la carpeta`),
    fotoCarpeta: carpeta ? imagen(carpeta.image, `carpeta ${k}`, { alt: { es: carpeta.alt, en: carpetaEn?.alt } }) : undefined,
    fotosHero: u.hero.fotos.map((f, i) => imagen(f.foto, `hero ${k}`, { ancla: f.ancla, _key: clave(id, "hero", i) })),
    cifras: aPares(u.cifras, uEn?.cifras, `${id}, cifras`).map(([c, cEn], i) =>
      cifra("cifraUnidad", c, cEn, clave(id, "cifra", i), `${id}, cifra ${i + 1}`),
    ),
    metaTitulo: dos(u.metadata.title, uEn?.metadata.title, `${id}, título para Google`),
  };

  if (k !== "forestal") {
    doc.tituloProyectos = dos(u.proyectos.titulo, uEn?.proyectos.titulo, `${id}, título de proyectos`);
    doc.proyectos = u.proyectos.lista.map((p, i) => referencia(`proyecto-${p.id}`, clave(id, "proyecto", i)));
    doc.tituloProximos = dos(u.proximos.titulo, uEn?.proximos.titulo, `${id}, título de próximos`);
    doc.proximos = u.proximos.proyectos.map((p, i) => referencia(`proyecto-${p.slug}`, clave(id, "proximo", i)));
  }
  if (k === "comercial") {
    doc.girosRotulo = dos(u.giros.eyebrow, uEn?.giros.eyebrow, `${id}, rótulo de otros giros`);
    doc.girosTitulo = dos(u.giros.titulo, uEn?.giros.titulo, `${id}, título de otros giros`);
    doc.girosNota = dos(u.giros.nota, uEn?.giros.nota, `${id}, texto de otros giros`);
    doc.giros = u.giros.bloques.map((g, i) => referencia(`giro-${g.id}`, clave(id, "giro", i)));
    doc.marcasTitulo = dos(u.marcas.titulo, uEn?.marcas.titulo, `${id}, título del muro de marcas`);
  }
  if (k === "industrial") {
    doc.atributos = aPares(u.atributos ?? [], uEn?.atributos, `${id}, atributos`).map(([a, aEn], i) => ({
      _type: "atributo",
      _key: clave(id, "atributo", i),
      titulo: dos(a.titulo, aEn?.icono === a.icono ? aEn?.titulo : undefined, `${id}, atributo «${a.titulo}»`),
      icono: ICONO_DE(a.titulo, a.icono, "Industrial, atributos"),
    }));
  }
  if (k === "forestal") {
    const linea = (n: string) => [u.lineas?.find((l) => l.id === n), uEn?.lineas?.find((l) => l.id === n)] as const;
    doc.viveros = lineaForestal(...linea("viveros-asturias"), "viveros-asturias");
    doc.teca = lineaForestal(...linea("teca"), "teca");
  }

  /* El cierre: sin título propio (Forestal), la página pinta el del cierre de
     contacto del home (PaginaUnidad.tsx: `cierre.titulo ?? CONTACT_CTA.title`). */
  const cierreEs = u.cierre?.titulo;
  const cierreEn = uEn?.cierre?.titulo;
  if (!cierreEs) {
    notas.push(`${id}: no tiene título de cierre propio; se guarda el que pinta hoy, el del cierre del home («${HOME.CONTACT_CTA.title}» / «${HOME_EN.CONTACT_CTA.title}»).`);
  }
  doc.cierreTitulo = dos(cierreEs ?? HOME.CONTACT_CTA.title, cierreEs ? cierreEn : (cierreEn ?? HOME_EN.CONTACT_CTA.title), `${id}, título del cierre`);

  /* La descripción para Google es la de la carpeta (esquema). Hoy coincide en
     tres; la de Comercial se calcula a partir de las plazas y no tiene campo. */
  for (const [idioma, meta, desc] of [
    ["es", u.metadata.description, carpeta?.descripcion],
    ["en", uEn?.metadata.description, carpetaEn?.descripcion],
  ] as const) {
    if (meta !== desc) {
      fuera.push(
        `${id} (${idioma}): la descripción para Google de hoy («${meta}») no es la de la carpeta. El esquema no tiene campo para ella: al pasar la página a Sanity, Google leería la de la carpeta.`,
      );
    }
  }
  return limpio(doc);
}

function giro(g: Giro): Doc {
  const id = `giro-${g.id}`;
  const gEn = COMERCIAL_EN.giros.bloques.find((x) => x.id === g.id);
  if (!gEn) revisar.push(`${id}: no está en inglés; su inglés queda vacío.`);
  if (!g.image) errores.push(`${id}: no tiene foto, y el esquema la pide.`);
  return limpio({
    _id: id,
    _type: "giro",
    titulo: dos(g.title, gEn?.title, `${id}, título`),
    descripcion: dos(g.description, gEn?.description, `${id}, descripción`),
    imagen: g.image ? imagen(g.image, `giro ${g.id}`, { alt: { es: g.alt, en: gEn?.alt } }) : undefined,
    datos: datos("datoGiro", g.datos ?? [], gEn?.datos ?? (g.datos ? undefined : []), id),
  });
}

/* ── Legales ──────────────────────────────────────────────────────────── */

/** Uno por idioma. La bajada («Última actualización: …») se guarda tal cual. */
function legal(id: string, idioma: Idioma, d: DocumentoLegal): Doc {
  return limpio({
    _id: id,
    _type: "documentoLegal",
    idioma,
    titulo: d.titulo,
    bajada: d.bajada,
    intro: d.intro?.length ? legalPT(d.intro, `${id}·intro`) : undefined,
    secciones: d.secciones.map((s, i) => ({
      _type: "seccionLegal",
      _key: clave(id, "seccion", i),
      titulo: s.titulo,
      cuerpo: legalPT(s.bloques, `${id}·seccion·${i}`),
    })),
    cierre: d.cierre?.length ? legalPT(d.cierre, `${id}·cierre`) : undefined,
    metaTitulo: d.metadata.title,
    metaDescripcion: d.metadata.description,
  });
}

/* ── Los documentos ───────────────────────────────────────────────────── */

/* ── Destacados del home ──────────────────────────────────────────────── */

type Tarjeta = { slug: string; name: string; location: string; image?: string; descripcion?: string; estado: string };
const CARRIL: Record<Idioma, Tarjeta[]> = { es: HOME.FEATURED_PROJECTS, en: HOME_EN.FEATURED_PROJECTS };
/** El estado de la tarjeta, como lo derivará el sitio de `proyecto.estado`. */
const ESTADO_TARJETA: Record<Idioma, Record<string, string>> = {
  es: { operacion: "En operación", desarrollo: "En desarrollo", proximo: "En desarrollo" },
  en: { operacion: "In operation", desarrollo: "Under development", proximo: "Under development" },
};
type Bi = { es?: string; en?: string } | undefined;
type ProyectoDoc = Doc & { nombre?: Bi; ubicacion?: Bi; descripcion?: Bi; estado?: string; foto?: { asset?: { _ref?: string } } };
/** Lo que pinta el sitio de un texto del proyecto: en inglés, vacío, el español (nombre y ubicación). */
const deProyecto = (v: Bi, idioma: Idioma, conRespaldo: boolean) => v?.[idioma] ?? (conRespaldo ? v?.es : undefined);
/** El id del asset de una ruta de /public, sin anotarla como uso. */
const assetDe = (ruta: string | undefined) => (ruta ? (archivos.get(ruta) ?? registrar(ruta, "carril del home")).idPrevisto : undefined);
const sustituciones: string[] = [];

/**
 * Los destacados, en el orden del home. El proyecto guarda lo de la página de la
 * unidad; lo que el carril del home dice distinto va en el destacado, por
 * idioma y sólo si difiere, para que el home se vea como hoy.
 */
function destacados(docs: Doc[]) {
  return HOME.FEATURED_PROJECTS.map((f, i) => {
    const id = `proyecto-${f.slug}`;
    const p = docs.find((d) => d._id === id) as ProyectoDoc | undefined;
    if (!p) {
      errores.push(`El destacado «${f.slug}» del home no está en ninguna unidad: no hay a qué referenciarlo.`);
      return undefined;
    }
    const tarjeta = { es: f as Tarjeta, en: HOME_EN.FEATURED_PROJECTS.find((x) => x.slug === f.slug) as Tarjeta | undefined };
    if (!tarjeta.en) errores.push(`El destacado «${f.slug}» no está en el home en inglés.`);
    const campo = (nombre: string, deHome: (t: Tarjeta) => string | undefined, valor: Bi, conRespaldo: boolean) => {
      const out: { es?: string; en?: string } = {};
      for (const idioma of IDIOMAS) {
        const t = tarjeta[idioma];
        if (!t) continue;
        const home = deHome(t);
        if ((home ?? "") !== (deProyecto(valor, idioma, conRespaldo) ?? "")) {
          out[idioma] = home;
          sustituciones.push(`${f.slug} · ${nombre} · ${idioma}: «${home}»`);
        }
      }
      return out.es === undefined && out.en === undefined ? undefined : limpio(out);
    };
    const fotoHome = tarjeta.es.image;
    if (tarjeta.en && tarjeta.en.image !== fotoHome) errores.push(`${f.slug}: la tarjeta del home usa otra foto en inglés, y el destacado tiene una sola.`);
    const otraFoto = fotoHome && assetDe(fotoHome) !== p.foto?.asset?._ref;
    if (otraFoto) sustituciones.push(`${f.slug} · foto: ${fotoHome}`);
    return limpio({
      _type: "destacado",
      _key: clave("paginaInicio", "destacado", i),
      proyecto: { _type: "reference", _ref: id },
      nombre: campo("nombre", (t) => t.name, p.nombre, true),
      ubicacion: campo("ubicación", (t) => t.location, p.ubicacion, true),
      descripcion: campo("descripción", (t) => t.descripcion, p.descripcion, false),
      foto: otraFoto ? imagen(fotoHome, `destacado ${f.slug}`) : undefined,
    });
  });
}

const cifraDeStat = (s: { prefix?: string; to: number; suffix?: string; note?: string; label: string }): CifraTexto => ({
  prefijo: s.prefix,
  valor: s.to,
  signo: s.suffix,
  nota: s.note,
  etiqueta: s.label,
});

function construir(): Doc[] {
  const docs: Doc[] = [];

  /* Proyectos: los de cada unidad. Los destacados del home NO crean documento:
     son los mismos, y donde no coinciden manda la página de la unidad. */
  for (const u of UNIDADES_CONTENIDO) {
    for (const p of u.proyectos.lista) docs.push(proyectoDeLista(p, u));
    for (const p of u.proximos.proyectos) docs.push(proyectoProximo(p, u));
  }
  for (const g of COMERCIAL.giros.bloques) docs.push(giro(g));
  for (const u of UNIDADES_CONTENIDO) docs.push(unidad(u));
  for (const [formato, ens] of formatosEn) {
    notas.push(`Formato «${formato}»: el esquema lo guarda una vez, en español; hoy en inglés se escribe «${[...ens].join("», «")}». Al pasar a Sanity, el sitio tiene que traducirlo.`);
  }

  /* Inicio */
  for (const [idioma, h] of [["es", HOME.HERO_A], ["en", HOME_EN.HERO_A]] as const) {
    if (h.lineas.length !== 2) errores.push(`El titular del home (${idioma}) tiene ${h.lineas.length} líneas y el esquema tiene 2.`);
  }
  const NOTA_YOUTUBE = HOME.VIDEO.youtube;
  if (HOME_EN.VIDEO.youtube !== NOTA_YOUTUBE) revisar.push(`paginaInicio.youtube: el video en inglés («${HOME_EN.VIDEO.youtube}») no es el del español («${NOTA_YOUTUBE}»); se guarda el del español.`);
  if (HOME.VIDEO.url || HOME.VIDEO.urlMovil) fuera.push("paginaInicio: el clip local del video ya no tiene campo (el esquema sólo guarda el de YouTube).");
  docs.push(
    limpio({
      _id: "paginaInicio",
      _type: "paginaInicio",
      titularLinea1: lineaDos(HOME.HERO_A.lineas[0], HOME_EN.HERO_A.lineas[0], "atenuado", " ", "paginaInicio·titular·0"),
      titularLinea2: lineaDos(HOME.HERO_A.lineas[1], HOME_EN.HERO_A.lineas[1], "atenuado", " ", "paginaInicio·titular·1"),
      frase: dos(HOME.STATS_INTRO, HOME_EN.STATS_INTRO, "paginaInicio, frase"),
      cifras: aPares(HOME.STATS, HOME_EN.STATS, "paginaInicio, cifras").map(([s, sEn], i) =>
        cifra("cifraHome", cifraDeStat(s), sEn && cifraDeStat(sEn), clave("paginaInicio", "cifra", i), `paginaInicio, cifra ${i + 1}`),
      ),
      youtube: NOTA_YOUTUBE,
      videoTitulo: dos(HOME.VIDEO.titulo, HOME_EN.VIDEO.titulo, "paginaInicio, nombre del video"),
      videoDescripcion: dos(HOME.VIDEO.caption, HOME_EN.VIDEO.caption, "paginaInicio, descripción del video"),
      tituloUnidades: dos(HOME.BUSINESS_UNITS_INTRO.titulo, HOME_EN.BUSINESS_UNITS_INTRO.titulo, "paginaInicio, título de unidades"),
      descripcionUnidades: dos(HOME.BUSINESS_UNITS_INTRO.descripcion, HOME_EN.BUSINESS_UNITS_INTRO.descripcion, "paginaInicio, texto de unidades"),
      tituloProyectos: dos(HOME.FEATURED_PROJECTS_INTRO.titulo, HOME_EN.FEATURED_PROJECTS_INTRO.titulo, "paginaInicio, título del carril"),
      proyectosDestacados: destacados(docs),
    }),
  );
  if (HOME_EN.FEATURED_PROJECTS.map((f) => f.slug).join() !== HOME.FEATURED_PROJECTS.map((f) => f.slug).join()) {
    errores.push("Los destacados del home no son los mismos (o no van en el mismo orden) en español y en inglés.");
  }

  /* Nosotros */
  for (const [idioma, h] of [["es", NOS.HERO], ["en", NOS_EN.HERO]] as const) {
    if (h.lineas.length !== 3) errores.push(`El titular de /nosotros (${idioma}) tiene ${h.lineas.length} líneas y el esquema tiene 3.`);
  }
  const fotosDeLista = (
    es: readonly { src?: string; alt?: string }[],
    en: readonly { src?: string; alt?: string }[],
    uso: string,
    base: string,
  ) =>
    es.map((f, i) =>
      imagen(f.src, uso, { alt: { es: f.alt, en: en.find((x) => x.src === f.src)?.alt }, _key: clave("paginaNosotros", base, i) }),
    );
  const huellaStat = (s: { prefix?: string; to: number; suffix?: string; label: string }): CifraTexto => ({
    prefijo: s.prefix,
    valor: s.to,
    signo: s.suffix,
    etiqueta: s.label,
  });
  docs.push(
    limpio({
      _id: "paginaNosotros",
      _type: "paginaNosotros",
      titularLinea1: lineaDos(NOS.HERO.lineas[0], NOS_EN.HERO.lineas[0], "acento", "", "paginaNosotros·titular·0"),
      titularLinea2: lineaDos(NOS.HERO.lineas[1], NOS_EN.HERO.lineas[1], "acento", "", "paginaNosotros·titular·1"),
      titularLinea3: lineaDos(NOS.HERO.lineas[2], NOS_EN.HERO.lineas[2], "acento", "", "paginaNosotros·titular·2"),
      bajada: dos(NOS.HERO.bajada, NOS_EN.HERO.bajada, "paginaNosotros, texto del hero"),
      origenTitulo: dos(NOS.ORIGEN.title, NOS_EN.ORIGEN.title, "paginaNosotros, título de la historia"),
      origenParrafos: dos(NOS.ORIGEN.parrafos, NOS_EN.ORIGEN.parrafos, "paginaNosotros, párrafos de la historia"),
      origenFotos: fotosDeLista(NOS.ORIGEN.fotos, NOS_EN.ORIGEN.fotos, "origen", "origen"),
      pilaresTitulo: dos(NOS.PILARES.title, NOS_EN.PILARES.title, "paginaNosotros, título de pilares"),
      pilares: NOS.PILARES.bloques.map((b, i) =>
        textoDeLista("pilar", b.title, NOS_EN.PILARES.bloques.find((x) => x.id === b.id)?.title, clave("paginaNosotros", "pilar", i), `paginaNosotros, pilar «${b.id}»`),
      ),
      grupoTitulo: dos(NOS.GRUPO_FIRMA.title, NOS_EN.GRUPO_FIRMA.title, "paginaNosotros, título del grupo"),
      grupoIntro: dos(NOS.GRUPO_FIRMA.intro, NOS_EN.GRUPO_FIRMA.intro, "paginaNosotros, texto del grupo"),
      grupoPie: aPares(NOS.GRUPO_FIRMA.pie, NOS_EN.GRUPO_FIRMA.pie, "paginaNosotros, pie del grupo").map(([es, en], i) =>
        textoDeLista("pieGrupo", es, en, clave("paginaNosotros", "pie", i), `paginaNosotros, pie del grupo ${i + 1}`),
      ),
      huellaTitulo: dos(NOS.HUELLA.title, NOS_EN.HUELLA.title, "paginaNosotros, título de la huella"),
      huellaBoton: dos(NOS.HUELLA.cta.texto, NOS_EN.HUELLA.cta.texto, "paginaNosotros, texto del botón"),
      huellaBotonEnlace: NOS.HUELLA.cta.href,
      huellaCifras: aPares(NOS.HUELLA.stats, NOS_EN.HUELLA.stats, "paginaNosotros, cifras de la huella").map(([s, sEn], i) =>
        cifra("cifraHuella", huellaStat(s), sEn && huellaStat(sEn), clave("paginaNosotros", "huella", i), `paginaNosotros, cifra ${i + 1} de la huella`),
      ),
      huellaDesglose: aPares(NOS.HUELLA.desglose, NOS_EN.HUELLA.desglose, "paginaNosotros, desglose").map(([d, dEn], i) => ({
        _type: "parte",
        _key: clave("paginaNosotros", "desglose", i),
        etiqueta: dos(d.label, dEn?.label, `paginaNosotros, desglose «${d.label}»`),
        valor: d.value,
      })),
      mapaRotulo: dos(NOS.HUELLA.mapa.etiqueta, NOS_EN.HUELLA.mapa.etiqueta, "paginaNosotros, mapa: rótulo"),
      mapaPista: dos(NOS.HUELLA.mapa.pista, NOS_EN.HUELLA.mapa.pista, "paginaNosotros, mapa: indicación"),
      mapaPistaTactil: dos(NOS.HUELLA.mapa.pistaTactil, NOS_EN.HUELLA.mapa.pistaTactil, "paginaNosotros, mapa: indicación táctil"),
      mapaElegir: dos(NOS.HUELLA.mapa.elegir, NOS_EN.HUELLA.mapa.elegir, "paginaNosotros, mapa: lista"),
      mapaEtiquetaEstado: dos(NOS.HUELLA.mapa.etiquetaEstado, NOS_EN.HUELLA.mapa.etiquetaEstado, "paginaNosotros, mapa: etiqueta"),
      mapaSinDato: dos(NOS.HUELLA.mapa.sinDato, NOS_EN.HUELLA.mapa.sinDato, "paginaNosotros, mapa: sin dato"),
      rsRotulo: dos(NOS.RESPONSABILIDAD.eyebrow, NOS_EN.RESPONSABILIDAD.eyebrow, "paginaNosotros, rótulo de RS"),
      rsTitulo: dos(NOS.RESPONSABILIDAD.title, NOS_EN.RESPONSABILIDAD.title, "paginaNosotros, título de RS"),
      rsSubtitulo: dos(NOS.RESPONSABILIDAD.subtitulo, NOS_EN.RESPONSABILIDAD.subtitulo, "paginaNosotros, subtítulo de RS"),
      rsParrafos: dos(NOS.RESPONSABILIDAD.descripcion, NOS_EN.RESPONSABILIDAD.descripcion, "paginaNosotros, párrafos de RS"),
      rsGaleria: NOS.RESPONSABILIDAD.galeria.map((g, i) => {
        const gEn = NOS_EN.RESPONSABILIDAD.galeria.find((x) => x.id === g.id);
        return limpio({
          _type: "fotoGaleria",
          _key: clave("paginaNosotros", "galeria", i),
          imagen: imagen(g.src, "galería RS", { alt: { es: g.alt, en: gEn?.alt } }),
          pie: dos(g.nota, gEn?.nota, `paginaNosotros, pie de la foto «${g.id}»`),
        });
      }),
      verdesTitulo: dos(NOS.RESPONSABILIDAD.verdes.titulo, NOS_EN.RESPONSABILIDAD.verdes.titulo, "paginaNosotros, título de entornos verdes"),
      verdesParrafos: dos(NOS.RESPONSABILIDAD.verdes.descripcion, NOS_EN.RESPONSABILIDAD.verdes.descripcion, "paginaNosotros, párrafos de entornos verdes"),
      verdesGaleria: fotosDeLista(NOS.RESPONSABILIDAD.verdes.galeria, NOS_EN.RESPONSABILIDAD.verdes.galeria, "galería de entornos verdes", "verdes"),
      ...metaDos("app/nosotros/page.tsx", "app/en/about-us/page.tsx", "paginaNosotros"),
    }),
  );

  /* Contacto: los TEXTOS de PaginaContacto.tsx y el mensaje del formulario
     (app/ui/textos.ts). */
  const cto = { es: textosDelFuente("app/_contacto/PaginaContacto.tsx", "TEXTOS", "es"), en: textosDelFuente("app/_contacto/PaginaContacto.tsx", "TEXTOS", "en") };
  docs.push(
    limpio({
      _id: "paginaContacto",
      _type: "paginaContacto",
      titulo: dos(cto.es.titulo, cto.en.titulo, "paginaContacto, título"),
      descripcion: dos(cto.es.descripcion, cto.en.descripcion, "paginaContacto, texto"),
      textoWhatsapp: dos(cto.es.whatsappValor, cto.en.whatsappValor, "paginaContacto, texto de WhatsApp"),
      exitoTitulo: dos(TEXTOS_UI.es.formulario.gracias, TEXTOS_UI.en.formulario.gracias, "paginaContacto, mensaje al enviar: título"),
      exitoTexto: dos(TEXTOS_UI.es.formulario.gracias2, TEXTOS_UI.en.formulario.gracias2, "paginaContacto, mensaje al enviar: texto"),
      ...metaDos("app/contacto/page.tsx", "app/en/contact/page.tsx", "paginaContacto"),
    }),
  );

  /* Legales: uno por documento y por idioma. */
  docs.push(
    legal("legal-aviso", "es", AVISO_DE_PRIVACIDAD),
    legal("legal-aviso-en", "en", AVISO_DE_PRIVACIDAD_EN),
    legal("legal-terminos", "es", TERMINOS),
    legal("legal-terminos-en", "en", TERMINOS_EN),
  );

  /* Presencia */
  const paises = paisesEn();
  docs.push({
    _id: "presencia",
    _type: "presencia",
    estados: ESTADOS_CON_PRESENCIA.map((e) => {
      if (!ESTADO_OK.has(e)) errores.push(`Presencia: «${e}» no está en la lista de estados del esquema.`);
      return limpio({ _type: "estadoPresencia", _key: clave("presencia", e), estado: e, m2: M2_CONSTRUIDOS[e] });
    }),
    paises: PRESENCIA_INTERNACIONAL.map((p) => textoDeLista("pais", p, paises[p], clave("presencia", "pais", p), `presencia, país «${p}»`)),
  });

  /* Cierre y ajustes */
  docs.push({
    _id: "cierre",
    _type: "cierre",
    rotulo: dos(HOME.CONTACT_CTA.eyebrow, HOME_EN.CONTACT_CTA.eyebrow, "cierre, rótulo"),
    titulo: dos(HOME.CONTACT_CTA.title, HOME_EN.CONTACT_CTA.title, "cierre, título"),
  });
  const red = (icono: string) => REDES.find((r) => r.icono === icono)?.url;
  if (MENSAJE_WHATSAPP.es !== CANALES.whatsappMensaje) errores.push("lib/contacto.ts: MENSAJE_WHATSAPP.es no es CANALES.whatsappMensaje.");
  docs.push(
    limpio({
      _id: "ajustesSitio",
      _type: "ajustesSitio",
      correo: CANALES.correo,
      telefono: CANALES.telefono,
      whatsapp: CANALES.whatsapp,
      whatsappMensaje: dos(MENSAJE_WHATSAPP.es, MENSAJE_WHATSAPP.en, "ajustesSitio, mensaje de WhatsApp"),
      domicilio: CANALES.domicilio,
      mapa: CANALES.mapa,
      facebook: red("facebook"),
      instagram: red("instagram"),
      linkedin: red("linkedin"),
      /* El título y la descripción del HOME (app/page.tsx y app/en/page.tsx), no
         los del layout: el home tiene los suyos desde el 9 nov. */
      ...metaDos("app/page.tsx", "app/en/page.tsx", "ajustesSitio"),
    }),
  );

  return docs;
}

/* ── Comprobaciones contra lo que se ve hoy ───────────────────────────── */

const html = (pagina: string) => {
  const p = path.join(BUILD, `${pagina}.html`);
  if (!existsSync(p)) {
    errores.push(`No está ${p}: corre \`next build\` antes (o pasa --build), la comparación se hace contra el HTML.`);
    return "";
  }
  return readFileSync(p, "utf8");
};

const ENTIDADES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&nbsp;": " " };
const texto = (h: string) =>
  h
    .replace(/<!--.*?-->/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&[#\w]+;/g, (e) => ENTIDADES[e] ?? e);

type Palabra = { palabra: string; marcada: boolean | "a medias" };

/** Las palabras de una línea, cada una con si va marcada; «a medias» es un error. */
function palabras(tramos: { text: string; marcado: boolean }[]): Palabra[] {
  const chars = tramos.flatMap((t) => [...t.text].map((c) => ({ c, m: t.marcado })));
  const out: Palabra[] = [];
  let actual: { c: string; m: boolean }[] = [];
  const cerrar = () => {
    if (!actual.length) return;
    const marcas = new Set(actual.map((x) => x.m));
    out.push({ palabra: actual.map((x) => x.c).join(""), marcada: marcas.size > 1 ? "a medias" : actual[0].m });
    actual = [];
  };
  for (const x of chars) {
    if (/\s/.test(x.c)) cerrar();
    else actual.push(x);
  }
  cerrar();
  return out;
}

const verLinea = (ps: Palabra[]) => ps.map((p) => (p.marcada === true ? `[${p.palabra}]` : p.marcada ? `{${p.palabra}?}` : p.palabra)).join(" ");

/**
 * El acento, palabra por palabra y en cada idioma: lo que pinta el build (las
 * clases `hero-a__atenuado` / `nos-hero__acento` del h1) contra lo que quedó
 * marcado en el bloque. Una línea que no coincide se queda fuera de la
 * migración (ese idioma).
 */
function verificarAcentos(docs: Doc[]) {
  const casos = [
    { pagina: "index", idioma: "es", doc: "paginaInicio", linea: "hero-a__linea", marca: "hero-a__atenuado", campos: ["titularLinea1", "titularLinea2"] },
    { pagina: "en", idioma: "en", doc: "paginaInicio", linea: "hero-a__linea", marca: "hero-a__atenuado", campos: ["titularLinea1", "titularLinea2"] },
    { pagina: "nosotros", idioma: "es", doc: "paginaNosotros", linea: "nos-hero__linea", marca: "nos-hero__acento", campos: ["titularLinea1", "titularLinea2", "titularLinea3"] },
    { pagina: "en/about-us", idioma: "en", doc: "paginaNosotros", linea: "nos-hero__linea", marca: "nos-hero__acento", campos: ["titularLinea1", "titularLinea2", "titularLinea3"] },
  ] as const;
  const resultado: string[] = [];
  for (const c of casos) {
    const h = html(c.pagina);
    if (!h) continue;
    const lineas = [...h.matchAll(new RegExp(`<span class="${c.linea}[^"]*"[^>]*><span>((?:<span(?: class="[^"]*")?>.*?</span>)*)</span></span>`, "g"))].map((m) =>
      palabras([...m[1].matchAll(/<span(?: class="([^"]*)")?>(.*?)<\/span>/g)].map((s) => ({ text: texto(s[2]), marcado: (s[1] ?? "").split(" ").includes(c.marca) }))),
    );
    const doc = docs.find((d) => d._id === c.doc)!;
    if (lineas.length !== c.campos.length) {
      errores.push(`${c.doc} (${c.idioma}): el build tiene ${lineas.length} líneas de titular y el documento ${c.campos.length}.`);
      continue;
    }
    c.campos.forEach((campo, i) => {
      const par = doc[campo] as Partial<Record<Idioma, BloquePT[]>> | undefined;
      const bloques = par?.[c.idioma] ?? [];
      const enDoc = palabras(bloques.flatMap((b) => b.children.map((s) => ({ text: s.text, marcado: s.marks.length > 0 }))));
      const igual = JSON.stringify(enDoc) === JSON.stringify(lineas[i]) && !enDoc.some((p) => p.marcada === "a medias");
      resultado.push(`${igual ? "igual" : "DISTINTO"}  ${c.doc}.${campo}.${c.idioma}: hoy «${verLinea(lineas[i])}» · migrado «${verLinea(enDoc)}»`);
      if (!igual && par) {
        fuera.push(`${c.doc}.${campo}.${c.idioma}: el acento no cae en las mismas palabras que hoy; se deja fuera para migrarlo a mano.`);
        delete par[c.idioma];
      }
    });
  }
  return resultado;
}

/**
 * Los legales contra su página: el texto visible, las negritas y los enlaces
 * tienen que ser los mismos que pinta el build en `<article class="leg">`. Un
 * enlace interno se guarda como lo escribe el contenido (`/aviso-de-privacidad`)
 * y PaginaLegal.tsx lo traduce al pintarlo (`rutaDe`, → `/en/privacy-notice`):
 * aquí se compara ya traducido, igual que lo pinta.
 */
function verificarLegales(docs: Doc[]) {
  const resultado: string[] = [];
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  for (const [id, pagina, idioma] of [
    ["legal-aviso", "aviso-de-privacidad", "es"],
    ["legal-aviso-en", "en/privacy-notice", "en"],
    ["legal-terminos", "terminos", "es"],
    ["legal-terminos-en", "en/terms", "en"],
  ] as const) {
    const h = html(pagina);
    if (!h) continue;
    const art = h.match(/<article class="leg">([\s\S]*?)<\/article>/)?.[1] ?? "";
    const doc = docs.find((d) => d._id === id)!;
    const secciones = doc.secciones as { titulo: string; cuerpo: BloquePT[] }[];
    const todos: BloquePT[][] = [
      (doc.intro as BloquePT[]) ?? [],
      ...secciones.map((s) => s.cuerpo),
      (doc.cierre as BloquePT[]) ?? [],
    ];
    const textoDe = (bs: BloquePT[]) => bs.map((b) => b.children.map((s) => s.text).join("")).join(" ");
    const enDoc = norm([textoDe(todos[0]), ...secciones.map((s, i) => `${s.titulo} ${textoDe(todos[i + 1])}`), textoDe(todos.at(-1)!)].join(" "));
    /* En el HTML los bloques van pegados (`</h2><p>`): se separan como en el documento. */
    const enHtml = norm(texto(art.replace(/<\/(p|h2|h3|li|ul|section|div)>/g, " ")));

    const negritasHtml = [...art.matchAll(/<strong>([\s\S]*?)<\/strong>/g)].map((m) => norm(texto(m[1])));
    const enlacesHtml = [...art.matchAll(/<a [^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => `${texto(m[1])} → ${norm(texto(m[2]))}`);
    const negritasDoc: string[] = [];
    const enlacesDoc: string[] = [];
    for (const b of todos.flat()) {
      let racha = "";
      for (const s of [...b.children, { text: "", marks: [] as string[] }]) {
        if (s.marks.includes("strong")) racha += s.text;
        else if (racha) {
          negritasDoc.push(norm(racha));
          racha = "";
        }
        const enlace = b.markDefs.find((d) => s.marks.includes(d._key));
        if (enlace) enlacesDoc.push(`${enlace.href.startsWith("/") ? rutaDe(enlace.href, idioma) : enlace.href} → ${norm(s.text)}`);
      }
    }
    const ok = {
      texto: enDoc === enHtml,
      negritas: JSON.stringify(negritasDoc) === JSON.stringify(negritasHtml),
      enlaces: JSON.stringify(enlacesDoc) === JSON.stringify(enlacesHtml),
    };
    resultado.push(
      `${Object.values(ok).every(Boolean) ? "igual" : "DISTINTO"}  ${id}: texto ${ok.texto ? "igual" : "DISTINTO"} (${enHtml.length} caracteres), ${negritasHtml.length} negritas ${ok.negritas ? "iguales" : "DISTINTAS"}, ${enlacesHtml.length} enlaces ${ok.enlaces ? "iguales" : "DISTINTOS"}`,
    );
    if (!ok.texto) {
      const i = [...enDoc].findIndex((ch, n) => ch !== enHtml[n]);
      resultado.push(`      primera diferencia en el carácter ${i}: hoy «…${enHtml.slice(Math.max(0, i - 40), i + 40)}…» · migrado «…${enDoc.slice(Math.max(0, i - 40), i + 40)}…»`);
    }
    if (!ok.negritas) resultado.push(`      negritas hoy ${JSON.stringify(negritasHtml)} · migradas ${JSON.stringify(negritasDoc)}`);
    if (!ok.enlaces) resultado.push(`      enlaces hoy ${JSON.stringify(enlacesHtml)} · migrados ${JSON.stringify(enlacesDoc)}`);
    if (!Object.values(ok).every(Boolean)) errores.push(`${id}: no coincide con la página de hoy (ver la comparación).`);
  }
  return resultado;
}

/**
 * DESTACADOS DEL HOME: lo que pintaría el carril con lo que se guarda —el
 * destacado, y si no dice nada, su proyecto; el estado derivado de
 * `proyecto.estado`— contra el contenido del home de hoy, en cada idioma.
 */
function verificarDestacados(docs: Doc[]) {
  const filas: string[] = [];
  const inicio = docs.find((d) => d._id === "paginaInicio");
  const lista = (inicio?.proyectosDestacados ?? []) as {
    proyecto: { _ref: string };
    nombre?: Bi;
    ubicacion?: Bi;
    descripcion?: Bi;
    foto?: { asset?: { _ref?: string } };
  }[];
  for (const idioma of IDIOMAS) {
    const hoy = CARRIL[idioma];
    if (hoy.length !== lista.length) errores.push(`Destacados (${idioma}): el home tiene ${hoy.length} y el documento ${lista.length}.`);
    hoy.forEach((t, i) => {
      const d = lista[i];
      const p = docs.find((x) => x._id === d?.proyecto._ref) as ProyectoDoc | undefined;
      if (!d || !p || d.proyecto._ref !== `proyecto-${t.slug}`) {
        errores.push(`Destacados (${idioma}): en el lugar ${i + 1} el home tiene «${t.slug}» y el documento «${d?.proyecto._ref}».`);
        return;
      }
      const pinta: [string, string | undefined, string | undefined][] = [
        ["nombre", t.name, d.nombre?.[idioma] ?? deProyecto(p.nombre, idioma, true)],
        ["ubicación", t.location, d.ubicacion?.[idioma] ?? deProyecto(p.ubicacion, idioma, true)],
        ["descripción", t.descripcion, d.descripcion?.[idioma] ?? deProyecto(p.descripcion, idioma, false)],
        ["foto", assetDe(t.image), d.foto?.asset?._ref ?? p.foto?.asset?._ref],
        ["estado", t.estado, ESTADO_TARJETA[idioma][p.estado ?? ""]],
      ];
      const difs = pinta.filter(([, a, b]) => (a ?? "") !== (b ?? ""));
      filas.push(
        difs.length
          ? `DISTINTO  ${t.slug} (${idioma}): ${difs.map(([c, a, b]) => `${c}: hoy «${a}» · pintaría «${b}»`).join(" · ")}`
          : `igual  ${t.slug} (${idioma}): nombre, ubicación, descripción, foto y estado («${t.estado}», de «${p.estado}»)`,
      );
      if (difs.length) errores.push(`Destacado ${t.slug} (${idioma}): el home cambiaría (ver DESTACADOS DEL HOME).`);
    });
  }
  return filas;
}

/* ── Validación con el esquema del Studio ─────────────────────────────── */

type Marcador = {
  path: (string | number | { _key: string })[];
  level: string;
  message: string;
  code?: string;
  details?: { referenceId?: string };
};

/**
 * `sanity documents validate`: los mismos validadores que bloquean «Publicar»
 * en el Studio. Con `archivo`, valida ese NDJSON sin tocar el dataset; sin él,
 * lo que hay en el dataset. Devuelve errores y avisos por separado: los avisos
 * (los límites en inglés) no bloquean.
 */
function validar(archivoNdjson?: string, porSubir: Set<string> = new Set()) {
  const r = spawnSync(
    "npx",
    ["sanity", "documents", "validate", "-y", "--level", "warning", "--format", "ndjson", ...(archivoNdjson ? ["--file", archivoNdjson] : [])],
    { cwd: RAIZ, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, SANITY_AUTH_TOKEN: process.env.SANITY_API_TOKEN } },
  );
  const porDoc = new Map<string, Marcador[]>();
  const avisos = new Map<string, Marcador[]>();
  const raros: string[] = [];
  let pendientes = 0;
  for (const l of (r.stdout ?? "").split("\n").filter(Boolean)) {
    try {
      const x = JSON.parse(l) as { documentId: string; documentType: string; markers: Marcador[] };
      if (x.documentType.startsWith("sanity.")) continue;
      /* Una imagen que todavía no está en el dataset no puede «estar publicada»:
         en la pasada en seco eso no es un error del contenido. El validador no
         acepta las fichas del archivo para esto; sólo las del dataset. */
      const reales = x.markers.filter((m) => {
        const pendiente = m.code === "reference.not-published" && porSubir.has(m.details?.referenceId ?? "");
        if (pendiente) pendientes++;
        return !pendiente;
      });
      const err = reales.filter((m) => m.level === "error");
      const av = reales.filter((m) => m.level === "warning");
      if (err.length) porDoc.set(x.documentId, err);
      if (av.length) avisos.set(x.documentId, av);
    } catch {
      raros.push(l);
    }
  }
  const err = (r.stderr ?? "").split("\n").filter((l) => l.trim() && !/EEXIT: 1/.test(l));
  return { porDoc, avisos, raros: [...raros, ...err], pendientes };
}

const rutaMarcador = (p: Marcador["path"]) => p.map((x) => (typeof x === "object" ? `[${x._key}]` : x)).join(".");

/**
 * ¿Es un documento de la migración de octubre (sólo español)? Un campo que
 * ahora es `{ es, en }` y en el dataset es un texto suelto, o un legal sin
 * `idioma`.
 */
function formaVieja(ya: Doc, nuevo: Doc) {
  if (nuevo._type === "documentoLegal") return ya.idioma === undefined;
  const esBi = (v: unknown) => !!v && typeof v === "object" && !Array.isArray(v) && ("es" in v || "en" in v);
  return Object.entries(nuevo).some(
    ([k, v]) =>
      (esBi(v) && (typeof ya[k] === "string" || Array.isArray(ya[k]))) ||
      /* Una lista de textos que ahora es de objetos `{ es, en }` (países, pilares). */
      (Array.isArray(v) && esBi(v[0]) && Array.isArray(ya[k]) && typeof (ya[k] as unknown[])[0] === "string"),
  );
}

/* ── Principal ────────────────────────────────────────────────────────── */

async function main() {
  loadEnvConfig(RAIZ);
  const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = "production", SANITY_API_TOKEN: token } = process.env;
  if (!projectId || !token) {
    console.error("Faltan NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_TOKEN en .env.local.");
    return 1;
  }

  const docs = construir();
  const acentos = verificarAcentos(docs);
  const legales = verificarLegales(docs);
  const dups = verificarDestacados(docs);

  const ids = new Set(docs.map((d) => d._id));
  for (const u of UNICOS) {
    const d = docs.find((x) => x._id === u.id);
    if (!d) errores.push(`Falta el documento único ${u.id}.`);
    else if (d._type !== u.tipo) errores.push(`El documento único ${u.id} es «${d._type}» y el esquema dice «${u.tipo}».`);
  }
  const refs = JSON.stringify(docs).matchAll(/"_ref":"((?:proyecto|giro)-[^"]+)"/g);
  for (const [, ref] of refs) if (!ids.has(ref)) errores.push(`Se referencia ${ref}, que no está entre los documentos.`);

  /* El estado del dataset: qué hay ya y qué cambiaría. Sólo lectura. */
  const client = createClient({ projectId, dataset, apiVersion: "2026-10-01", token, useCdn: false });
  const todosLosIds = [...ids, ...[...ids].map((i) => `drafts.${i}`)];
  const existentes = await client.fetch<Doc[]>("*[_id in $ids]", { ids: todosLosIds });
  const tipos = [...new Set(docs.map((d) => d._type))];
  const huerfanos = await client.fetch<{ _id: string; _type: string }[]>(
    "*[_type in $tipos && !(_id in $ids) && !(_id in path('drafts.**'))]{_id, _type}",
    { tipos, ids: [...ids] },
  );
  /* Comparación sin los campos de sistema y con las claves ordenadas EN TODOS LOS
     NIVELES: Sanity devuelve los objetos anidados con otro orden de claves. */
  const estable = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(estable)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, estable((v as Record<string, unknown>)[k])]))
        : v;
  const ordenado = (d: Doc) =>
    JSON.stringify(estable(Object.fromEntries(Object.entries(d).filter(([k]) => !["_rev", "_createdAt", "_updatedAt"].includes(k)))));
  const estado = { nuevos: [] as string[], iguales: [] as string[], distintos: [] as string[], viejos: [] as string[], borradores: [] as string[] };
  let ultimaEdicion = "";
  for (const d of docs) {
    const ya = existentes.find((e) => e._id === d._id);
    if (!ya) estado.nuevos.push(d._id);
    else if (ordenado(ya) === ordenado(d)) estado.iguales.push(d._id);
    else {
      estado.distintos.push(d._id);
      if (formaVieja(ya, d)) estado.viejos.push(d._id);
      const editado = String(ya._updatedAt ?? "");
      if (editado > ultimaEdicion) ultimaEdicion = editado;
    }
    if (existentes.some((e) => e._id === `drafts.${d._id}`)) estado.borradores.push(d._id);
  }
  const assetsYa = new Set(await client.fetch<string[]>("*[_id in $ids]._id", { ids: [...archivos.values()].map((a) => a.idPrevisto) }));

  /* La validación del Studio sobre lo que se va a escribir, sin escribirlo. Van
     también unas fichas mínimas de las imágenes para que sus referencias
     resuelvan; sus propios avisos no se cuentan. */
  mkdirSync(SALIDA, { recursive: true });
  const ndjson = path.join(SALIDA, "documentos.ndjson");
  const fichas = [...new Set([...archivos.values()].map((a) => a.idPrevisto))].map((id) => ({ _id: id, _type: "sanity.imageAsset" }));
  writeFileSync(ndjson, [...docs, ...fichas].map((d) => JSON.stringify(d)).join("\n") + "\n");
  const previa = validar(ndjson, new Set([...archivos.values()].map((a) => a.idPrevisto).filter((id) => !assetsYa.has(id))));

  /* ── El resumen ── */
  const porTipo = new Map<string, string[]>();
  for (const d of docs) porTipo.set(d._type, [...(porTipo.get(d._type) ?? []), d._id]);
  const imgs = [...archivos.values()];
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  const usos = imgs.reduce((n, a) => n + a.usos.size, 0);
  /* Sanity guarda una vez cada contenido: dos rutas con el mismo archivo son un solo asset. */
  const imgsUnicas = [...new Map(imgs.map((a) => [a.idPrevisto, a])).values()];
  const peso = (lista: Archivo[]) => mb(lista.reduce((n, a) => n + a.bytes, 0));

  const linea = (s = "") => console.log(s);
  linea(`\n${ESCRIBIR ? "MIGRACIÓN" : "PASADA EN SECO — no se escribe nada"} · proyecto ${projectId} · dataset ${dataset}`);
  linea(`Build: ${BUILD}\n`);
  linea(`DOCUMENTOS: ${docs.length}`);
  for (const [t, l] of porTipo) linea(`  ${t.padEnd(16)} ${String(l.length).padStart(2)}  ${l.length > 4 ? "" : l.join(", ")}`);
  linea(`\nEN EL DATASET HOY: ${estado.nuevos.length} nuevos · ${estado.iguales.length} iguales · ${estado.distintos.length} distintos · ${estado.borradores.length} con borrador`);
  if (estado.nuevos.length) linea(`  nuevos: ${estado.nuevos.join(", ")}`);
  if (estado.distintos.length) {
    const otros = estado.distintos.filter((id) => !estado.viejos.includes(id));
    linea(`  distintos: ${estado.distintos.length}, de ellos ${estado.viejos.length} con la forma de la migración de octubre (sólo español). Última edición de los distintos: ${ultimaEdicion || "—"}.`);
    if (otros.length) linea(`  distintos SIN la forma vieja (¿editados en el Studio?): ${otros.join(", ")}`);
    linea("  → Una corrida real los sobrescribe sólo con --forzar. Es lo esperado: el esquema cambió de forma.");
  }
  if (estado.borradores.length) linea(`  con borrador abierto en el Studio: ${estado.borradores.join(", ")}`);
  if (huerfanos.length) linea(`  en el dataset y no en la migración (no se tocan): ${huerfanos.map((h) => h._id).join(", ")}`);
  linea(`\nIMÁGENES: ${imgsUnicas.length} assets (${peso(imgsUnicas)}) para ${usos} lugares. Son ${imgs.length} rutas en /public; las repetidas byte a byte se suben una vez:`);
  for (const a of imgsUnicas) {
    const iguales = imgs.filter((b) => b.idPrevisto === a.idPrevisto && b !== a);
    if (iguales.length) linea(`    ${a.ruta} = ${iguales.map((b) => b.ruta).join(" = ")}`);
  }
  linea(`  ya en Sanity: ${imgsUnicas.filter((a) => assetsYa.has(a.idPrevisto)).length} · por subir: ${imgsUnicas.filter((a) => !assetsYa.has(a.idPrevisto)).length} (${peso(imgsUnicas.filter((a) => !assetsYa.has(a.idPrevisto)))})`);
  linea(`  con punto de enfoque (fotos del hero): ${docs.filter((d) => d._type === "unidad").reduce((n, d) => n + ((d.fotosHero as unknown[]) ?? []).length, 0)}`);

  linea("\nACENTOS, contra el HTML del build ([marcada]):");
  for (const r of acentos) linea(`  ${r}`);
  linea("\nLEGALES, contra el HTML del build:");
  for (const r of legales) linea(`  ${r}`);
  linea("\nCIFRAS EN INGLÉS (número y signo como los pintaría el sitio; (+) = el «+» que el sitio pone detrás):");
  for (const r of cifrasEn) linea(`  ${r}`);
  linea("\nDESTACADOS DEL HOME (lo que pintaría el carril contra el home de hoy):");
  for (const r of dups) linea(`  ${r}`);
  linea("  lo que el home dice distinto del proyecto y se guarda en el destacado:");
  for (const r of sustituciones) linea(`    · ${r}`);
  if (!sustituciones.length) linea("    nada");
  linea("\nTRANSFORMACIONES Y SUPUESTOS:");
  for (const r of notas) linea(`  · ${r}`);
  linea(`  · ESTADO INFERIDO, NO DATO: la página de la unidad no dice si un proyecto está en operación o en desarrollo. «En desarrollo» porque así lo pone el carril del home: ${inferidos.desarrollo.join(", ")}. «En operación» por omisión: los otros ${inferidos.operacion.length} de las listas. Los próximos sí son dato: están en «Próximos proyectos».`);
  linea("\nPARA REVISAR (inferido, elegido o vacío):");
  for (const r of revisar) linea(`  · ${r}`);
  if (!revisar.length) linea("  nada");
  linea("\nNO SE MIGRA:");
  for (const r of fuera) linea(`  · ${r}`);

  linea(`\nVALIDACIÓN DEL STUDIO sobre lo que se escribiría (${previa.porDoc.size} documentos con errores):`);
  for (const [id, ms] of previa.porDoc) for (const m of ms) linea(`  ✗ ${id} · ${rutaMarcador(m.path)}: ${m.message}`);
  for (const r of previa.raros) linea(`  ? ${r}`);
  if (!previa.porDoc.size && !previa.raros.length) linea("  todos pasan");
  if (previa.pendientes) linea(`  (más ${previa.pendientes} referencias a imágenes que se suben al escribir: el validador sólo las da por buenas cuando están en el dataset; se comprueban en la validación final)`);
  const nAvisos = [...previa.avisos.values()].reduce((n, l) => n + l.length, 0);
  linea(`\nAVISOS (no bloquean; en inglés los límites sólo avisan): ${nAvisos}`);
  for (const [id, ms] of previa.avisos) for (const m of ms) linea(`  ⚠ ${id} · ${rutaMarcador(m.path)}: ${m.message}`);

  if (errores.length) {
    linea("\nERRORES — no se puede escribir así:");
    for (const e of errores) linea(`  ✗ ${e}`);
  }
  linea(`\nLos documentos tal como se escribirían: ${ndjson}`);

  if (!ESCRIBIR) {
    linea(
      `\nPasada en seco: no se escribió nada. Para escribir: --escribir${estado.distintos.length || estado.borradores.length ? " --forzar (hay documentos distintos en el dataset)" : ""}`,
    );
    return errores.length || previa.porDoc.size ? 1 : 0;
  }
  if (errores.length || previa.porDoc.size) return 1;
  if ((estado.distintos.length || estado.borradores.length) && !FORZAR) {
    linea("\nHay documentos distintos en el dataset (o con borrador). No escribo nada: revísalos, o corre con --forzar para sobrescribirlos.");
    return 1;
  }

  /* 1 · Imágenes: sólo las que no están, y cada contenido una vez. */
  const subidos = new Map<string, string>();
  for (const a of archivos.values()) {
    if (assetsYa.has(a.idPrevisto)) continue;
    const ya = subidos.get(a.idPrevisto);
    if (ya) {
      a.idReal = ya;
      continue;
    }
    const subido = await client.assets.upload("image", readFileSync(path.join(RAIZ, "public", a.ruta)), {
      filename: path.basename(a.ruta),
      contentType: "image/webp",
    });
    a.idReal = subido._id;
    subidos.set(a.idPrevisto, subido._id);
    if (subido._id !== a.idPrevisto) linea(`  aviso: ${a.ruta} quedó como ${subido._id} y no como ${a.idPrevisto}; se usa el real.`);
  }

  /* 2 · Documentos, en una sola transacción: entran todos o ninguno. Si algún
     archivo quedó con otro id, se rearman con el real. */
  const finales = [...archivos.values()].some((a) => a.idReal && a.idReal !== a.idPrevisto)
    ? JSON.parse(JSON.stringify(docs).replace(/"_ref":"(image-[^"]+)"/g, (m, ref: string) => {
        const a = [...archivos.values()].find((x) => x.idPrevisto === ref);
        return a?.idReal ? `"_ref":"${a.idReal}"` : m;
      }))
    : docs;
  const tx = client.transaction();
  for (const d of finales as Doc[]) tx.createOrReplace(d);
  await tx.commit({ visibility: "sync" });
  linea(`\nEscritos ${finales.length} documentos.`);

  /* 3 · La validación que importa: la del dataset, como la verá el Studio. */
  const despues = validar();
  linea(`\nVALIDACIÓN DEL STUDIO en el dataset (${despues.porDoc.size} documentos con errores):`);
  for (const [id, ms] of despues.porDoc) for (const m of ms) linea(`  ✗ ${id} · ${rutaMarcador(m.path)}: ${m.message}`);
  for (const r of despues.raros) linea(`  ? ${r}`);
  if (!despues.porDoc.size && !despues.raros.length) linea("  todos pasan");
  return 0;
}

main().then(
  (codigo) => process.exit(codigo),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
