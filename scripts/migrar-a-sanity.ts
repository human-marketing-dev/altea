/**
 * MIGRACIÓN DEL CONTENIDO A SANITY: de los .ts de hoy a los documentos del
 * Studio (sanity/schemaTypes). El sitio NO cambia con esto: sigue leyendo los
 * .ts hasta que cada página se pase a Sanity, una por una.
 *
 *   npx tsx scripts/migrar-a-sanity.ts               pasada en seco: no escribe
 *   npx tsx scripts/migrar-a-sanity.ts --escribir    sube las imágenes y escribe
 *
 *   --forzar      sobrescribe documentos que alguien ya cambió en el Studio
 *   --sin-videos  no sube los dos videos del home
 *
 * Se corre desde la raíz del proyecto, con el build hecho (`next build`): los
 * titulares y los legales se comparan contra su HTML.
 *
 * SE PUEDE CORRER DOS VECES. Los ids son fijos —los documentos únicos tienen el
 * suyo; un proyecto es `proyecto-<slug>` y un giro `giro-<id>`— y las `_key` de
 * las listas salen de un hash de su lugar, así que una segunda corrida escribe
 * exactamente lo mismo encima. Las imágenes tampoco se duplican: Sanity nombra
 * cada archivo por el SHA-1 de su contenido, y lo que ya está no se vuelve a
 * subir. Si un documento ya existe y es distinto de lo que se escribiría, es que
 * alguien lo editó: el script se detiene antes de escribir nada (ver --forzar).
 *
 * LO QUE NO MIGRA, a propósito (inventario §10): la palabra del hero de las
 * unidades, el emblema, la frase de Origen y los campos de estructura. Tampoco
 * borra nada, ni en Sanity ni en /public.
 *
 * La pasada en seco:
 *   1. arma los documentos en memoria;
 *   2. compara los titulares con acento y los legales contra el HTML del build:
 *      el acento tiene que caer en las mismas palabras;
 *   3. los valida con los validadores del Studio (`sanity documents validate
 *      --file`), sin tocar el dataset.
 * Al escribir, después vuelve a validar, ya contra el dataset.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

import {
  BUSINESS_UNITS,
  BUSINESS_UNITS_INTRO,
  CONTACT_CTA,
  FEATURED_PROJECTS,
  FEATURED_PROJECTS_INTRO,
  HERO_A,
  STATS,
  STATS_INTRO,
  VIDEO,
} from "@/app/_home/content";
import {
  GRUPO_FIRMA,
  HERO,
  HUELLA,
  ORIGEN,
  PILARES,
  RESPONSABILIDAD,
} from "@/app/_nosotros/content";
import { AVISO_DE_PRIVACIDAD } from "@/app/_legal/aviso-de-privacidad";
import { TERMINOS } from "@/app/_legal/terminos";
import type { Bloque, DocumentoLegal } from "@/app/_legal/tipos";
import { COMERCIAL } from "@/app/_unidad/contenido/comercial";
import { FORESTAL } from "@/app/_unidad/contenido/forestal";
import { INDUSTRIAL } from "@/app/_unidad/contenido/industrial";
import { VIVIENDA } from "@/app/_unidad/contenido/vivienda";
import type {
  Cifra,
  ContenidoUnidad,
  LineaNegocio,
  Proyecto,
  ProximoProyecto,
} from "@/app/_unidad/tipos";
import { CANALES, REDES } from "@/lib/contacto";
import {
  ESTADOS_CON_PRESENCIA,
  M2_CONSTRUIDOS,
  PRESENCIA_INTERNACIONAL,
} from "@/lib/proyectos";
import { PREFIJOS, SIGNOS, UNIDADES } from "@/sanity/reglas";
import { ESTADOS_MX } from "@/sanity/schemaTypes/estados";
import { UNICOS } from "@/sanity/schemaTypes/index";
import { FORMATOS } from "@/sanity/schemaTypes/proyecto";
import { ICONOS } from "@/sanity/schemaTypes/unidad";

const RAIZ = process.cwd();
const ESCRIBIR = process.argv.includes("--escribir");
const FORZAR = process.argv.includes("--forzar");
const SIN_VIDEOS = process.argv.includes("--sin-videos");
const SALIDA = path.join(tmpdir(), "altea-migracion-sanity");

/** Lo que impide escribir. Se junta todo y la pasada para al final. */
const errores: string[] = [];
/** Lo que se migra con una decisión o una transformación que hay que conocer. */
const notas: string[] = [];
/** Lo que se queda fuera: no tiene campo, o no se pudo convertir con certeza. */
const fuera: string[] = [];

const sha1 = (x: string | Buffer) => createHash("sha1").update(x).digest("hex");
/** `_key` determinista: el mismo lugar da la misma clave en cada corrida. */
const clave = (...partes: (string | number)[]) => sha1(partes.join("·")).slice(0, 12);

type Doc = { _id: string; _type: string } & Record<string, unknown>;

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

/* ── Archivos: imágenes y videos ──────────────────────────────────────── */

