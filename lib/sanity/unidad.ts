import type {
  Atributo,
  Cifra,
  ContenidoUnidad,
  FotoHero,
  Giro,
  ParDato,
  ProximoProyecto,
  Proyecto,
} from "@/app/_unidad/tipos";
import { ANCLA_POR_DEFECTO } from "@/app/_unidad/tipos";
import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";
import { datosDeImagen, urlAncho, type ImagenSanity } from "./imagenes";

/**
 * UNA PÁGINA DE UNIDAD DESDE SANITY (noviembre de 2026).
 *
 * Parte del contenido del código (`base`, el de contenido/<unidad>.ts o su
 * versión en inglés) y le pone encima lo editable que viene de Sanity. Así lo
 * que es diseño o lógica —la palabra del hero, el color, la banderola, la foto
 * del cierre, los logos, el muro de marcas, el lado de cada línea de Forestal—
 * sigue en el código, y lo que Altea edita sale del Studio.
 *
 * Lo que Sanity no guarda pero el código sí tiene por proyecto (el `ancla` de
 * las fotos medido a mano, por ejemplo) se toma del proyecto del código con el
 * mismo id, si lo hay.
 */

/* ── Lo que llega de Sanity ─────────────────────────────────────────────── */

type Bi = { es?: string; en?: string };
type BiLista = { es?: string[]; en?: string[] };
type ParSanity = { etiqueta?: Bi; valor?: Bi };
type CifraSanity = { prefijo?: string; valor: number; signo?: string; valorEn?: number; signoEn?: string; etiqueta?: Bi };

type ProyectoSanity = {
  _id: string;
  nombre?: Bi;
  ubicacion?: Bi;
  estado?: "operacion" | "desarrollo" | "proximo";
  formato?: string;
  foto?: ImagenSanity;
  descripcion?: Bi;
  aviso?: Bi;
  datos?: ParSanity[];
  etiquetaUnidad?: Bi;
  sitio?: string;
};

type GiroSanity = { _id: string; titulo?: Bi; descripcion?: Bi; imagen?: ImagenSanity; datos?: ParSanity[] };

type LineaSanity = {
  rotulo?: Bi;
  parrafos?: BiLista;
  fotos?: ImagenSanity[];
  listaTitulo?: Bi;
  listaItems?: { titulo?: Bi; icono?: string }[];
};

type UnidadSanity = {
  frase?: Bi;
  descripcion?: Bi;
  fotosHero?: ImagenSanity[];
  cifras?: CifraSanity[];
  tituloProyectos?: Bi;
  proyectos?: ProyectoSanity[];
  tituloProximos?: Bi;
  proximos?: ProyectoSanity[];
  girosRotulo?: Bi;
  girosTitulo?: Bi;
  girosNota?: Bi;
  giros?: GiroSanity[];
  marcasTitulo?: Bi;
  atributos?: { titulo?: Bi; icono?: string }[];
  viveros?: LineaSanity;
  teca?: LineaSanity;
  cierreTitulo?: Bi;
  metaTitulo?: Bi;
};

const PROYECTO = `{ _id, nombre, ubicacion, estado, formato, foto, descripcion, aviso, datos, etiquetaUnidad, sitio }`;
const CONSULTA = `*[_id == $id][0]{
  ...,
  "proyectos": proyectos[]->${PROYECTO},
  "proximos": proximos[]->${PROYECTO},
  "giros": giros[]->{ _id, titulo, descripcion, imagen, datos }
}`;

/* ── Ayudantes ──────────────────────────────────────────────────────────── */

/** El texto en el idioma pedido; en inglés, si falta, el español. */
const t = (v: Bi | undefined, idioma: Idioma, respaldo = "") =>
  (idioma === "en" ? v?.en || v?.es : v?.es) ?? respaldo;

const lista = (v: BiLista | undefined, idioma: Idioma, respaldo: string[] = []) =>
  (idioma === "en" ? v?.en?.length ? v.en : v?.es : v?.es) ?? respaldo;

const sinPrefijo = (id: string) => id.replace(/^(proyecto|giro)-/, "");

/** Los formatos en inglés: la lista del Studio está en español (proyecto.ts, FORMATOS). */
const FORMATO_EN: Record<string, string> = {
  "Parque industrial": "Industrial park",
  "Infraestructura aeroportuaria": "Airport infrastructure",
  "Lotes residenciales": "Residential lots",
};

