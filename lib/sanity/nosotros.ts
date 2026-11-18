import { contenidoNosotros } from "@/app/_nosotros/contenido";
import type { FotoGaleria } from "@/app/_nosotros/content";
import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";
import { trozosDeLinea } from "./home";
import { datosDeImagen, type ImagenSanity } from "./imagenes";
import { cifraEnIdioma } from "./unidad";

/**
 * NOSOTROS DESDE SANITY (noviembre de 2026).
 *
 * Mismo criterio que el home y las unidades: el contenido del código
 * (app/_nosotros/content.ts o content.en.ts) más lo editable de Sanity. Se
 * quedan en el código la frase animada de la historia, los iconos de los
 * pilares, el organigrama de Grupo Firmas con sus logos y el mapa.
 *
 * «Presencia» manda en las cuentas que se escriben solas («21 estados de
 * México…», «21 estados · 4 países») y en los m² de cada estado del mapa: van
 * en `PRESENCIA_M2`, que lee MapaPuntos.
 */
type Bi = { es?: string; en?: string };
type BiLista = { es?: string[]; en?: string[] };
type LineaPT = { children?: { text?: string; marks?: string[] }[] }[];
type ImagenConAlt = ImagenSanity;

type NosotrosSanity = {
  titularLinea1?: { es?: LineaPT; en?: LineaPT };
  titularLinea2?: { es?: LineaPT; en?: LineaPT };
  titularLinea3?: { es?: LineaPT; en?: LineaPT };
  bajada?: Bi;
  origenTitulo?: Bi;
  origenParrafos?: BiLista;
  origenFotos?: ImagenConAlt[];
  pilaresTitulo?: Bi;
  pilares?: Bi[];
  grupoTitulo?: Bi;
  grupoIntro?: Bi;
  grupoPie?: Bi[];
  huellaTitulo?: Bi;
  huellaBoton?: Bi;
  huellaBotonEnlace?: string;
  huellaCifras?: Parameters<typeof cifraEnIdioma>[0][];
  huellaDesglose?: { etiqueta?: Bi; valor?: number }[];
  mapaRotulo?: Bi;
  mapaPista?: Bi;
  mapaPistaTactil?: Bi;
  mapaElegir?: Bi;
  mapaEtiquetaEstado?: Bi;
  mapaSinDato?: Bi;
  rsRotulo?: Bi;
  rsTitulo?: Bi;
  rsSubtitulo?: Bi;
  rsParrafos?: BiLista;
  rsGaleria?: { imagen?: ImagenConAlt; pie?: Bi }[];
  verdesTitulo?: Bi;
  verdesParrafos?: BiLista;
  verdesGaleria?: ImagenConAlt[];
  metaTitulo?: Bi;
  metaDescripcion?: Bi;
  presencia?: { estados?: { estado?: string; m2?: number }[]; paises?: Bi[] };
};

const t = (v: Bi | undefined, idioma: Idioma) => (idioma === "en" ? v?.en || v?.es : v?.es) || undefined;
const lista = (v: BiLista | undefined, idioma: Idioma) => {
  const l = idioma === "en" ? (v?.en?.length ? v.en : v?.es) : v?.es;
  return l?.length ? l : undefined;
};

