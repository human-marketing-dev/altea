/**
 * Las cuatro unidades de negocio: un documento único cada una (ids
 * `unidad-comercial`, `unidad-industrial`, `unidad-vivienda`, `unidad-forestal`).
 * El mismo esquema para las cuatro; las secciones que sólo tiene una unidad se
 * esconden en las otras.
 *
 * NO están aquí, a propósito (inventario §10): el nombre de la unidad, su
 * color, la palabra del hero y su animación, la banderola, la foto recortada del
 * cierre, el orden de las secciones y los logos de Forestal y del muro de
 * marcas. Son diseño o lógica y viven en el código.
 */
import { defineArrayMember, defineField, defineType, type ArrayRule } from "sanity";
import { UNIDADES, anchoMinimo, cantidad, claveDeUnidad, maximo, textoDeAncho } from "../reglas";
import { cifra, foto } from "./objetos";

/** Las opciones de icono: los diez dibujados en `app/_unidad/Atributos.tsx`. */
export const ICONOS = [
  { title: "Ubicación", value: "ubicacion" },
  { title: "Sustentabilidad", value: "sustentabilidad" },
  { title: "Infraestructura", value: "infraestructura" },
  { title: "Jardinería", value: "jardineria" },
  { title: "Reforestación", value: "reforestacion" },
  { title: "Mantenimiento", value: "mantenimiento" },
  { title: "Mobiliario", value: "mobiliario" },
  { title: "Construcción", value: "construccion" },
  { title: "Hotelería", value: "hoteleria" },
  { title: "Embarcaciones", value: "embarcaciones" },
];

export const cifraUnidad = cifra({
  name: "cifraUnidad",
  maxCifra: 10,
  motivoCifra: "en teléfono la fila de cifras salta a otro renglón",
  maxEtiqueta: 23,
  motivoEtiqueta: "en teléfono la fila de cifras salta a otro renglón",
});

const soloEn =
  (...claves: string[]) =>
  ({ document }: { document?: { _id?: string } }) =>
    !claves.includes(claveDeUnidad(document?._id));

/** Cuenta con mensaje; `porUnidad` aplica un rango distinto a cada unidad: el que conserva la maqueta de hoy. */
function contar(lista: unknown[] | undefined, min: number, max: number, motivo: string) {
  const n = lista?.length ?? 0;
  if (n >= min && n <= max) return true;
  const rango = min === max ? `exactamente ${min}` : `entre ${min} y ${max}`;
  return `Hay ${n} y tienen que ser ${rango}: ${motivo}.`;
}
const porUnidad =
  (rangos: Record<string, [number, number, string]>) => (rule: ArrayRule<unknown[]>) =>
    rule.custom((lista: unknown[] | undefined, ctx) => {
      const r = rangos[claveDeUnidad((ctx.document as { _id?: string } | undefined)?._id)];
      return r ? contar(lista, ...r) : true;
    });

const refsDeLaUnidad = (proximos: boolean) => ({
  type: "reference" as const,
  to: [{ type: "proyecto" }],
  options: {
    disableNew: true,
    filter: ({ document }: { document: { _id?: string } }) => ({
      filter: proximos
        ? 'unidad == $u && estado == "proximo"'
        : 'unidad == $u && estado != "proximo"',
      params: { u: claveDeUnidad(document._id) },
    }),
  },
});

/** Una línea de negocio de Forestal: la estructura, el logo y el lado de la foto van en el código. */
const lineaForestal = (name: string, title: string, lista: string, nItems: [number, number]) =>
  defineField({
    name,
    title,
    type: "object",
    group: "lineas",
    hidden: soloEn("forestal"),
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: "rotulo",
        title: "Rótulo",
        type: "string",
        description: "La línea pequeña sobre el logo, p. ej. «Plantación forestal comercial». Opcional.",
      }),
      defineField({
        name: "parrafos",
        title: "Párrafos",
        type: "array",
        of: [defineArrayMember({ type: "text", rows: 4 })],
        description: "Uno o dos párrafos junto a la foto.",
        validation: (rule) => cantidad(1, 3, "es el texto junto a la foto")(rule),
      }),
      defineField({
        name: "fotos",
        title: "Fotos",
        type: "array",
        description: `Con una, va fija; con dos o más, se vuelve un carrusel en la misma caja. ${textoDeAncho("lineaForestal")}`,
        of: [
          defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
              defineField({
                name: "alt",
                title: "Descripción de la foto",
                type: "string",
                validation: (r) => r.required().error("Describe la foto."),
              }),
            ],
            validation: (r) => anchoMinimo("lineaForestal", "la caja de la línea")(r),
          }),
        ],
        // Decidido, no medido: la maqueta no cambia en este número.
        validation: (rule) => cantidad(1, 5, "es la caja de la foto de la línea")(rule),
      }),
      defineField({
        name: "listaTitulo",
        title: `Título de la lista (hoy «${lista}»)`,
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "listaItems",
        title: "Elementos de la lista",
        type: "array",
        description:
          "Icono y título. Con 3 van en tres columnas; con 4, en cuatro. El icono se elige de los dibujados para el sitio.",
        of: [
          defineArrayMember({
            type: "object",
            name: "itemLista",
            fields: [
              defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
              defineField({
                name: "icono",
                title: "Icono",
                type: "string",
                options: { list: ICONOS },
                validation: (r) => r.required(),
              }),
            ],
            preview: { select: { title: "titulo", subtitle: "icono" } },
          }),
        ],
        validation: (rule) =>
          cantidad(nItems[0], nItems[1], "la lista está diseñada en tres o cuatro columnas")(rule),
      }),
    ],
  });

