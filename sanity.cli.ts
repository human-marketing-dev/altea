/**
 * Configuración de la línea de comandos de Sanity (`npx sanity …`): validar y
 * extraer el esquema, generar tipos, administrar el dataset. Lee el mismo
 * proyecto y dataset que el Studio (sanity/env.ts).
 *
 * No se usa `sanity deploy`: el Studio vive dentro del sitio, en /studio.
 */
import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
});
