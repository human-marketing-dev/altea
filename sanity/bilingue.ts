/**
 * LOS DOS IDIOMAS EN UN MISMO CAMPO (noviembre de 2026).
 *
 * El sitio es bilingüe desde noviembre y Altea edita los dos idiomas. Cada texto
 * editable es un objeto `{ es, en }`: dos casillas, una junto a otra, con el
 * mismo tipo y la misma descripción. Lo que no es texto —fotos, números,
 * enlaces, listas cerradas— no se duplica: es lo mismo en los dos idiomas.
 *
 * Los LÍMITES DE CARACTERES se midieron con el texto en español (ver reglas.ts y
 * docs/sanity-inventario.md). En español son error y bloquean «Publicar», como
 * siempre. En inglés son AVISO: la maqueta es la misma, pero el ancho medio de
 * las letras no, y algunos textos en inglés ya aprobados rebasan el número sin
 * romper nada (p. ej. la primera línea del hero del home, 21 contra 18). El
 * aviso se ve en amarillo y deja publicar.
 *
 * Los legales no van por aquí: son un documento por idioma (ver paginas.ts).
 */
import { defineField, type ConditionalProperty, type Rule } from "sanity";

export type Idioma = "es" | "en";

export const IDIOMAS: { id: Idioma; titulo: string }[] = [
  { id: "es", titulo: "Español" },
  { id: "en", titulo: "English" },
];

/**
 * Una regla de un idioma. Recibe la regla de Sanity y el idioma, y devuelve una
 * o varias reglas. Para que un límite sea error en español y aviso en inglés,
 * usar `segunIdioma` (abajo).
 */
type ReglaDeIdioma = (rule: Rule, idioma: Idioma) => Rule | Rule[];

/** Error en español, aviso en inglés. */
export const segunIdioma = (r: Rule, idioma: Idioma) => (idioma === "es" ? r.error() : r.warning());

type Opciones = {
  name: string;
  title: string;
  /** El tipo de cada casilla: "string", "text", o un tipo propio (una línea de titular…). */
  type: string;
  /** Si el tipo cambia por idioma (las líneas de titular: en inglés el límite es aviso). */
  tipoPorIdioma?: Record<Idioma, string>;
  description?: string;
  group?: string;
  rows?: number;
  hidden?: ConditionalProperty;
  /** Obligatorio en los dos idiomas. */
  requerido?: boolean;
  /** Reglas por idioma: ver `ReglaDeIdioma`. */
  reglas?: ReglaDeIdioma;
  /** Listas de opciones u otras opciones del tipo de cada casilla. */
  opcionesCasilla?: Record<string, unknown>;
  /** Para `type: "array"`: los miembros de la lista (p. ej. párrafos). */
  of?: unknown[];
};

/**
 * Un campo bilingüe: un objeto con `es` y `en`, en dos columnas.
 *
 *   bi({ name: "titulo", title: "Título", type: "string", requerido: true,
 *        reglas: (r, i) => segunIdioma(maximo(37, "agrega un renglón")(r), i) })
 */
export function bi(o: Opciones) {
  return defineField({
    name: o.name,
    title: o.title,
    type: "object",
    group: o.group,
    hidden: o.hidden,
    description: o.description,
    options: { columns: 2 },
    fields: IDIOMAS.map(({ id, titulo }) =>
      /* El tipo de la casilla llega como texto («string», «text», una línea de
         titular…): defineField no puede estrecharlo aquí, de ahí el molde. */
      defineField({
        name: id,
        title: titulo,
        type: o.tipoPorIdioma?.[id] ?? o.type,
        ...(o.rows ? { rows: o.rows } : {}),
        ...(o.opcionesCasilla ? { options: o.opcionesCasilla } : {}),
        ...(o.of ? { of: o.of } : {}),
        /*
         * ⚠ SIN `validation` CUANDO NO HAY REGLAS. Un `validation` en el campo,
         * aunque devuelva una lista vacía, SUSTITUYE al del tipo: con él, las
         * reglas propias de las líneas de titular (obligatoria, un renglón,
         * largo) dejaban de correr. Encontrado al migrar (nov 2026).
         */
        ...(o.requerido || o.reglas ? { validation: (rule: Rule) => {
          const reglas: Rule[] = [];
          if (o.requerido)
            reglas.push(
              rule.required().error(id === "es" ? "Falta el texto en español." : "Falta el texto en inglés."),
            );
          if (o.reglas) {
            const r = o.reglas(rule, id);
            reglas.push(...(Array.isArray(r) ? r : [r]));
          }
          return reglas;
        } } : {}),
      } as unknown as Parameters<typeof defineField>[0]),
    ),
  });
}

/** El texto en español de un campo bilingüe, para las vistas previas del Studio. */
export const enEspanol = (valor: unknown): string | undefined =>
  (valor as { es?: string } | undefined)?.es;
