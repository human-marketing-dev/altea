/**
 * Una tarjeta de «Otros giros» en Comercial: hoteles, hospital, educación. Es la
 * misma tarjeta y la misma ficha que las plazas (desde el 29 oct 2026): foto,
 * título, el primer dato como pie, y al pulsar, la ficha con los datos y la
 * descripción.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { bi } from "../bilingue";
import { foto } from "./objetos";

export const giro = defineType({
  name: "giro",
  title: "Giro",
  type: "document",
  fields: [
    bi({
      name: "titulo",
      title: "Título",
      type: "string",
      requerido: true,
      description: "El título de la tarjeta: «Hoteles».",
    }),
    bi({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 4,
      description: "El párrafo de la ficha que se abre al pulsar la tarjeta.",
    }),
    foto({
      name: "imagen",
      title: "Foto",
      ancho: "giro",
      donde: "la tarjeta",
      altObligatorio: true,
    }),
    defineField({
      name: "datos",
      title: "Datos",
      type: "array",
      description:
        "Los pares de la ficha: «Marcas · Fiesta Inn, One Hotels y NH Hotels». El primero también va de pie en la tarjeta.",
      of: [
        defineArrayMember({
          type: "object",
          name: "datoGiro",
          fields: [
            bi({ name: "etiqueta", title: "Etiqueta", type: "string", requerido: true }),
            bi({ name: "valor", title: "Valor", type: "string", requerido: true }),
          ],
          preview: { select: { title: "etiqueta.es", subtitle: "valor.es" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "titulo.es", subtitle: "descripcion.es", media: "imagen" } },
});
