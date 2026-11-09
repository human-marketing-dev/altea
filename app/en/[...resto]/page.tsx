import { notFound } from "next/navigation";

/**
 * Cualquier URL bajo /en que no es una página. Sin este comodín, Next no entra
 * en el segmento /en y sirve la 404 de la raíz, que está en español; con él,
 * `notFound()` cae en app/en/not-found.tsx. Las páginas reales de /en tienen
 * prioridad sobre el comodín.
 *
 * La pestaña dice «Altea», el título del layout raíz, y no «404 — Altea» como
 * en español: el título de un not-found anidado no se aplica, ni desde su
 * `metadata`, ni desde el de esta página, ni con un <title> de React (los tres
 * probados en el build).
 */
export default function RestoEn() {
  notFound();
}
