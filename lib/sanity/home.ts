import { contenidoHome } from "@/app/_home/contenido";
import type { BusinessUnitCard, FeaturedProject, HomeStat, TrozoTitular } from "@/app/_home/content";
import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";
import { datosDeImagen, type ImagenSanity } from "./imagenes";
import { cifraEnIdioma } from "./unidad";

/**
 * EL HOME DESDE SANITY (noviembre de 2026).
 *
 * Mismo criterio que las unidades: parte del contenido del código (content.ts o
 * content.en.ts) y le pone encima lo editable de Sanity. Lo que es diseño se
 * queda en el código: el emblema, los colores de las carpetas, la imagen del
 * cierre, los enlaces.
 *
 * Lo arma el servidor y lo reparte a los componentes del navegador por
 * contexto: ver app/_home/ContenidoHome.tsx.
 */
export type ContenidoHome = ReturnType<typeof contenidoHome>;

type Bi = { es?: string; en?: string };
type Span = { text?: string; marks?: string[] };
type LineaPT = { children?: Span[] }[];
type CifraHomeSanity = Parameters<typeof cifraEnIdioma>[0] & { nota?: Bi };

type ProyectoRef = {
  _id: string;
  nombre?: Bi;
  ubicacion?: Bi;
  estado?: string;
  unidad?: string;
  foto?: ImagenSanity;
  descripcion?: Bi;
};

type HomeSanity = {
  titularLinea1?: { es?: LineaPT; en?: LineaPT };
  titularLinea2?: { es?: LineaPT; en?: LineaPT };
  frase?: Bi;
  cifras?: CifraHomeSanity[];
  youtube?: string;
  videoTitulo?: Bi;
  videoDescripcion?: Bi;
  tituloUnidades?: Bi;
  descripcionUnidades?: Bi;
  tituloProyectos?: Bi;
  destacados?: {
    proyecto?: ProyectoRef;
    nombre?: Bi;
    ubicacion?: Bi;
    descripcion?: Bi;
    foto?: ImagenSanity;
  }[];
  unidades?: { _id: string; frase?: Bi; descripcion?: Bi; fotoCarpeta?: ImagenSanity }[];
  cierre?: { rotulo?: Bi; titulo?: Bi };
};

const CONSULTA = `*[_id == "paginaInicio"][0]{
  ...,
  "destacados": proyectosDestacados[]{
    nombre, ubicacion, descripcion, foto,
    "proyecto": proyecto->{ _id, nombre, ubicacion, estado, unidad, foto, descripcion }
  },
  "unidades": *[_type == "unidad"]{ _id, frase, descripcion, fotoCarpeta },
  "cierre": *[_id == "cierre"][0]{ rotulo, titulo }
}`;

const t = (v: Bi | undefined, idioma: Idioma) =>
  (idioma === "en" ? v?.en || v?.es : v?.es) || undefined;

/**
 * Lo que el home dice distinto de un proyecto, SÓLO en ese idioma: sin caer al
 * español. Que el home cambie la descripción en español no quiere decir que en
 * inglés también (Amarantha: corta en español, la del proyecto en inglés).
 */
const soloEn = (v: Bi | undefined, idioma: Idioma) => v?.[idioma] || undefined;

/** Una línea de titular en Portable Text → trozos `{ texto, atenuado }`. */
export function trozosDeLinea(linea: LineaPT | undefined, marca: "atenuado" | "acento"): TrozoTitular[] | undefined {
  const spans = linea?.[0]?.children;
  if (!spans?.length) return undefined;
  return spans
    .map((s) => ({ texto: (s.text ?? "").trim(), marcado: s.marks?.includes(marca) ?? false }))
    .filter((s) => s.texto)
    .map((s) => (s.marcado ? { texto: s.texto, [marca]: true } : { texto: s.texto })) as TrozoTitular[];
}

/** La unidad del proyecto como se lee en la tarjeta del carril. */
const NOMBRE_UNIDAD: Record<string, Record<Idioma, string>> = {
  comercial: { es: "Comercial", en: "Commercial" },
  industrial: { es: "Industrial", en: "Industrial" },
  vivienda: { es: "Vivienda", en: "Residential" },
  forestal: { es: "Forestal", en: "Forestry" },
};

/** «En operación» u «En desarrollo»: un próximo se presenta en desarrollo. */
const ESTADO: Record<"operacion" | "desarrollo", Record<Idioma, string>> = {
  operacion: { es: "En operación", en: "In operation" },
  desarrollo: { es: "En desarrollo", en: "Under development" },
};

