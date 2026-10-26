/**
 * Las reglas que IMPIDEN publicar algo que descuadra el sitio.
 *
 * Los números salen de docs/sanity-inventario.md: se midieron en el navegador
 * con el build real, alargando cada texto hasta que la maqueta fallaba, en
 * 360×740, 390×844, 1280×720 y 1440×900. El límite es el más restrictivo de los
 * cuatro. Si cambia el diseño, se vuelven a medir; no se suben a ojo.
 *
 * Todas son de nivel `error`: en Sanity eso bloquea el botón «Publicar». El
 * borrador se sigue guardando solo mientras se escribe —así funciona el
 * Studio—, pero nada con un error llega al sitio.
 */
import type { CustomValidator, PortableTextBlock } from "sanity";

/**
 * Cualquier regla de Sanity (de texto, de arreglo, de imagen…): todas tienen
 * `custom`. Los ayudantes de abajo sirven para todas.
 */
type ReglaConCustom = { custom: (fn: never) => unknown };
function custom<R extends ReglaConCustom>(rule: R, fn: CustomValidator<unknown>): R {
  return (rule.custom as unknown as (f: CustomValidator<unknown>) => R)(fn);
}

/* ── Texto ────────────────────────────────────────────────────────────── */

/** El texto plano de un bloque de Portable Text (o de varios). */
export function textoPlano(valor: unknown): string {
  if (!Array.isArray(valor)) return typeof valor === "string" ? valor : "";
  return (valor as PortableTextBlock[])
    .map((b) =>
      Array.isArray(b?.children)
        ? (b.children as { text?: string }[]).map((c) => c.text ?? "").join("")
        : "",
    )
    .join("\n");
}

/**
 * Máximo de caracteres con el motivo dicho en el error. `motivo` completa la
 * frase «más largo, …»: lo lee alguien que no sabe nada del proyecto.
 */
export const maximo =
  (n: number, motivo: string) =>
  <R extends ReglaConCustom>(rule: R) =>
    custom(rule, (valor) => {
      const largo = textoPlano(valor).length;
      return largo <= n
        ? true
        : `Tiene ${largo} caracteres y el máximo es ${n}: más largo, ${motivo}.`;
    });

/* ── Imágenes ─────────────────────────────────────────────────────────── */

/**
 * El ancho del archivo, sin pedirlo a la API: Sanity lo escribe en el id del
 * asset — `image-<hash>-2000x1332-webp`.
 */
export function anchoDeImagen(valor: unknown): number | null {
  const ref = (valor as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  const m = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/);
  return m ? Number(m[1]) : null;
}

/**
 * Ancho mínimo por campo, y el ancho al que de verdad se PINTA la foto en el
 * peor caso (teléfono a 3× o escritorio retina), medido en el navegador
 * (docs/sanity-inventario.md §11).
 *
 * `minimo` NO es lo medido. Es una decisión (26 oct 2026): el ancho de la foto
 * más chica que hay hoy en ese lugar, para que la migración no se trabe y aun
 * así no entre nada peor que lo que ya está publicado. Donde el mínimo queda por
 * debajo de `sePinta`, las fotos de hoy ya se estiran.
 *
 * Si Altea entrega los originales en alta, se reexportan y `minimo` sube hacia
 * `sePinta`. Si no, se queda así.
 *
 * Carpeta y galería son la excepción: sus fotos de hoy (1 980 px) sobran, así
 * que el mínimo es lo que se pinta y no el tamaño del archivo.
 */
export const ANCHO = {
  /** Dentro de la palabra del hero y a pantalla completa. Hoy la más chica: Amarantha, 1 979. */
  hero: { minimo: 1979, sePinta: 4140 },
  /**
   * Tarjetas de proyecto y próximos. Hoy la más chica: Pocket Park, 1 078 (y
   * Primavera, 1 200); la siguiente ya es de 1 536. Esas dos fijan el número.
   */
  tarjeta: { minimo: 1078, sePinta: 2641 },
  /** Líneas de Forestal. Hoy la más chica: Viveros Asturias 1, 1 280; las otras, 1 980. */
  lineaForestal: { minimo: 1280, sePinta: 3598 },
  /** La historia de /nosotros. Hoy la más chica: 1 363. */
  origen: { minimo: 1363, sePinta: 2040 },
  /** Paneles de Otros giros (Comercial). Hoy el más chico: Fiesta Inn, 1 159. */
  giro: { minimo: 1159, sePinta: 1860 },
  /** Carpetas del home. Hoy: 1 980. */
  carpeta: { minimo: 1400, sePinta: 1400 },
  /** Galería de Responsabilidad social. Hoy: 1 980. */
  galeria: { minimo: 1100, sePinta: 1052 },
} as const;