/**
 * Una cifra en el idioma de la página. En inglés el «+» va detrás del número
 * («+44M» → «44M+»; «+44,000,000 m²» → «44,000,000+ m²»), y si la cifra trae
 * su versión en inglés (`valorEn`/`signoEn`: «960 mil» → «960K»), va ésa.
 */
export function cifraEnIdioma(c: CifraSanity, idioma: Idioma): Cifra {
  const etiqueta = t(c.etiqueta, idioma);
  if (idioma === "es")
    return { prefijo: c.prefijo || undefined, valor: c.valor, signo: c.signo || undefined, etiqueta };
  const valor = c.valorEn ?? c.valor;
  const signo = c.signoEn ?? c.signo ?? "";
  const mas = c.prefijo === "+";
  const signoFinal = !mas ? signo : signo.startsWith(" ") ? `+${signo}` : `${signo}+`;
  return { valor, signo: signoFinal || undefined, etiqueta };
}

const pares = (datos: ParSanity[] | undefined, idioma: Idioma): ParDato[] =>
  (datos ?? []).map((d) => ({ etiqueta: t(d.etiqueta, idioma), valor: t(d.valor, idioma) || undefined }));

function proyectoDeSanity(p: ProyectoSanity, idioma: Idioma, base: Proyecto | undefined): Proyecto {
  const imagen = datosDeImagen(p.foto);
  const nombre = t(p.nombre, idioma, base?.nombre);
  const formato = p.formato ? (idioma === "en" ? (FORMATO_EN[p.formato] ?? p.formato) : p.formato) : undefined;
  const datos: ParDato[] = [
    ...(formato ? [{ etiqueta: idioma === "en" ? "Format" : "Formato", valor: formato }] : []),
    ...pares(p.datos, idioma),
  ];
  return {
    id: sinPrefijo(p._id),
    nombre,
    ubicacion: t(p.ubicacion, idioma, base?.ubicacion),
    foto: imagen?.url ?? base?.foto,
    fotoRatio: imagen?.ratio ?? base?.fotoRatio,
    ancla: imagen?.focoY ?? base?.ancla,
    alt: t(p.foto?.alt, idioma, base?.alt),
    label: nombre,
    descripcion: t(p.descripcion, idioma, base?.descripcion),
    datos: (datos.length ? datos : (base?.datos ?? [{ etiqueta: "—" }])) as Proyecto["datos"],
    aviso: t(p.aviso, idioma) || undefined,
    sitio: p.sitio ?? base?.sitio,
  };
}

function proximoDeSanity(p: ProyectoSanity, idioma: Idioma, base: ProximoProyecto | undefined): ProximoProyecto {
  const imagen = datosDeImagen(p.foto);
  return {
    slug: sinPrefijo(p._id),
    name: t(p.nombre, idioma, base?.name),
    unit: t(p.etiquetaUnidad, idioma) || base?.unit || "",
    location: t(p.ubicacion, idioma) || base?.location,
    image: imagen?.url ?? base?.image,
    fotoRatio: imagen?.ratio ?? base?.fotoRatio,
    descripcion: t(p.descripcion, idioma) || base?.descripcion,
    datos: p.datos?.length ? pares(p.datos, idioma) : base?.datos,
  };
}

function giroDeSanity(g: GiroSanity, i: number, idioma: Idioma, base: Giro | undefined): Giro {
  const imagen = datosDeImagen(g.imagen);
  return {
    ...base,
    id: sinPrefijo(g._id),
    numero: String(i + 1).padStart(2, "0"),
    title: t(g.titulo, idioma, base?.title),
    description: t(g.descripcion, idioma) || base?.description,
    image: imagen?.url ?? base?.image,
    fotoRatio: imagen?.ratio ?? base?.fotoRatio,
    alt: t(g.imagen?.alt, idioma) || base?.alt,
    datos: g.datos?.length ? pares(g.datos, idioma) : base?.datos,
  };
}

const atributo = (a: { titulo?: Bi; icono?: string }, idioma: Idioma): Atributo => ({
  titulo: t(a.titulo, idioma),
  icono: a.icono as Atributo["icono"],
});

/* ── La página ──────────────────────────────────────────────────────────── */

