/**
 * El Studio de Sanity, montado en /studio (app/studio/[[...tool]]/page.tsx).
 *
 * Sin vista previa de borradores ni edición en vivo, a propósito: se publica y
 * se ve. El sitio todavía NO lee de aquí: sigue leyendo los .ts de hoy hasta
 * que se migre el contenido.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { estructura } from "./sanity/estructura";
import { TIPOS_UNICOS, UNICOS, schemaTypes } from "./sanity/schemaTypes";

const IDS_UNICOS = new Set(UNICOS.map((u) => u.id));

export default defineConfig({
  name: "altea",
  title: "Altea",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure: estructura })],
  schema: {
    types: schemaTypes,
    /*
     * Desde el botón «Crear» sólo se pueden crear proyectos y giros. Los únicos
     * se abren desde la navegación; la plantilla extra arranca un proyecto con
     * la unidad ya elegida cuando se crea desde la lista de una unidad.
     */
    templates: (anteriores) => [
      ...anteriores.filter((t) => !TIPOS_UNICOS.has(t.schemaType)),
      {
        id: "proyecto-de-unidad",
        title: "Proyecto de la unidad",
        schemaType: "proyecto",
        parameters: [{ name: "unidad", type: "string" }],
        value: (p: { unidad?: string }) => ({ unidad: p.unidad, estado: "operacion" }),
      },
    ],
  },
  document: {
    /* Un documento único no se duplica, ni se borra, ni se despublica. */
    actions: (anteriores, contexto) =>
      IDS_UNICOS.has(contexto.documentId ?? "")
        ? anteriores.filter((a) => !["duplicate", "delete", "unpublish"].includes(a.action ?? ""))
        : anteriores,
    newDocumentOptions: (anteriores, { creationContext }) =>
      creationContext.type === "global"
        ? anteriores.filter((o) => ["proyecto", "giro"].includes(o.templateId))
        : anteriores,
  },
});
