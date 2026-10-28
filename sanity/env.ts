/**
 * Conexión al proyecto de Sanity. Los valores van en .env.local (y en el
 * hosting): no son secretos —el ID del proyecto viaja al navegador con el
 * Studio—, pero así no quedan atados al repositorio.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
/** Fecha de la API: fija, para que una versión nueva de Sanity no cambie respuestas. */
export const apiVersion = "2026-10-01";