/** «a, b y c» / «a, b and c»: sin coma serial, como el resto del sitio. */
const enumerar = (xs: string[], idioma: Idioma) =>
  xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} ${idioma === "en" ? "and" : "y"} ${xs.at(-1)}`;

/** Una galería: las fotos de Sanity sobre las del código, por posición (los ids y el acomodo son del código). */
function galeria(base: FotoGaleria[], sanity: { imagen?: ImagenConAlt; pie?: Bi }[] | undefined, idioma: Idioma): FotoGaleria[] {
  if (!sanity?.length) return base;
  return sanity.map((f, i) => {
    const d = datosDeImagen(f.imagen);
    return {
      ...base[i],
      id: base[i]?.id ?? `foto-${i + 1}`,
      src: d?.url ?? base[i]?.src,
      alt: t(f.imagen?.alt, idioma) ?? base[i]?.alt,
      nota: t(f.pie, idioma) ?? base[i]?.nota,
    };
  });
}

export type ContenidoNosotros = ReturnType<typeof contenidoNosotros> & {
  /** Los m² de cada estado con presencia, por clave ISO (MX-NLE…). Ver MapaPuntos. */
  PRESENCIA_M2?: Record<string, number>;
};

export async function contenidoNosotrosSanity(idioma: Idioma): Promise<ContenidoNosotros> {
  const base = contenidoNosotros(idioma);
  const n = await consultar<NosotrosSanity | null>(`*[_id == "paginaNosotros"][0]{ ..., "presencia": *[_id == "presencia"][0]{ estados, paises } }`);
  if (!n) throw new Error("Sanity no tiene el documento paginaNosotros.");

  const lineas = [n.titularLinea1, n.titularLinea2, n.titularLinea3].map((l) =>
    trozosDeLinea(l?.[idioma] ?? l?.es, "acento"),
  );
  const estados = (n.presencia?.estados ?? []).filter((e) => e.estado);
  const paises = (n.presencia?.paises ?? []).map((p) => t(p, idioma)).filter((p): p is string => !!p);
  const hayPresencia = estados.length > 0;
  const nEstados = estados.length;

  const fotosOrigen = (n.origenFotos ?? []).map((f, i) => {
    const d = datosDeImagen(f);
    return d ? { ...base.ORIGEN.fotos[i], src: d.url, ratio: d.ratio, alt: t(f.alt, idioma) ?? base.ORIGEN.fotos[i]?.alt ?? "" } : base.ORIGEN.fotos[i];
  }).filter(Boolean);

  const HUELLA = {
    ...base.HUELLA,
    title: t(n.huellaTitulo, idioma) ?? base.HUELLA.title,
    body: hayPresencia
      ? idioma === "en"
        ? `We have a presence in ${nEstados} states of Mexico, as well as in ${enumerar(paises, idioma)}. This coverage reflects our capacity to develop projects across different territories.`
        : `Tenemos presencia en ${nEstados} estados de México, así como en ${enumerar(paises, idioma)}. Esta cobertura refleja nuestra capacidad para desarrollar proyectos en distintos territorios.`
      : base.HUELLA.body,
    cta: {
      ...base.HUELLA.cta,
      texto: t(n.huellaBoton, idioma) ?? base.HUELLA.cta.texto,
      href: n.huellaBotonEnlace ?? base.HUELLA.cta.href,
    },
    stats: n.huellaCifras?.length
      ? n.huellaCifras.map((c) => {
          const x = cifraEnIdioma(c, idioma);
          return { prefix: x.prefijo, to: x.valor, suffix: x.signo, label: x.etiqueta };
        })
      : base.HUELLA.stats,
    desglose: n.huellaDesglose?.length
      ? n.huellaDesglose.map((d, i) => ({ ...base.HUELLA.desglose[i], label: t(d.etiqueta, idioma) ?? "", value: d.valor ?? 0 }))
      : base.HUELLA.desglose,
    mapa: {
      ...base.HUELLA.mapa,
      etiqueta: t(n.mapaRotulo, idioma) ?? base.HUELLA.mapa.etiqueta,
      titulo: hayPresencia ? (idioma === "en" ? `${nEstados} states of Mexico` : `${nEstados} estados de México`) : base.HUELLA.mapa.titulo,
      pista: t(n.mapaPista, idioma) ?? base.HUELLA.mapa.pista,
      pistaTactil: t(n.mapaPistaTactil, idioma) ?? base.HUELLA.mapa.pistaTactil,
      elegir: t(n.mapaElegir, idioma) ?? base.HUELLA.mapa.elegir,
      etiquetaEstado: t(n.mapaEtiquetaEstado, idioma) ?? base.HUELLA.mapa.etiquetaEstado,
      sinDato: t(n.mapaSinDato, idioma) ?? base.HUELLA.mapa.sinDato,
    },
  };

  return {
    ...base,
    HERO: {
      ...base.HERO,
      lineas: lineas.every(Boolean) ? (lineas as typeof base.HERO.lineas) : base.HERO.lineas,
      bajada: t(n.bajada, idioma) ?? base.HERO.bajada,
      pie: {
        ...base.HERO.pie,
        isotipo: hayPresencia
          ? idioma === "en"
            ? `${nEstados} states · ${paises.length + 1} countries`
            : `${nEstados} estados · ${paises.length + 1} países`
          : base.HERO.pie.isotipo,
      },
    },
    ORIGEN: {
      ...base.ORIGEN,
      title: t(n.origenTitulo, idioma) ?? base.ORIGEN.title,
      parrafos: lista(n.origenParrafos, idioma) ?? base.ORIGEN.parrafos,
      fotos: (fotosOrigen.length ? fotosOrigen : base.ORIGEN.fotos) as typeof base.ORIGEN.fotos,
    },
    PILARES: {
      ...base.PILARES,
      title: t(n.pilaresTitulo, idioma) ?? base.PILARES.title,
      bloques: base.PILARES.bloques.map((b, i) => ({ ...b, title: t(n.pilares?.[i], idioma) ?? b.title })),
    },
    GRUPO_FIRMA: {
      ...base.GRUPO_FIRMA,
      title: t(n.grupoTitulo, idioma) ?? base.GRUPO_FIRMA.title,
      intro: t(n.grupoIntro, idioma) ?? base.GRUPO_FIRMA.intro,
      pie: (n.grupoPie?.length === 2 ? n.grupoPie.map((p, i) => t(p, idioma) ?? base.GRUPO_FIRMA.pie[i]) : base.GRUPO_FIRMA.pie) as typeof base.GRUPO_FIRMA.pie,
    },
    HUELLA,
    RESPONSABILIDAD: {
      ...base.RESPONSABILIDAD,
      eyebrow: t(n.rsRotulo, idioma) ?? base.RESPONSABILIDAD.eyebrow,
      title: t(n.rsTitulo, idioma) ?? base.RESPONSABILIDAD.title,
      subtitulo: t(n.rsSubtitulo, idioma) ?? base.RESPONSABILIDAD.subtitulo,
      descripcion: lista(n.rsParrafos, idioma) ?? base.RESPONSABILIDAD.descripcion,
      galeria: galeria(base.RESPONSABILIDAD.galeria, n.rsGaleria, idioma),
      verdes: {
        ...base.RESPONSABILIDAD.verdes,
        titulo: t(n.verdesTitulo, idioma) ?? base.RESPONSABILIDAD.verdes.titulo,
        descripcion: lista(n.verdesParrafos, idioma) ?? base.RESPONSABILIDAD.verdes.descripcion,
        galeria: galeria(
          base.RESPONSABILIDAD.verdes.galeria,
          n.verdesGaleria?.map((imagen) => ({ imagen })),
          idioma,
        ),
      },
    },
    PRESENCIA_M2: hayPresencia
      ? Object.fromEntries(estados.filter((e) => typeof e.m2 === "number").map((e) => [e.estado!, e.m2!]))
      : undefined,
  } as ContenidoNosotros;
}

/** El título y la descripción de /nosotros para Google. */
export async function metaNosotros(idioma: Idioma) {
  const n = await consultar<{ metaTitulo?: Bi; metaDescripcion?: Bi } | null>(`*[_id == "paginaNosotros"][0]{ metaTitulo, metaDescripcion }`);
  return { title: t(n?.metaTitulo, idioma), description: t(n?.metaDescripcion, idioma) };
}
