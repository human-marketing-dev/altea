/**
 * Un panel de «Otros giros» en Comercial: hoteles, hospital, educación. El
 * número grande del panel («01») sale de su posición en la lista de la unidad;
 * no se escribe.
 */
import { defineField, defineType } from "sanity";
import { foto } from "./objetos";

export const giro = defineType({
  name: "giro",
  title: "Giro",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description: "El título del panel: «Hoteles».",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 4,
      description: "El texto que aparece al pasar el cursor por el panel.",
    }),
    foto({
      name: "imagen",
      title: "Foto",
      ancho: "giro",
      donde: "el panel",
      altObligatorio: true,
    }),
  ],
  preview: { select: { title: "titulo", subtitle: "descripcion", media: "imagen" } },
});