interface Archivo {
  /** Como la escribe el contenido: /images/… */
  ruta: string;
  tipo: "image" | "file";
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

function registrar(ruta: string, tipo: Archivo["tipo"], uso: string): Archivo {
  const previo = archivos.get(ruta);
  if (previo) {
    previo.usos.add(uso);
    return previo;
  }
  const abs = path.join(RAIZ, "public", ruta);
  let archivo: Archivo;
  if (!existsSync(abs)) {
    errores.push(`No existe public${ruta} (${uso}).`);
    archivo = { ruta, tipo, bytes: 0, idPrevisto: `${tipo}-falta`, usos: new Set([uso]) };
  } else {
    const datos = readFileSync(abs);
    const ext = path.extname(ruta).slice(1).toLowerCase();
    const hash = sha1(datos);
    let idPrevisto = `file-${hash}-${ext}`;
    if (tipo === "image") {
      const { ancho, alto } = medidas(datos, ruta);
      idPrevisto = `image-${hash}-${ancho}x${alto}-${ext}`;
    }
    archivo = { ruta, tipo, bytes: datos.length, idPrevisto, usos: new Set([uso]) };
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

function imagen(ruta: string | undefined, uso: string, opciones: { alt?: string; ancla?: number; _key?: string } = {}) {
  if (!ruta) {
    errores.push(`Falta la foto (${uso}).`);
    return undefined;
  }
  const a = registrar(ruta, "image", uso);
  return limpio({
    _type: "image",
    _key: opciones._key,
    asset: { _type: "reference", _ref: idDe(a) },
    alt: opciones.alt || undefined,
    ...(opciones.ancla !== undefined ? enfoque(opciones.ancla) : {}),
  });
}

function archivo(ruta: string | undefined, uso: string) {
  if (!ruta) {
    errores.push(`Falta el archivo (${uso}).`);
    return undefined;
  }
  const a = registrar(ruta, "file", uso);
  return { _type: "file", asset: { _type: "reference", _ref: idDe(a) } };
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
function lineaPT(trozos: readonly Trozo[], marca: "atenuado" | "acento", separador: string, base: string): BloquePT[] {
  const otra = marca === "atenuado" ? "acento" : "atenuado";
  const crudos: Crudo[] = [];
  trozos.forEach((t, i) => {
    if (t[otra]) errores.push(`${base}: el trozo «${t.texto}» trae «${otra}», que este titular no tiene.`);
    if (i > 0 && separador) crudos.push({ text: separador, marks: [] });
    crudos.push({ text: t.texto, marks: t[marca] ? [marca] : [] });
  });
  return [bloque(base, "normal", crudos)];
}

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

/**
 * Lo poco que no vive en un .ts de contenido sino en el JSX o en la metadata de
 * una página. Se lee del fuente, no se copia aquí: si el patrón no aparece
 * exactamente una vez, es un error y no un texto inventado.
 */
function delFuente(archivoFuente: string, patron: RegExp, que: string): string[] {
  const texto = readFileSync(path.join(RAIZ, archivoFuente), "utf8");
  const hallados = [...texto.matchAll(new RegExp(patron.source, "g"))];
  if (hallados.length !== 1) {
    errores.push(`${que}: se esperaba una vez en ${archivoFuente} y aparece ${hallados.length}.`);
    return [];
  }
  return hallados[0].slice(1).map((s) => s.replace(/\s+/g, " ").trim());
}

const metadataDe = (archivoFuente: string) => {
  const [titulo, descripcion] = delFuente(
    archivoFuente,
    /export const metadata: Metadata = \{\s*title: "([^"]+)",\s*description:\s*"([^"]+)"/,
    `Metadata de ${archivoFuente}`,
  );
  return { titulo, descripcion };
};

/* ── Las piezas ───────────────────────────────────────────────────────── */

const valoresDe = (lista: readonly { value: string }[]) => new Set(lista.map((x) => x.value));
const PREFIJO_OK = valoresDe(PREFIJOS);
const SIGNO_OK = valoresDe(SIGNOS);
const ICONO_OK = valoresDe(ICONOS);
const ESTADO_OK = valoresDe(ESTADOS_MX);

function cifra(
  tipo: "cifraHome" | "cifraHuella" | "cifraUnidad",
  c: { prefijo?: string; valor: number; signo?: string; nota?: string; etiqueta: string },
  _key: string,
) {
  if (!PREFIJO_OK.has(c.prefijo ?? "")) errores.push(`${tipo}: el prefijo «${c.prefijo}» no está en la lista del esquema.`);
  if (!SIGNO_OK.has(c.signo ?? "")) errores.push(`${tipo}: el signo «${c.signo}» no está en la lista del esquema.`);
  return limpio({
    _type: tipo,
    _key,
    prefijo: c.prefijo ?? "",
    valor: c.valor,
    signo: c.signo ?? "",
    nota: c.nota,
    etiqueta: c.etiqueta,
  });
}

/** «Próximos\nproyectos»: el `\n` no hace nada en el sitio (inventario §10.7), se ve un espacio. */
const sinSalto = (texto: string, donde: string) => {
  if (!texto.includes("\n")) return texto;
  const limpio = texto.replace(/\s*\n\s*/g, " ");
  notas.push(`${donde}: «${texto.replace("\n", "\\n")}» se guarda como «${limpio}». El salto no se ve hoy: el renglón lo parte el ancho.`);
  return limpio;
};

/* ── Lo provisional ───────────────────────────────────────────────────── */

/**
 * ETIQUETAS DE CIFRA ACORTADAS, PROVISIONALES HASTA QUE ALTEA LAS APRUEBE. En
 * Sanity va la versión corta; el sitio sigue con la larga, que es la de los .ts.
 *
 * Medido en el navegador (28 oct 2026, build real, 360 / 390 / 1280 / 1440): con
 * dos cifras, la fila del hero se rompe a 360 en cuanto una etiqueta pasa de 23
 * o 24 caracteres (22 si las dos son largas), y las dos cifras se apilan. Las
 * tres de abajo ya la rompen hoy en teléfono. Con la versión corta la fila queda
 * en un renglón en los cuatro tamaños, como Industrial.
 */
const PROVISIONALES: Record<string, Record<string, string>> = {
  "unidad-vivienda": { "de m² desarrollables, equivalente +30 terrenos": "de m² desarrollables" },
  "unidad-forestal": {
    "hectáreas para uso forestal": "hectáreas forestales",
    "producción de árboles al año": "árboles al año",
  },
};

function etiquetaDe(id: string, etiqueta: string) {
  const corta = PROVISIONALES[id]?.[etiqueta];
  if (!corta) return etiqueta;
  notas.push(`${id}: PROVISIONAL hasta que Altea la apruebe: «${etiqueta}» (${etiqueta.length}) → «${corta}» (${corta.length}). El sitio sigue con la larga.`);
  return corta;
}

/* ── Proyectos ────────────────────────────────────────────────────────── */

const claveUnidad = (u: ContenidoUnidad) => u.unidad.toLowerCase();
const UNIDAD_OK = new Set(UNIDADES.map((u) => u.value as string));

/**
 * El estado: la página de la unidad no lo dice —sólo separa la lista de los
 * próximos—, el carril del home sí («En operación» / «En desarrollo»). Se toma
 * del home para los destacados y, para el resto de la lista, «En operación».
 */
function estadoDe(p: Proyecto): "operacion" | "desarrollo" {
  const destacado = FEATURED_PROJECTS.find((f) => f.slug === p.id);
  return destacado?.estado === "En desarrollo" ? "desarrollo" : "operacion";
}
const inferidos = { desarrollo: [] as string[], operacion: [] as string[] };

const datos = (lista: readonly { etiqueta: string; valor?: string }[], base: string) =>
  lista.length
    ? lista.map((d, i) => limpio({ _type: "dato", _key: clave(base, "dato", i), etiqueta: d.etiqueta, valor: d.valor || undefined }))
    : undefined;

function proyectoDeLista(p: Proyecto, u: ContenidoUnidad): Doc {
  const [primero, ...resto] = p.datos;
  const formato = primero?.etiqueta === "Formato" ? primero.valor : undefined;
  if (!formato) errores.push(`proyecto-${p.id}: su primer dato no es «Formato», y el esquema lo pide como campo propio.`);
  else if (!FORMATOS.includes(formato)) errores.push(`proyecto-${p.id}: el formato «${formato}» no está en la lista del esquema.`);
  const estado = estadoDe(p);
  inferidos[estado].push(p.id);
  return limpio({
    _id: `proyecto-${p.id}`,
    _type: "proyecto",
    nombre: p.nombre,
    unidad: claveUnidad(u),
    estado,
    ubicacion: p.ubicacion,
    formato,
    foto: p.foto ? imagen(p.foto, `proyecto ${p.id}`, { alt: p.alt }) : undefined,
    descripcion: p.descripcion,
    datos: datos(formato ? resto : p.datos, `proyecto-${p.id}`),
    sitio: p.sitio,
  });
}

function proyectoProximo(p: ProximoProyecto, u: ContenidoUnidad): Doc {
  return limpio({
    _id: `proyecto-${p.slug}`,
    _type: "proyecto",
    nombre: p.name,
    unidad: claveUnidad(u),
    estado: "proximo",
    ubicacion: p.location,
    foto: p.image ? imagen(p.image, `proyecto ${p.slug}`) : undefined,
    descripcion: p.descripcion,
    datos: datos(p.datos ?? [], `proyecto-${p.slug}`),
    /* «Ampliación comercial» en vez de «Comercial»: sólo cuando no es la unidad. */
    etiquetaUnidad: p.unit !== u.unidad ? p.unit : undefined,
  });
}

/* ── Unidades ─────────────────────────────────────────────────────────── */

const ICONO_DE = (titulo: string, icono: string | undefined, donde: string) => {
  if (!icono || !ICONO_OK.has(icono)) errores.push(`${donde}: «${titulo}» trae el icono «${icono}», que no está en la lista del esquema.`);
  return icono;
};

function lineaForestal(l: LineaNegocio | undefined, nombre: string) {
  if (!l) {
    errores.push(`Forestal: no encontré la línea «${nombre}».`);
    return undefined;
  }
  const base = `unidad-forestal·${l.id}`;
  return limpio({
    rotulo: l.rotulo,
    parrafos: l.parrafos,
    fotos: l.fotos.map((f, i) => imagen(f.src, `forestal ${l.id}`, { alt: f.alt, _key: clave(base, "foto", i) })),
    listaTitulo: l.lista.rotulo,
    listaItems: l.lista.items.map((it, i) => ({
      _type: "itemLista",
      _key: clave(base, "item", i),
      titulo: it.titulo,
      icono: ICONO_DE(it.titulo, it.icono, `Forestal ${l.titulo}`),
    })),
  });
}

function unidad(u: ContenidoUnidad): Doc {
  const k = claveUnidad(u);
  const id = `unidad-${k}`;
  if (!UNIDAD_OK.has(k)) errores.push(`${id}: «${u.unidad}» no es una de las cuatro unidades del esquema.`);
  const carpeta = BUSINESS_UNITS.find((b) => b.slug === k);
  if (!carpeta) errores.push(`${id}: no tiene carpeta en el home.`);

  const doc: Doc = {
    _id: id,
    _type: "unidad",
    frase: carpeta?.apertura,
    descripcion: carpeta?.descripcion,
    fotoCarpeta: carpeta ? imagen(carpeta.image, `carpeta ${k}`, { alt: carpeta.alt }) : undefined,
    fotosHero: u.hero.fotos.map((f, i) => imagen(f.foto, `hero ${k}`, { ancla: f.ancla, _key: clave(id, "hero", i) })),
    cifras: u.cifras.map((c: Cifra, i) => cifra("cifraUnidad", { ...c, etiqueta: etiquetaDe(id, c.etiqueta) }, clave(id, "cifra", i))),
    metaTitulo: u.metadata.title,
  };

  if (k !== "forestal") {
    doc.tituloProyectos = u.proyectos.titulo;
    doc.proyectos = u.proyectos.lista.map((p, i) => referencia(`proyecto-${p.id}`, clave(id, "proyecto", i)));
    doc.tituloProximos = sinSalto(u.proximos.titulo, `${id}, título de próximos`);
    doc.proximos = u.proximos.proyectos.map((p, i) => referencia(`proyecto-${p.slug}`, clave(id, "proximo", i)));
  }
  if (k === "comercial") {
    doc.girosRotulo = u.giros.eyebrow;
    doc.girosTitulo = u.giros.titulo;
    doc.giros = u.giros.bloques.map((g, i) => referencia(`giro-${g.id}`, clave(id, "giro", i)));
    doc.marcasTitulo = u.marcas.titulo;
  }
  if (k === "industrial") {
    doc.atributos = (u.atributos ?? []).map((a, i) => ({
      _type: "atributo",
      _key: clave(id, "atributo", i),
      titulo: a.titulo,
      icono: ICONO_DE(a.titulo, a.icono, "Industrial, atributos"),
    }));
  }
  if (k === "forestal") {
    doc.viveros = lineaForestal(u.lineas?.find((l) => l.id === "viveros-asturias"), "viveros-asturias");
    doc.teca = lineaForestal(u.lineas?.find((l) => l.id === "teca"), "teca");
  }

  /* La descripción para Google es la de la carpeta (esquema). Hoy coincide en
     tres; la de Comercial se calcula a partir de las plazas y no tiene campo. */
  if (u.metadata.description !== carpeta?.descripcion) {
    fuera.push(
      `${id}: la descripción para Google de hoy («${u.metadata.description}») no es la de la carpeta. El esquema no tiene campo para ella: al pasar la página a Sanity, Google leería la de la carpeta.`,
    );
  }
  return limpio(doc);
}

function giro(g: ContenidoUnidad["giros"]["bloques"][number]): Doc {
  if (!g.image) errores.push(`giro-${g.id}: no tiene foto, y el esquema la pide.`);
  return limpio({
    _id: `giro-${g.id}`,
    _type: "giro",
    titulo: g.title,
    descripcion: g.description,
    imagen: g.image ? imagen(g.image, `giro ${g.id}`, { alt: g.alt }) : undefined,
  });
}

/* ── Legales ──────────────────────────────────────────────────────────── */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** «Última actualización: 06 DE OCTUBRE DEL 2026» → 2026-10-06. */
function fechaDe(bajada: string | undefined, id: string): string | undefined {
  if (!bajada) return undefined;
  const m = bajada.match(/(\d{1,2}) de (\p{L}+) del? (\d{4})/iu);
  const mes = m ? MESES.indexOf(m[2].toLowerCase()) : -1;
  if (!m || mes < 0) {
    fuera.push(`${id}: la bajada «${bajada}» no se pudo leer como fecha con certeza; no se migra.`);
    return undefined;
  }
  const iso = `${m[3]}-${String(mes + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  notas.push(`${id}: la bajada «${bajada}» se guarda como la fecha ${iso}. Al pasar la página a Sanity, el código tiene que escribirla igual que hoy (con «Última actualización:» delante y en mayúsculas).`);
  return iso;
}

function legal(id: string, d: DocumentoLegal): Doc {
  if (d.metadata.title !== `${d.titulo} — Altea`) {
    fuera.push(`${id}: el título para Google de hoy («${d.metadata.title}») no sale del título de la página («${d.titulo}»), y el esquema no tiene campo para él.`);
  }
  return limpio({
    _id: id,
    _type: "documentoLegal",
    titulo: d.titulo,
    fecha: fechaDe(d.bajada, id),
    intro: d.intro?.length ? legalPT(d.intro, `${id}·intro`) : undefined,
    secciones: d.secciones.map((s, i) => ({
      _type: "seccionLegal",
      _key: clave(id, "seccion", i),
      titulo: s.titulo,
      cuerpo: legalPT(s.bloques, `${id}·seccion·${i}`),
    })),
    cierre: d.cierre?.length ? legalPT(d.cierre, `${id}·cierre`) : undefined,
    metaDescripcion: d.metadata.description,
  });
}

/* ── Los documentos ───────────────────────────────────────────────────── */

function construir(): Doc[] {
  const docs: Doc[] = [];
  const UNIDADES_CONTENIDO = [COMERCIAL, INDUSTRIAL, VIVIENDA, FORESTAL];

  /* Proyectos: los de cada unidad. Los destacados del home NO crean documento:
     son los mismos, y donde no coinciden manda la página de la unidad. */
  for (const u of UNIDADES_CONTENIDO) {
    for (const p of u.proyectos.lista) docs.push(proyectoDeLista(p, u));
    for (const p of u.proximos.proyectos) docs.push(proyectoProximo(p, u));
  }
  for (const g of COMERCIAL.giros.bloques) docs.push(giro(g));
  for (const u of UNIDADES_CONTENIDO) docs.push(unidad(u));

  /* Inicio */
  if (HERO_A.lineas.length !== 2) errores.push(`El titular del home tiene ${HERO_A.lineas.length} líneas y el esquema tiene 2.`);
  docs.push(
    limpio({
      _id: "paginaInicio",
      _type: "paginaInicio",
      titularLinea1: lineaPT(HERO_A.lineas[0], "atenuado", " ", "paginaInicio·titular·0"),
      titularLinea2: lineaPT(HERO_A.lineas[1], "atenuado", " ", "paginaInicio·titular·1"),
      frase: STATS_INTRO,
      cifras: STATS.map((s, i) =>
        cifra("cifraHome", { prefijo: s.prefix, valor: s.to, signo: s.suffix, nota: s.note, etiqueta: s.label }, clave("paginaInicio", "cifra", i)),
      ),
      video: SIN_VIDEOS ? undefined : archivo(VIDEO.url, "video del home"),
      videoMovil: SIN_VIDEOS ? undefined : archivo(VIDEO.urlMovil, "video del home (teléfono)"),
      videoDescripcion: VIDEO.caption,
      /* El h2 de las carpetas pinta `descripcion`, no `titulo` (CarpetasUnidades.tsx). */
      tituloUnidades: BUSINESS_UNITS_INTRO.descripcion,
      tituloProyectos: sinSalto(FEATURED_PROJECTS_INTRO.titulo, "Inicio, título del carril"),
      proyectosDestacados: FEATURED_PROJECTS.map((f, i) => referencia(`proyecto-${f.slug}`, clave("paginaInicio", "destacado", i))),
    }),
  );

  /* Nosotros */
  if (HERO.lineas.length !== 3) errores.push(`El titular de /nosotros tiene ${HERO.lineas.length} líneas y el esquema tiene 3.`);
  const metaNos = metadataDe("app/nosotros/page.tsx");
  docs.push(
    limpio({
      _id: "paginaNosotros",
      _type: "paginaNosotros",
      titularLinea1: lineaPT(HERO.lineas[0], "acento", "", "paginaNosotros·titular·0"),
      titularLinea2: lineaPT(HERO.lineas[1], "acento", "", "paginaNosotros·titular·1"),
      titularLinea3: lineaPT(HERO.lineas[2], "acento", "", "paginaNosotros·titular·2"),
      bajada: HERO.bajada,
      origenParrafos: ORIGEN.parrafos,
      origenFotos: ORIGEN.fotos.map((f, i) => imagen(f.src, "origen", { alt: f.alt, _key: clave("paginaNosotros", "origen", i) })),
      pilaresTitulo: PILARES.title,
      pilares: PILARES.bloques.map((b) => b.title),
      grupoTitulo: GRUPO_FIRMA.title,
      grupoIntro: GRUPO_FIRMA.intro,
      grupoPie: GRUPO_FIRMA.pie,
      huellaTitulo: HUELLA.title,
      huellaBoton: HUELLA.cta.texto,
      huellaBotonEnlace: HUELLA.cta.href,
      huellaCifras: HUELLA.stats.map((s, i) =>
        cifra("cifraHuella", { prefijo: s.prefix, valor: s.to, signo: s.suffix, etiqueta: s.label }, clave("paginaNosotros", "huella", i)),
      ),
      huellaDesglose: HUELLA.desglose.map((d, i) => ({ _type: "parte", _key: clave("paginaNosotros", "desglose", i), etiqueta: d.label, valor: d.value })),
      mapaRotulo: HUELLA.mapa.etiqueta,
      mapaPista: HUELLA.mapa.pista,
      mapaEtiquetaEstado: HUELLA.mapa.etiquetaEstado,
      mapaSinDato: HUELLA.mapa.sinDato,
      rsTitulo: RESPONSABILIDAD.title,
      rsSubtitulo: RESPONSABILIDAD.subtitulo,
      rsParrafos: RESPONSABILIDAD.descripcion,
      rsGaleria: RESPONSABILIDAD.galeria.map((g, i) => ({
        _type: "fotoGaleria",
        _key: clave("paginaNosotros", "galeria", i),
        imagen: imagen(g.src, "galería RS", { alt: g.alt }),
        pie: g.nota,
      })),
      metaTitulo: metaNos.titulo,
      metaDescripcion: metaNos.descripcion,
    }),
  );

  /* Contacto */
  const metaCto = metadataDe("app/contacto/page.tsx");
  const [ctoTitulo, ctoTexto] = delFuente(
    "app/contacto/page.tsx",
    /as="h1"\s+tone="light"\s+title="([^"]+)"\s+description="([^"]+)"/,
    "Encabezado de /contacto",
  );
  const [whatsapp] = delFuente("app/contacto/page.tsx", /etiqueta: "WhatsApp",\s*valor: "([^"]+)"/, "Texto de WhatsApp en /contacto");
  const [exitoTitulo, exitoTexto] = delFuente(
    "app/ui/LeadForm.tsx",
    /role="status"\s*>\s*<p[^>]*>\s*([^<{]+?)\s*<\/p>\s*<p[^>]*>\s*([^<{]+?)\s*<\/p>/,
    "Mensaje de envío del formulario",
  );
  docs.push(
    limpio({
      _id: "paginaContacto",
      _type: "paginaContacto",
      titulo: ctoTitulo,
      descripcion: ctoTexto,
      textoWhatsapp: whatsapp,
      exitoTitulo,
      exitoTexto,
      metaTitulo: metaCto.titulo,
      metaDescripcion: metaCto.descripcion,
    }),
  );

  /* Legales */
  docs.push(legal("legal-aviso", AVISO_DE_PRIVACIDAD), legal("legal-terminos", TERMINOS));

  /* Presencia */
  docs.push({
    _id: "presencia",
    _type: "presencia",
    estados: ESTADOS_CON_PRESENCIA.map((e) => {
      if (!ESTADO_OK.has(e)) errores.push(`Presencia: «${e}» no está en la lista de estados del esquema.`);
      return limpio({ _type: "estadoPresencia", _key: clave("presencia", e), estado: e, m2: M2_CONSTRUIDOS[e] });
    }),
    paises: [...PRESENCIA_INTERNACIONAL],
  });

  /* Cierre y ajustes */
  docs.push({ _id: "cierre", _type: "cierre", rotulo: CONTACT_CTA.eyebrow, titulo: CONTACT_CTA.title });
  const metaSitio = metadataDe("app/layout.tsx");
  const red = (icono: string) => REDES.find((r) => r.icono === icono)?.url;
  docs.push(
    limpio({
      _id: "ajustesSitio",
      _type: "ajustesSitio",
      correo: CANALES.correo,
      telefono: CANALES.telefono,
      whatsapp: CANALES.whatsapp,
      whatsappMensaje: CANALES.whatsappMensaje,
      domicilio: CANALES.domicilio,
      facebook: red("facebook"),
      instagram: red("instagram"),
      linkedin: red("linkedin"),
      metaTitulo: metaSitio.titulo,
      metaDescripcion: metaSitio.descripcion,
    }),
  );

  return docs;
}

/* ── Comprobaciones contra lo que se ve hoy ───────────────────────────── */

const html = (pagina: string) => {
  const p = path.join(RAIZ, ".next/server/app", `${pagina}.html`);
  if (!existsSync(p)) {
    errores.push(`No está ${path.relative(RAIZ, p)}: corre \`next build\` antes, la comparación se hace contra el HTML.`);
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
 * El acento, palabra por palabra: lo que pinta el build (las clases
 * `hero-a__atenuado` / `nos-hero__acento` del h1) contra lo que quedó marcado
 * en el bloque. Una línea que no coincide se queda fuera de la migración.
 */
function verificarAcentos(docs: Doc[]) {
  const casos = [
    { pagina: "index", doc: "paginaInicio", linea: "hero-a__linea", marca: "hero-a__atenuado", campos: ["titularLinea1", "titularLinea2"] },
    { pagina: "nosotros", doc: "paginaNosotros", linea: "nos-hero__linea", marca: "nos-hero__acento", campos: ["titularLinea1", "titularLinea2", "titularLinea3"] },
  ];
  const resultado: string[] = [];
  for (const c of casos) {
    const h = html(c.pagina);
    if (!h) continue;
    const lineas = [...h.matchAll(new RegExp(`<span class="${c.linea}[^"]*"[^>]*><span>((?:<span(?: class="[^"]*")?>.*?</span>)*)</span></span>`, "g"))].map((m) =>
      palabras([...m[1].matchAll(/<span(?: class="([^"]*)")?>(.*?)<\/span>/g)].map((s) => ({ text: texto(s[2]), marcado: (s[1] ?? "").split(" ").includes(c.marca) }))),
    );
    const doc = docs.find((d) => d._id === c.doc)!;
    if (lineas.length !== c.campos.length) {
      errores.push(`${c.doc}: el build tiene ${lineas.length} líneas de titular y el documento ${c.campos.length}.`);
      continue;
    }
    c.campos.forEach((campo, i) => {
      const bloques = doc[campo] as BloquePT[];
      const enDoc = palabras(bloques.flatMap((b) => b.children.map((s) => ({ text: s.text, marcado: s.marks.length > 0 }))));
      const igual = JSON.stringify(enDoc) === JSON.stringify(lineas[i]) && !enDoc.some((p) => p.marcada === "a medias");
      resultado.push(`${igual ? "igual" : "DISTINTO"}  ${c.doc}.${campo}: hoy «${verLinea(lineas[i])}» · migrado «${verLinea(enDoc)}»`);
      if (!igual) {
        fuera.push(`${c.doc}.${campo}: el acento no cae en las mismas palabras que hoy; se deja fuera para migrarlo a mano.`);
        delete doc[campo];
      }
    });
  }
  return resultado;
}

/**
 * Los legales contra su página: el texto visible, las negritas y los enlaces
 * tienen que ser los mismos que pinta el build en `<article class="leg">`.
 */
function verificarLegales(docs: Doc[]) {
  const resultado: string[] = [];
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  for (const [id, pagina] of [
    ["legal-aviso", "aviso-de-privacidad"],
    ["legal-terminos", "terminos"],
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
        if (enlace) enlacesDoc.push(`${enlace.href} → ${norm(s.text)}`);
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

/** Dónde difieren dos textos: lo común se resume y la diferencia se muestra entera. */
function diferencia(a: string, b: string) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  let j = 0;
  while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  const antes = a.slice(Math.max(0, i - 25), i);
  const despues = a.slice(a.length - j, a.length - j + 25);
  return `…${antes}[home: «${a.slice(i, a.length - j)}» · unidad: «${b.slice(i, b.length - j)}»]${despues}…`;
}

/** Los destacados del home contra su proyecto en la unidad, campo por campo. */
function duplicados() {
  const filas: string[] = [];
  for (const f of FEATURED_PROJECTS) {
    let enUnidad: { nombre: string; ubicacion?: string; foto?: string; descripcion?: string; estado: string } | undefined;
    for (const u of [COMERCIAL, INDUSTRIAL, VIVIENDA, FORESTAL]) {
      const p = u.proyectos.lista.find((x) => x.id === f.slug);
      if (p) enUnidad = { nombre: p.nombre, ubicacion: p.ubicacion, foto: p.foto, descripcion: p.descripcion, estado: estadoDe(p) === "desarrollo" ? "En desarrollo" : "En operación" };
      const q = u.proximos.proyectos.find((x) => x.slug === f.slug);
      if (q) enUnidad = { nombre: q.name, ubicacion: q.location, foto: q.image, descripcion: q.descripcion, estado: "Próximo (está en Próximos proyectos)" };
    }
    if (!enUnidad) {
      errores.push(`El destacado «${f.slug}» del home no está en ninguna unidad: no hay a qué referenciarlo.`);
      continue;
    }
    const campos: [string, string | undefined, string | undefined][] = [
      ["nombre", f.name, enUnidad.nombre],
      ["ubicación", f.location, enUnidad.ubicacion],
      ["foto", f.image, enUnidad.foto],
      ["descripción", f.descripcion, enUnidad.descripcion],
      ["estado", f.estado, enUnidad.estado],
    ];
    const difs = campos.filter(([, a, b]) => (a ?? "") !== (b ?? ""));
    filas.push(
      difs.length
        ? `${f.slug}: gana la unidad en ${difs.map(([c]) => c).join(", ")}\n${difs.map(([c, a, b]) => `      ${c}: ${c === "descripción" ? diferencia(a ?? "", b ?? "") : `home «${a}» · unidad «${b}»`}`).join("\n")}`
        : `${f.slug}: idéntico`,
    );
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
 * lo que hay en el dataset.
 */
function validar(archivoNdjson?: string, porSubir: Set<string> = new Set()) {
  const r = spawnSync(
    "npx",
    ["sanity", "documents", "validate", "-y", "--level", "error", "--format", "ndjson", ...(archivoNdjson ? ["--file", archivoNdjson] : [])],
    { cwd: RAIZ, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, SANITY_AUTH_TOKEN: process.env.SANITY_API_TOKEN } },
  );
  const porDoc = new Map<string, Marcador[]>();
  const raros: string[] = [];
  let pendientes = 0;
  for (const l of r.stdout.split("\n").filter(Boolean)) {
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
      if (reales.length) porDoc.set(x.documentId, reales);
    } catch {
      raros.push(l);
    }
  }
  const err = (r.stderr ?? "").split("\n").filter((l) => l.trim() && !/EEXIT: 1/.test(l));
  return { porDoc, raros: [...raros, ...err], pendientes };
}

const rutaDe = (p: Marcador["path"]) => p.map((x) => (typeof x === "object" ? `[${x._key}]` : x)).join(".");

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
  const dups = duplicados();

  const ids = new Set(docs.map((d) => d._id));
  for (const u of UNICOS) if (!ids.has(u.id)) errores.push(`Falta el documento único ${u.id}.`);
  const refs = JSON.stringify(docs).matchAll(/"_ref":"((?:proyecto|giro)-[^"]+)"/g);
  for (const [, ref] of refs) if (!ids.has(ref)) errores.push(`Se referencia ${ref}, que no está entre los documentos.`);

  /* El estado del dataset: qué hay ya y qué cambiaría. Sólo lectura. */
  const client = createClient({ projectId, dataset, apiVersion: "2026-10-01", token, useCdn: false });
  const todosLosIds = [...ids, ...[...ids].map((i) => `drafts.${i}`)];
  const existentes = await client.fetch<Doc[]>("*[_id in $ids]", { ids: todosLosIds });
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
  const estado = { nuevos: [] as string[], iguales: [] as string[], distintos: [] as string[], borradores: [] as string[] };
  for (const d of docs) {
    const ya = existentes.find((e) => e._id === d._id);
    if (!ya) estado.nuevos.push(d._id);
    else if (ordenado(ya) === ordenado(d)) estado.iguales.push(d._id);
    else estado.distintos.push(d._id);
    if (existentes.some((e) => e._id === `drafts.${d._id}`)) estado.borradores.push(d._id);
  }
  const assetsYa = new Set(await client.fetch<string[]>("*[_id in $ids]._id", { ids: [...archivos.values()].map((a) => a.idPrevisto) }));

  /* La validación del Studio sobre lo que se va a escribir, sin escribirlo. Van
     también unas fichas mínimas de las imágenes para que sus referencias
     resuelvan; sus propios avisos no se cuentan. */
  mkdirSync(SALIDA, { recursive: true });
  const ndjson = path.join(SALIDA, "documentos.ndjson");
  const fichas = [...archivos.values()].map((a) => ({ _id: a.idPrevisto, _type: a.tipo === "image" ? "sanity.imageAsset" : "sanity.fileAsset" }));
  writeFileSync(ndjson, [...docs, ...fichas].map((d) => JSON.stringify(d)).join("\n") + "\n");
  const previa = validar(ndjson, new Set([...archivos.values()].map((a) => a.idPrevisto).filter((id) => !assetsYa.has(id))));

  /* ── El resumen ── */
  const porTipo = new Map<string, string[]>();
  for (const d of docs) porTipo.set(d._type, [...(porTipo.get(d._type) ?? []), d._id]);
  const imgs = [...archivos.values()].filter((a) => a.tipo === "image");
  const vids = [...archivos.values()].filter((a) => a.tipo === "file");
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  const usos = imgs.reduce((n, a) => n + a.usos.size, 0);
  /* Sanity guarda una vez cada contenido: dos rutas con el mismo archivo son un solo asset. */
  const unicos = (lista: Archivo[]) => [...new Map(lista.map((a) => [a.idPrevisto, a])).values()];
  const imgsUnicas = unicos(imgs);
  const peso = (lista: Archivo[]) => mb(lista.reduce((n, a) => n + a.bytes, 0));

  const linea = (s = "") => console.log(s);
  linea(`\n${ESCRIBIR ? "MIGRACIÓN" : "PASADA EN SECO — no se escribe nada"} · proyecto ${projectId} · dataset ${dataset}\n`);
  linea(`DOCUMENTOS: ${docs.length}`);
  for (const [t, l] of porTipo) linea(`  ${t.padEnd(16)} ${String(l.length).padStart(2)}  ${l.length > 4 ? "" : l.join(", ")}`);
  linea(`\nEN EL DATASET HOY: ${estado.nuevos.length} nuevos · ${estado.iguales.length} iguales · ${estado.distintos.length} distintos · ${estado.borradores.length} con borrador`);
  if (estado.distintos.length) linea(`  distintos: ${estado.distintos.join(", ")}`);
  if (estado.borradores.length) linea(`  con borrador abierto en el Studio: ${estado.borradores.join(", ")}`);
  linea(`\nIMÁGENES: ${imgsUnicas.length} assets (${peso(imgsUnicas)}) para ${usos} lugares. Son ${imgs.length} rutas en /public; las repetidas byte a byte se suben una vez:`);
  for (const a of imgsUnicas) {
    const iguales = imgs.filter((b) => b.idPrevisto === a.idPrevisto && b !== a);
    if (iguales.length) linea(`    ${a.ruta} = ${iguales.map((b) => b.ruta).join(" = ")}`);
  }
  linea(`  ya en Sanity: ${imgsUnicas.filter((a) => assetsYa.has(a.idPrevisto)).length} · por subir: ${imgsUnicas.filter((a) => !assetsYa.has(a.idPrevisto)).length} (${peso(imgsUnicas.filter((a) => !assetsYa.has(a.idPrevisto)))})`);
  linea(`  con punto de enfoque (fotos del hero): ${docs.filter((d) => d._type === "unidad").reduce((n, d) => n + ((d.fotosHero as unknown[]) ?? []).length, 0)}`);
  if (vids.length) linea(`VIDEOS: ${vids.length} (${peso(vids)}) · ${vids.map((v) => path.basename(v.ruta)).join(", ")}`);
  else linea("VIDEOS: no se suben (--sin-videos)");

  linea("\nACENTOS, contra el HTML del build ([marcada]):");
  for (const r of acentos) linea(`  ${r}`);
  linea("\nLEGALES, contra el HTML del build:");
  for (const r of legales) linea(`  ${r}`);
  linea("\nDUPLICADOS del carril del home (manda la página de la unidad):");
  for (const r of dups) linea(`  ${r}`);
  linea("\nTRANSFORMACIONES Y SUPUESTOS:");
  for (const r of notas) linea(`  · ${r}`);
  linea(`  · ESTADO INFERIDO, NO DATO: la página de la unidad no dice si un proyecto está en operación o en desarrollo. «En desarrollo» porque así lo pone el carril del home: ${inferidos.desarrollo.join(", ")}. «En operación» por omisión: los otros ${inferidos.operacion.length} de las listas. Los próximos sí son dato: están en «Próximos proyectos».`);
  linea("\nNO SE MIGRA:");
  for (const r of fuera) linea(`  · ${r}`);

  linea(`\nVALIDACIÓN DEL STUDIO sobre lo que se escribiría (${previa.porDoc.size} documentos con errores):`);
  for (const [id, ms] of previa.porDoc) for (const m of ms) linea(`  ✗ ${id} · ${rutaDe(m.path)}: ${m.message}`);
  for (const r of previa.raros) linea(`  ? ${r}`);
  if (!previa.porDoc.size && !previa.raros.length) linea("  todos pasan");
  if (previa.pendientes) linea(`  (más ${previa.pendientes} referencias a imágenes y videos que se suben al escribir: el validador sólo las da por buenas cuando están en el dataset; se comprueban en la validación final)`);

  if (errores.length) {
    linea("\nERRORES — no se puede escribir así:");
    for (const e of errores) linea(`  ✗ ${e}`);
  }
  linea(`\nLos documentos tal como se escribirían: ${ndjson}`);

  if (!ESCRIBIR) {
    linea("\nPasada en seco: no se escribió nada. Para escribir: --escribir");
    return errores.length ? 1 : 0;
  }
  if (errores.length) return 1;
  if ((estado.distintos.length || estado.borradores.length) && !FORZAR) {
    linea("\nHay documentos que alguien cambió en el Studio (o con borrador). No escribo nada: revísalos, o corre con --forzar para sobrescribirlos.");
    return 1;
  }

  /* 1 · Archivos: sólo los que no están, y cada contenido una vez. */
  const subidos = new Map<string, string>();
  for (const a of archivos.values()) {
    if (assetsYa.has(a.idPrevisto)) continue;
    const ya = subidos.get(a.idPrevisto);
    if (ya) {
      a.idReal = ya;
      continue;
    }
    const subido = await client.assets.upload(a.tipo, readFileSync(path.join(RAIZ, "public", a.ruta)), {
      filename: path.basename(a.ruta),
      contentType: a.tipo === "image" ? "image/webp" : "video/mp4",
    });
    a.idReal = subido._id;
    subidos.set(a.idPrevisto, subido._id);
    if (subido._id !== a.idPrevisto) linea(`  aviso: ${a.ruta} quedó como ${subido._id} y no como ${a.idPrevisto}; se usa el real.`);
  }

  /* 2 · Documentos, en una sola transacción: entran todos o ninguno. Si algún
     archivo quedó con otro id, se rearman con el real. */
  const finales = [...archivos.values()].some((a) => a.idReal && a.idReal !== a.idPrevisto)
    ? JSON.parse(JSON.stringify(docs).replace(/"_ref":"((?:image|file)-[^"]+)"/g, (m, ref: string) => {
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
  for (const [id, ms] of despues.porDoc) for (const m of ms) linea(`  ✗ ${id} · ${rutaDe(m.path)}: ${m.message}`);
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
