import type { Unidad } from "./contacto";

/**
 * El color de una unidad de negocio, como referencia al token.
 *
 * Devuelve `var(--unidad-…)`, nunca el valor: el valor vive sólo en
 * app/ui/tokens.css. Quien lo use lo pone en línea como --color-unidad, que es
 * el nombre que leen las hojas —el mismo en el home y en el hero—.
 */
export const colorDeUnidad = (unidad: Unidad) =>
  `var(--unidad-${unidad.toLowerCase()})`;