export const unidad = defineType({
  name: "unidad",
  title: "Unidad de negocio",
  type: "document",
  groups: [
    { name: "carpeta", title: "Carpeta del home", default: true },
    { name: "hero", title: "Hero" },
    { name: "proyectos", title: "Proyectos" },
    { name: "proximos", title: "Próximos" },
    { name: "giros", title: "Otros giros" },
    { name: "atributos", title: "Por qué Altea" },
    { name: "lineas", title: "Líneas de negocio" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    /* ── Carpeta del home ── */
    defineField({
      name: "frase",
      title: "Frase de apertura",
      type: "string",
      group: "carpeta",
      description:
        "La frase grande de la carpeta en el home: «Activamos la energía de la ciudad.». Máximo 60 caracteres, y junto con la descripción no más de 233: más larga, la carpeta crece, deja de medir lo mismo que las otras tres y la pila del home se desordena al hacer scroll.",
      validation: (rule) => [
        rule.required(),
        maximo(60, "la carpeta crece y la pila del home se desordena")(rule),
      ],
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 4,
      group: "carpeta",
      description:
        "Va en la carpeta del home y es también la descripción de la página para Google. Máximo 170 caracteres, y junto con la frase no más de 233: más larga, la carpeta crece y la pila del home se desordena.",
      validation: (rule) => [
        rule.required(),
        maximo(170, "la carpeta crece y la pila del home se desordena")(rule),
        rule.custom((v: string | undefined, ctx) => {
          const frase = (ctx.document as { frase?: string } | undefined)?.frase ?? "";
          const total = frase.length + (v?.length ?? 0);
          return total <= 233
            ? true
            : `Frase y descripción suman ${total} caracteres y el máximo juntas es 233: comparten la caja de la carpeta y, más largas, la carpeta crece y la pila del home se desordena.`;
        }),
      ],
    }),
    foto({
      name: "fotoCarpeta",
      title: "Foto de la carpeta",
      ancho: "carpeta",
      group: "carpeta",
      donde: "la carpeta del home",
      altObligatorio: true,
    }),

    /* ── Hero ── */
    defineField({
      name: "fotosHero",
      title: "Fotos del hero",
      type: "array",
      group: "hero",
      description: `Las que se ven dentro de la palabra y, al bajar, a pantalla completa. Se turnan cada 4.2 segundos en este orden; la primera es la que carga primero. ${textoDeAncho("hero")} Hasta 8.`,
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          description: "El punto focal decide qué parte de la foto queda dentro de las letras.",
          validation: (r) => anchoMinimo("hero", "el hero")(r),
        }),
      ],
      // Decidido, no medido (26 oct 2026): con más fotos crece el peso y lo que hay
      // que administrar; la maqueta aceptaría más.
      validation: (rule) => cantidad(1, 8, "más fotos son más peso y más que administrar")(rule),
    }),
    defineField({
      name: "cifras",
      title: "Cifras",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "cifraUnidad" })],
      description:
        "Debajo de la palabra. Cada cifra: máximo 10 caracteres contando el + y el signo, y su etiqueta máximo 23. Más largas, en teléfono la fila salta a otro renglón.",
      validation: (rule) => cantidad(2, 3, "el hero está diseñado para dos o tres cifras")(rule),
    }),

    /* ── Proyectos ── */
    defineField({
      name: "tituloProyectos",
      title: "Título de la sección",
      type: "string",
      group: "proyectos",
      hidden: soloEn("comercial", "industrial", "vivienda"),
      description: "«Nuestros centros comerciales». Máximo 35 caracteres: más largo, agrega un renglón en teléfono.",
      validation: (rule) => maximo(35, "agrega un renglón en teléfono")(rule),
    }),
    defineField({
      name: "proyectos",
      title: "Proyectos, en orden",
      type: "array",
      group: "proyectos",
      hidden: soloEn("comercial", "industrial", "vivienda"),
      of: [defineArrayMember(refsDeLaUnidad(false))],
      description:
        "Los proyectos de esta unidad, en el orden del carrusel. Sólo se pueden elegir los de esta unidad y no los próximos. La cantidad cambia la maqueta: ver el mensaje si te pasas.",
      validation: (rule) => [
        rule.unique().error("Un proyecto está dos veces."),
        porUnidad({
          comercial: [3, 20, "con menos de 3 la sección deja de ser carrusel y pasa a rejilla de tarjetas apaisadas"],
          industrial: [3, 20, "con menos de 3 la sección deja de ser carrusel y pasa a rejilla de tarjetas apaisadas"],
          vivienda: [1, 2, "la sección es una rejilla de dos tarjetas; con 3 o más se vuelve carrusel"],
        })(rule),
      ],
    }),

    /* ── Próximos ── */
    defineField({
      name: "tituloProximos",
      title: "Título de la sección",
      type: "string",
      group: "proximos",
      hidden: soloEn("comercial", "industrial", "vivienda"),
      description: "Hoy «Próximos proyectos». Máximo 26 caracteres: más largo, agrega un renglón en escritorio.",
      validation: (rule) => maximo(26, "agrega un renglón en escritorio")(rule),
    }),
    defineField({
      name: "proximos",
      title: "Próximos proyectos, en orden",
      type: "array",
      group: "proximos",
      hidden: soloEn("comercial", "industrial", "vivienda"),
      of: [defineArrayMember(refsDeLaUnidad(true))],
      description:
        "Sólo los de esta unidad marcados como «Próximo». La cantidad cambia la maqueta.",
      validation: (rule) => [
        rule.unique().error("Un proyecto está dos veces."),
        porUnidad({
          comercial: [1, 3, "hasta 3 van en rejilla; con 4 o más la sección se vuelve carrusel"],
          industrial: [1, 3, "hasta 3 van en rejilla; con 4 o más la sección se vuelve carrusel"],
          vivienda: [4, 20, "la sección es un carrusel; con 3 o menos pasa a rejilla"],
        })(rule),
      ],
    }),

    /* ── Otros giros (Comercial) ── */
    defineField({
      name: "girosRotulo",
      title: "Rótulo",
      type: "string",
      group: "giros",
      hidden: soloEn("comercial"),
      description: "La línea pequeña sobre el título: «Otros giros».",
    }),
    defineField({
      name: "girosTitulo",
      title: "Título",
      type: "string",
      group: "giros",
      hidden: soloEn("comercial"),
      description: "Máximo 65 caracteres: más largo, agrega un renglón en teléfono.",
      validation: (rule) => maximo(65, "agrega un renglón en teléfono")(rule),
    }),
    defineField({
      name: "giros",
      title: "Paneles, en orden",
      type: "array",
      group: "giros",
      hidden: soloEn("comercial"),
      of: [defineArrayMember({ type: "reference", to: [{ type: "giro" }], options: { disableNew: true } })],
      description: "El número grande de cada panel («01», «02») sale del orden.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (rule) => [
        rule.unique(),
        rule.custom((l: unknown[] | undefined, ctx) =>
          claveDeUnidad((ctx.document as { _id?: string } | undefined)?._id) === "comercial"
            ? contar(l, 2, 3, "los paneles comparten una fila; con 4 se aprietan")
            : true,
        ),
      ],
    }),
    defineField({
      name: "marcasTitulo",
      title: "Título del muro de marcas",
      type: "string",
      group: "giros",
      hidden: soloEn("comercial"),
      description:
        "«Marcas que operan en nuestros centros». Los logos y si el muro se muestra se deciden en el código (requiere permiso de las marcas).",
    }),

    /* ── Por qué Altea (Industrial) ── */
    defineField({
      name: "atributos",
      title: "Atributos",
      type: "array",
      group: "atributos",
      hidden: soloEn("industrial"),
      of: [
        defineArrayMember({
          type: "object",
          name: "atributo",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
            defineField({ name: "icono", title: "Icono", type: "string", options: { list: ICONOS }, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titulo", subtitle: "icono" } },
        }),
      ],
      description: "Icono y título, en tres columnas.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (rule) =>
        rule.custom((l: unknown[] | undefined, ctx) =>
          claveDeUnidad((ctx.document as { _id?: string } | undefined)?._id) === "industrial"
            ? contar(l, 3, 3, "la sección está diseñada en tres columnas")
            : true,
        ),
    }),

    /* ── Líneas de negocio (Forestal) ── */
    lineaForestal("viveros", "Viveros Asturias", "Servicios", [3, 4]),
    lineaForestal("teca", "Teca San Miguel", "Aplicaciones", [3, 4]),

    /* ── Buscadores ── */
    defineField({
      name: "metaTitulo",
      title: "Título en Google y en la pestaña",
      type: "string",
      group: "seo",
      description: "Hoy «Comercial — Altea». La descripción para Google es la de la carpeta.",
      validation: (rule) => rule.required(),
    }),
  ],
  /* La unidad la da el id del documento (`unidad-comercial`): no es un campo. */
  preview: {
    select: { id: "_id", media: "fotoCarpeta" },
    prepare: ({ id, media }) => ({
      title: UNIDADES.find((u) => u.value === claveDeUnidad(id))?.title ?? "Unidad",
      media,
    }),
  },
});