export type ClaveUnidad = "comercial" | "industrial" | "vivienda" | "forestal";

export async function contenidoUnidad(
  clave: ClaveUnidad,
  idioma: Idioma,
  base: ContenidoUnidad,
): Promise<ContenidoUnidad> {
  const u = await consultar<UnidadSanity | null>(CONSULTA, { id: `unidad-${clave}` });
  if (!u) throw new Error(`Sanity no tiene el documento unidad-${clave}.`);

  const porId = new Map(base.proyectos.lista.map((p) => [p.id, p]));
  const proximosPorSlug = new Map(base.proximos.proyectos.map((p) => [p.slug, p]));
  const girosPorId = new Map(base.giros.bloques.map((g) => [g.id, g]));

  /* Las fotos del hero: al CDN de Sanity a 2400 px, sin el optimizador de Next
     —ver HeroCalado, «LAS FOTOS NO PASAN POR EL OPTIMIZADOR»—. */
  const fotosHero: FotoHero[] = (u.fotosHero ?? [])
    .map((f) => datosDeImagen(f))
    .filter((f): f is NonNullable<typeof f> => f !== null)
    .map((f) => ({ foto: urlAncho(f.url, 2400), ratio: f.ratio, ancla: f.focoY ?? ANCLA_POR_DEFECTO }));

  const lineas = base.lineas?.map((linea) => {
    const s = linea.id === "viveros-asturias" ? u.viveros : linea.id === "teca-san-miguel" ? u.teca : undefined;
    if (!s) return linea;
    const fotos = (s.fotos ?? [])
      .map((f) => ({ d: datosDeImagen(f), alt: t(f.alt, idioma) }))
      .filter((f) => f.d)
      .map((f) => ({ src: f.d!.url, alt: f.alt, ratio: f.d!.ratio }));
    return {
      ...linea,
      rotulo: t(s.rotulo, idioma) || undefined,
      parrafos: lista(s.parrafos, idioma, linea.parrafos),
      fotos: (fotos.length ? fotos : linea.fotos) as typeof linea.fotos,
      lista: {
        rotulo: t(s.listaTitulo, idioma, linea.lista.rotulo),
        items: s.listaItems?.length ? s.listaItems.map((a) => atributo(a, idioma)) : linea.lista.items,
      },
    };
  });

  return {
    ...base,
    metadata: {
      title: t(u.metaTitulo, idioma, base.metadata.title),
      /* Comercial arma la suya con el número de plazas y estados: se respeta. */
      description: clave === "comercial" ? base.metadata.description : t(u.descripcion, idioma, base.metadata.description),
    },
    hero: { ...base.hero, fotos: fotosHero.length ? fotosHero : base.hero.fotos },
    cifras: u.cifras?.length ? u.cifras.map((c) => cifraEnIdioma(c, idioma)) : base.cifras,
    atributos: u.atributos?.length ? u.atributos.map((a) => atributo(a, idioma)) : base.atributos,
    lineas,
    proyectos: {
      titulo: t(u.tituloProyectos, idioma, base.proyectos.titulo),
      lista: u.proyectos?.length
        ? u.proyectos.map((p) => proyectoDeSanity(p, idioma, porId.get(sinPrefijo(p._id))))
        : base.proyectos.lista,
    },
    giros: {
      ...base.giros,
      eyebrow: t(u.girosRotulo, idioma) || base.giros.eyebrow,
      titulo: t(u.girosTitulo, idioma, base.giros.titulo),
      nota: t(u.girosNota, idioma) || base.giros.nota,
      bloques: u.giros?.length
        ? u.giros.map((g, i) => giroDeSanity(g, i, idioma, girosPorId.get(sinPrefijo(g._id))))
        : base.giros.bloques,
    },
    marcas: { ...base.marcas, titulo: t(u.marcasTitulo, idioma, base.marcas.titulo) },
    proximos: {
      titulo: t(u.tituloProximos, idioma, base.proximos.titulo),
      proyectos: u.proximos?.length
        ? u.proximos.map((p) => proximoDeSanity(p, idioma, proximosPorSlug.get(sinPrefijo(p._id))))
        : base.proximos.proyectos,
    },
    cierre: base.cierre && { ...base.cierre, titulo: t(u.cierreTitulo, idioma, base.cierre.titulo) },
  };
}