export async function contenidoHomeSanity(idioma: Idioma): Promise<ContenidoHome> {
  const base = contenidoHome(idioma);
  const h = await consultar<HomeSanity | null>(CONSULTA);
  if (!h) throw new Error("Sanity no tiene el documento paginaInicio.");

  const linea1 = trozosDeLinea(h.titularLinea1?.[idioma] ?? h.titularLinea1?.es, "atenuado");
  const linea2 = trozosDeLinea(h.titularLinea2?.[idioma] ?? h.titularLinea2?.es, "atenuado");
  const lineas = linea1 && linea2 ? [linea1, linea2] : base.HERO_A.lineas;

  const STATS: HomeStat[] = h.cifras?.length
    ? h.cifras.map((c) => {
        const x = cifraEnIdioma(c, idioma);
        return { prefix: x.prefijo, to: x.valor, suffix: x.signo, note: t(c.nota, idioma), label: x.etiqueta };
      })
    : base.STATS;

  const unidades = new Map((h.unidades ?? []).map((u) => [u._id.replace(/^unidad-/, ""), u]));
  const BUSINESS_UNITS: BusinessUnitCard[] = base.BUSINESS_UNITS.map((b) => {
    const u = unidades.get(b.slug);
    const foto = datosDeImagen(u?.fotoCarpeta);
    return {
      ...b,
      apertura: t(u?.frase, idioma) ?? b.apertura,
      descripcion: t(u?.descripcion, idioma) ?? b.descripcion,
      image: foto?.url ?? b.image,
      alt: t(u?.fotoCarpeta?.alt, idioma) ?? b.alt,
    };
  });

  const basePorSlug = new Map(base.FEATURED_PROJECTS.map((p) => [p.slug, p as FeaturedProject]));
  const FEATURED_PROJECTS = h.destacados?.length
    ? h.destacados
        .filter((d) => d.proyecto)
        .map((d) => {
          const p = d.proyecto!;
          const slug = p._id.replace(/^proyecto-/, "");
          const b = basePorSlug.get(slug);
          const foto = datosDeImagen(d.foto) ?? datosDeImagen(p.foto);
          const estado = p.estado === "operacion" ? "operacion" : "desarrollo";
          return {
            ...b,
            slug,
            name: soloEn(d.nombre, idioma) ?? t(p.nombre, idioma) ?? b?.name ?? slug,
            unit: (p.unidad && NOMBRE_UNIDAD[p.unidad]?.[idioma]) ?? b?.unit ?? "",
            location: soloEn(d.ubicacion, idioma) ?? t(p.ubicacion, idioma) ?? b?.location ?? "",
            estado: ESTADO[estado][idioma],
            image: foto?.url ?? b?.image,
            descripcion: soloEn(d.descripcion, idioma) ?? t(p.descripcion, idioma) ?? b?.descripcion,
          } as FeaturedProject;
        })
    : base.FEATURED_PROJECTS;

  return {
    ...base,
    HERO_A: { ...base.HERO_A, lineas },
    TITULO_HERO: lineas.map((l) => l.map((x) => x.texto).join(" ")).join(" "),
    STATS_INTRO: t(h.frase, idioma) ?? base.STATS_INTRO,
    STATS,
    VIDEO: {
      ...base.VIDEO,
      youtube: h.youtube || base.VIDEO.youtube,
      titulo: t(h.videoTitulo, idioma) ?? base.VIDEO.titulo,
      caption: t(h.videoDescripcion, idioma) ?? base.VIDEO.caption,
    },
    BUSINESS_UNITS_INTRO: {
      ...base.BUSINESS_UNITS_INTRO,
      titulo: t(h.tituloUnidades, idioma) ?? base.BUSINESS_UNITS_INTRO.titulo,
      descripcion: t(h.descripcionUnidades, idioma) ?? base.BUSINESS_UNITS_INTRO.descripcion,
    },
    BUSINESS_UNITS,
    FEATURED_PROJECTS_INTRO: {
      ...base.FEATURED_PROJECTS_INTRO,
      titulo: t(h.tituloProyectos, idioma) ?? base.FEATURED_PROJECTS_INTRO.titulo,
    },
    FEATURED_PROJECTS,
    CONTACT_CTA: {
      ...base.CONTACT_CTA,
      eyebrow: t(h.cierre?.rotulo, idioma) ?? base.CONTACT_CTA.eyebrow,
      title: t(h.cierre?.titulo, idioma) ?? base.CONTACT_CTA.title,
    },
  } as ContenidoHome;
}

/** El título y la descripción del home para Google: «Datos de contacto y del sitio» → Buscadores. */
export async function metaHome(idioma: Idioma) {
  const a = await consultar<{ metaTitulo?: Bi; metaDescripcion?: Bi } | null>(`*[_id == "ajustesSitio"][0]{ metaTitulo, metaDescripcion }`);
  return { title: t(a?.metaTitulo, idioma), description: t(a?.metaDescripcion, idioma) };
}