export type CampoDeFoto = keyof typeof ANCHO;

/**
 * Bloquea una foto más angosta que el mínimo del campo. Sin esto una foto chica
 * entra sin aviso y nadie se entera hasta verla publicada y blanda.
 */
export const anchoMinimo =
  (campo: CampoDeFoto, donde: string) =>
  <R extends ReglaConCustom>(rule: R) =>
    custom(rule, (valor) => {
      if (!valor) return true;
      const ancho = anchoDeImagen(valor);
      if (ancho === null) return true;
      const { minimo } = ANCHO[campo];
      return ancho >= minimo
        ? true
        : `La imagen mide ${ancho} px de ancho y el mínimo para ${donde} es ${minimo} px: más chica, se vería borrosa. ${textoDeAncho(campo)}`;
    });

/** «Mínimo 1,979 px de ancho. Se pinta hasta a 4,140 px: si la tienes así de grande, mejor.» */
export function textoDeAncho(campo: CampoDeFoto): string {
  const { minimo, sePinta } = ANCHO[campo];
  const n = (x: number) => x.toLocaleString("es-MX");
  return sePinta > minimo
    ? `Mínimo ${n(minimo)} px de ancho. Se pinta hasta a ${n(sePinta)} px: si la tienes así de grande, mejor.`
    : `Mínimo ${n(minimo)} px de ancho.`;
}

/* ── Cifras ───────────────────────────────────────────────────────────── */

/**
 * Las opciones de prefijo y signo. NO son texto libre: de ellas sale lo que lee
 * el lector de pantalla (`app/ui/CountUp.tsx`: «+» → «más de», «M» → «millones»,
 * «%» → «por ciento», «m²» → «metros cuadrados») y van pintadas en el color de
 * la unidad. El espacio de « mil» y « m²» es a propósito: se ve.
 */
export const PREFIJOS = [{ title: "Sin prefijo", value: "" }, { title: "+ (más de)", value: "+" }];
export const SIGNOS = [
  { title: "Sin signo", value: "" },
  { title: "M (millones)", value: "M" },
  { title: "mil", value: " mil" },
  { title: "%", value: "%" },
  { title: "m²", value: " m²" },
];

/** La cifra exactamente como se ve: «+376,034», «+18.8M», «94%». */
export function cifraVisible(c: { prefijo?: string; valor?: number; signo?: string } | undefined) {
  if (!c || typeof c.valor !== "number") return "";
  return `${c.prefijo ?? ""}${c.valor.toLocaleString("es-MX")}${c.signo ?? ""}`;
}

export const maximoCifra =
  (n: number, motivo: string) =>
  <R extends ReglaConCustom>(rule: R) =>
    custom(rule, (c) => {
      const v = cifraVisible(c as { prefijo?: string; valor?: number; signo?: string } | undefined);
      return v.length <= n
        ? true
        : `«${v}» ocupa ${v.length} caracteres con el prefijo y el signo, y el máximo es ${n}: más larga, ${motivo}.`;
    });

/* ── Cantidades ───────────────────────────────────────────────────────── */

/** Mínimo y máximo de elementos de una lista, con el porqué. */
export const cantidad =
  (min: number, max: number, motivo: string) =>
  <R extends ReglaConCustom>(rule: R) =>
    custom(rule, (lista) => {
      const n = (lista as unknown[] | undefined)?.length ?? 0;
      if (n >= min && n <= max) return true;
      const rango = min === max ? `exactamente ${min}` : `entre ${min} y ${max}`;
      return `Hay ${n} y tienen que ser ${rango}: ${motivo}.`;
    });

/* ── Las cuatro unidades ──────────────────────────────────────────────── */

export const UNIDADES = [
  { title: "Comercial", value: "comercial" },
  { title: "Industrial", value: "industrial" },
  { title: "Vivienda", value: "vivienda" },
  { title: "Forestal", value: "forestal" },
] as const;

/** «comercial» a partir del id del documento único (`unidad-comercial`, o su borrador). */
export function claveDeUnidad(id: string | undefined): string {
  return (id ?? "").replace(/^drafts\./, "").replace(/^unidad-/, "");
}
