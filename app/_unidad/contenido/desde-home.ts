import { BUSINESS_UNITS } from "@/app/_home/content";

/**
 * Lo que las páginas de unidad toman del home en vez de escribirlo de nuevo.
 *
 * Es copy ya aprobado —la tarjeta de cada unidad en "unidades de negocio"— y
 * se LEE de allí, no se copia: si cambia en el home, cambia aquí.
 *
 * Los proyectos ya no: llegó el copy propio de cada unidad, más completo que el
 * del carril del home, y vive en su archivo de contenido.
 */

/** La tarjeta de la unidad en el home: `apertura` y `descripcion`. */
export function tarjetaDe(slug: string) {
  const tarjeta = BUSINESS_UNITS.find((u) => u.slug === slug);
  if (!tarjeta) throw new Error(`No hay tarjeta de unidad "${slug}" en el home`);
  return tarjeta;
}
