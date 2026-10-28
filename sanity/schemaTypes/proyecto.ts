/**
 * Un proyecto: uno solo por desarrollo, y lo referencian su unidad y el carril
 * del home. Hoy los seis destacados del home son copias que ya divergieron de
 * las de las unidades (inventario §9.2); aquí hay una sola versión.
 *
 * Los 31 de hoy: 22 en operación (14 plazas, 6 industriales, 2 de vivienda) y
 * 9 próximos.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { UNIDADES, maximo } from "../reglas";
import { foto } from "./objetos";

/**
 * Los formatos que existen hoy. Es una lista cerrada porque es la chapa de la
 * tarjeta (en mayúsculas, máximo 30 caracteres en teléfono) y porque el código
 * la usa como primer dato de la ficha. Uno nuevo se agrega aquí.
 */
export const FORMATOS = [
  "Fashion Mall",
  "Strip Mall",
  "Power Center",
  "Parque industrial",
  "Infraestructura aeroportuaria",
  "Lotes residenciales",
];

export const proyecto = defineType({
  name: "proyecto",
  title: "Proyecto",
  type: "document",
  groups: [
    { name: "tarjeta", title: "Tarjeta", default: true },
    { name: "ficha", title: "Ficha" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      group: "tarjeta",
      description: "Como aparece en la tarjeta y en la ficha: «Paseo La Fe».",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "unidad",
      title: "Unidad de negocio",
      type: "string",
      group: "tarjeta",
      options: { list: [...UNIDADES], layout: "radio", direction: "horizontal" },
      description:
        "Decide en qué página puede aparecer. Sólo se puede elegir uno de los cuatro.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "estado",
      title: "Estado",
      type: "string",
      group: "tarjeta",
      options: {
        list: [
          { title: "En operación", value: "operacion" },
          { title: "En desarrollo", value: "desarrollo" },
          { title: "Próximo", value: "proximo" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      description:
        "«Próximo» lo pone en la sección Próximos proyectos de su unidad; los otros dos, en la lista de proyectos.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ubicacion",
      title: "Ubicación",
      type: "string",
      group: "tarjeta",
      description:
        "«Ciudad, Estado», con la coma: «Monterrey, Nuevo León». El sitio la pone en mayúsculas. Máximo 44 caracteres: más larga, se monta sobre la chapa de la tarjeta en teléfono. En Comercial, el sitio cuenta los estados a partir de lo que va después de la coma.",
      validation: (rule) => [
        maximo(44, "se monta sobre la chapa de la tarjeta en teléfono")(rule),
        rule.custom((v: string | undefined, ctx) => {
          const proximo = (ctx.document as { estado?: string } | undefined)?.estado === "proximo";
          if (!v) return proximo ? true : "Falta la ubicación.";
          return /^[^,]+, [^,]+$/.test(v)
            ? true
            : "Escríbela como «Ciudad, Estado», con una sola coma y un espacio después.";
        }),
      ],
    }),
    defineField({
      name: "formato",
      title: "Formato",
      type: "string",
      group: "tarjeta",
      options: { list: FORMATOS },
      description:
        "La chapa de arriba a la izquierda de la tarjeta, y el primer dato de la ficha. Los próximos no la llevan. Si hace falta uno que no está, se agrega en el código.",
      hidden: ({ document }) => document?.estado === "proximo",
      validation: (rule) =>
        rule.custom((v, ctx) =>
          (ctx.document as { estado?: string } | undefined)?.estado === "proximo" || v
            ? true
            : "Elige el formato: es la chapa de la tarjeta.",
        ),
    }),
    foto({
      name: "foto",
      title: "Foto",
      ancho: "tarjeta",
      group: "tarjeta",
      donde: "en la tarjeta del carrusel",
      description:
        "La misma foto va en la tarjeta (recortada en vertical) y en la ficha (entera).",
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 6,
      group: "ficha",
      description:
        "El párrafo de la ficha que se abre al pulsar la tarjeta. Sin límite: la ficha hace scroll. Un salto de línea se respeta.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "datos",
      title: "Datos",
      type: "array",
      group: "ficha",
      description:
        "Los pares de la ficha, después del formato y la ubicación: «Visitantes · +300 mil al mes», «Área total · 107,374 m²».",
      of: [
        defineArrayMember({
          type: "object",
          name: "dato",
          fields: [
            defineField({ name: "etiqueta", title: "Etiqueta", type: "string", validation: (r) => r.required() }),
            defineField({ name: "valor", title: "Valor", type: "string", description: "Vacío, la ficha pinta un guion." }),
          ],
          preview: { select: { title: "etiqueta", subtitle: "valor" } },
        }),
      ],
      validation: (rule) =>
        rule.custom((lista: { etiqueta?: string }[] | undefined) => {
          const vistas = new Set<string>();
          for (const d of lista ?? []) {
            const k = (d.etiqueta ?? "").trim().toLowerCase();
            if (vistas.has(k)) return `La etiqueta «${d.etiqueta}» está repetida.`;
            vistas.add(k);
          }
          return true;
        }),
    }),
    defineField({
      name: "etiquetaUnidad",
      title: "Texto de «Unidad» en la ficha",
      type: "string",
      group: "ficha",
      description:
        "Sólo si no es el nombre de la unidad: p. ej. «Ampliación comercial». Vacío, dice la unidad.",
      hidden: ({ document }) => document?.estado !== "proximo",
    }),
    defineField({
      name: "sitio",
      title: "Sitio web del proyecto",
      type: "url",
      group: "ficha",
      description: "Opcional. Si lo hay, la ficha muestra el botón «Visitar sitio web».",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
  ],
  orderings: [
    { title: "Nombre", name: "nombre", by: [{ field: "nombre", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", unidad: "unidad", estado: "estado", ubicacion: "ubicacion", media: "foto" },
    prepare: ({ title, unidad, estado, ubicacion, media }) => ({
      title: title || "Proyecto sin nombre",
      subtitle: [
        UNIDADES.find((u) => u.value === unidad)?.title,
        estado === "proximo" ? "Próximo" : estado === "desarrollo" ? "En desarrollo" : "En operación",
        ubicacion,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
