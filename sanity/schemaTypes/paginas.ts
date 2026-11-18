/**
 * Los documentos únicos: uno de cada uno, que no se crea ni se borra desde el
 * Studio (ver sanity.config.ts). Campos fijos por sección: las maquetas están
 * diseñadas, no se arman con bloques.
 *
 * BILINGÜES (noviembre de 2026): cada texto lleva su casilla en español y en
 * inglés, con `bi()` (ver sanity/bilingue.ts). Fotos, números y enlaces van una
 * sola vez. Los legales son un documento por idioma.
 */
import { defineArrayMember, defineField, defineType, type Rule } from "sanity";
import { ESTADOS_MX } from "./estados";
import { anchoMinimo, cantidad, maximo, textoDeAncho } from "../reglas";
import { IDIOMAS, bi, segunIdioma, type Idioma } from "../bilingue";
import { altBilingue, cifra, foto, lineasTitular } from "./objetos";

/** Un límite de caracteres: error en español, aviso en inglés. */
const max = (n: number, motivo: string) => (r: Rule, i: Idioma) =>
  segunIdioma(maximo(n, motivo)(r), i);

/** Párrafos en los dos idiomas, con un rango de cantidad. */
const parrafos = (o: { name: string; title: string; group?: string; min: number; maxN: number; motivo: string; description?: string }) =>
  bi({
    name: o.name,
    title: o.title,
    group: o.group,
    type: "array",
    of: [{ type: "text", rows: 4 }],
    description: o.description,
    reglas: (r) => cantidad(o.min, o.maxN, o.motivo)(r),
  });

/** Un objeto de una lista con su texto en los dos idiomas (pilares, pies…). */
const textoDeLista = (name: string, title: string, maxN?: number, motivo?: string) =>
  defineArrayMember({
    type: "object",
    name,
    title,
    options: { columns: 2 },
    fields: IDIOMAS.map(({ id, titulo }) =>
      defineField({
        name: id,
        title: titulo,
        type: "string",
        validation: (r) => [
          r.required(),
          ...(maxN ? [segunIdioma(maximo(maxN, motivo ?? "")(r as unknown as Rule), id)] : []),
        ],
      }),
    ),
    preview: { select: { title: "es", subtitle: "en" } },
  });

/** Una foto de una lista, con su descripción en los dos idiomas. */
const fotoDeLista = (ancho: Parameters<typeof anchoMinimo>[0], donde: string) =>
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [altBilingue(true)],
    validation: (r) => anchoMinimo(ancho, donde)(r),
  });

/* ── Ajustes del sitio ────────────────────────────────────────────────── */

export const ajustesSitio = defineType({
  name: "ajustesSitio",
  title: "Datos de contacto y del sitio",
  type: "document",
  groups: [
    { name: "contacto", title: "Contacto", default: true },
    { name: "redes", title: "Redes" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "correo",
      title: "Correo",
      type: "string",
      group: "contacto",
      description: "Sale en el pie, en el cierre de cada página y en Contacto.",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
      group: "contacto",
      description: "Como se lee: «+52 81 1772 7272». El enlace para marcar se arma solo.",
      validation: (r) =>
        r.required().regex(/^\+?[\d ]{8,20}$/, { name: "teléfono", invert: false }),
    }),
    defineField({
      name: "whatsapp",
      title: "Número de WhatsApp",
      type: "string",
      group: "contacto",
      description:
        "OJO: es distinto del teléfono. Sólo dígitos, con lada de país y sin espacios ni «+»: 528135512000.",
      validation: (r) =>
        r.required().regex(/^\d{10,15}$/, { name: "sólo dígitos" }),
    }),
    bi({
      name: "whatsappMensaje",
      title: "Mensaje inicial de WhatsApp",
      type: "string",
      group: "contacto",
      requerido: true,
      description: "El texto que aparece ya escrito cuando alguien abre el chat, en el idioma de la página.",
    }),
    defineField({
      name: "domicilio",
      title: "Domicilio",
      type: "string",
      group: "contacto",
      description:
        "En una línea: «Paricutín 390, Colonia Roma, Monterrey, N.L.». Es el mismo en los dos idiomas. Los textos legales llevan el suyo aparte y no cambian con éste.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mapa",
      title: "Enlace del domicilio en Google Maps",
      type: "url",
      group: "contacto",
      description: "Lo que abre el domicilio al pulsarlo.",
    }),
    defineField({ name: "facebook", title: "Facebook", type: "url", group: "redes" }),
    defineField({ name: "instagram", title: "Instagram", type: "url", group: "redes" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url", group: "redes" }),
    bi({
      name: "metaTitulo",
      title: "Título del home en Google",
      type: "string",
      group: "seo",
      requerido: true,
      description: "Hoy «Altea Desarrollos — Comercial, industrial, vivienda y forestal».",
    }),
    bi({
      name: "metaDescripcion",
      title: "Descripción del home en Google",
      type: "text",
      rows: 3,
      group: "seo",
      requerido: true,
    }),
  ],
  preview: { prepare: () => ({ title: "Datos de contacto y del sitio" }) },
});

/* ── Cierre (el «Trabajemos juntos» del final del home y de Nosotros) ─── */

export const cierre = defineType({
  name: "cierre",
  title: "Cierre de las páginas",
  type: "document",
  description:
    "Va al final del home y de Nosotros. Las cuatro unidades llevan el suyo, en cada Unidad.",
  fields: [
    bi({
      name: "rotulo",
      title: "Rótulo",
      type: "string",
      requerido: true,
      description: "La línea pequeña: «Trabajemos juntos». El sitio la pone en mayúsculas.",
    }),
    bi({
      name: "titulo",
      title: "Título",
      type: "string",
      requerido: true,
      description: "Máximo 59 caracteres: más largo, agrega un renglón en teléfono.",
      reglas: max(59, "agrega un renglón en teléfono"),
    }),
  ],
  preview: { prepare: () => ({ title: "Cierre de las páginas" }) },
});

/* ── Inicio ───────────────────────────────────────────────────────────── */

export const lineasHome1 = lineasTitular({
  name: "lineaHome1",
  marca: "atenuado",
  max: 18,
  motivo: "en teléfono el titular agrega un renglón",
});
export const lineasHome2 = lineasTitular({
  name: "lineaHome2",
  marca: "atenuado",
  max: 24,
  motivo: "en escritorio el titular agrega un renglón",
});

export const cifraHome = cifra({
  name: "cifraHome",
  maxCifra: 13,
  motivoCifra: "en teléfono la fila de cifras salta a otro renglón",
  maxEtiqueta: 30,
  motivoEtiqueta: "en teléfono la fila de cifras salta a otro renglón",
  conNota: true,
});

export const paginaInicio = defineType({
  name: "paginaInicio",
  title: "Inicio",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "cifras", title: "Cifras" },
    { name: "video", title: "Video" },
    { name: "unidades", title: "Unidades" },
    { name: "proyectos", title: "Proyectos destacados" },
  ],
  fields: [
    bi({
      name: "titularLinea1",
      title: "Titular, primera línea",
      type: "lineaHome1",
      tipoPorIdioma: { es: "lineaHome1", en: "lineaHome1En" },
      group: "hero",
      description:
        "Hoy «Creando proyectos». Máximo 18 caracteres: más larga, en teléfono el titular agrega un renglón. Para atenuar palabras (en gris), selecciónalas y usa el botón «Atenuado».",
    }),
    bi({
      name: "titularLinea2",
      title: "Titular, segunda línea",
      type: "lineaHome2",
      tipoPorIdioma: { es: "lineaHome2", en: "lineaHome2En" },
      group: "hero",
      description:
        "Hoy «que materializan sueños», con «que» atenuado. Máximo 24 caracteres: más larga, en escritorio el titular agrega un renglón.",
    }),
    bi({
      name: "frase",
      title: "Frase de entrada",
      type: "text",
      rows: 2,
      group: "cifras",
      requerido: true,
      description:
        "La frase que se enciende palabra por palabra sobre las cifras. Máximo 179 caracteres: más larga, agrega un renglón en teléfono.",
      reglas: max(179, "agrega un renglón en teléfono"),
    }),
    defineField({
      name: "cifras",
      title: "Cifras",
      type: "array",
      group: "cifras",
      of: [defineArrayMember({ type: "cifraHome" })],
      description:
        "Cada cifra: máximo 13 caracteres contando el + y el signo; inicio y etiqueta, juntos, máximo 30. Más largas, en teléfono la fila salta de renglón.",
      validation: (r) => cantidad(3, 3, "la fila está diseñada para tres")(r),
    }),
    defineField({
      name: "youtube",
      title: "Video de YouTube",
      type: "string",
      group: "video",
      description:
        "El identificador del video: lo que va después de «watch?v=» en su dirección. Hoy «SfvgCPTsXpw». Vacío, la sección no se muestra.",
      validation: (r) => r.regex(/^[A-Za-z0-9_-]{11}$/, { name: "identificador de YouTube" }),
    }),
    bi({
      name: "videoTitulo",
      title: "Nombre del video",
      type: "string",
      group: "video",
      requerido: true,
      description: "No se ve: lo anuncia el lector de pantalla al llegar al video. «Video institucional de Altea».",
    }),
    bi({
      name: "videoDescripcion",
      title: "Descripción del video",
      type: "string",
      group: "video",
      description: "No se ve: la leen los lectores de pantalla. «Video corporativo».",
    }),
    bi({
      name: "tituloUnidades",
      title: "Título de la sección de unidades",
      type: "string",
      group: "unidades",
      requerido: true,
      description:
        "Hoy «Unidades de negocio». Máximo 69 caracteres: más largo, agrega un renglón en teléfono y la cabecera fija de las carpetas crece. El texto y la foto de cada carpeta se editan en cada Unidad.",
      reglas: max(69, "agrega un renglón en teléfono"),
    }),
    bi({
      name: "descripcionUnidades",
      title: "Texto de la sección de unidades",
      type: "text",
      rows: 2,
      group: "unidades",
      requerido: true,
      description: "Bajo el título: «Una visión integral, múltiples formas de transformar el territorio.».",
    }),
    bi({
      name: "tituloProyectos",
      title: "Título del carril de proyectos",
      type: "string",
      group: "proyectos",
      requerido: true,
      description: "Máximo 37 caracteres: más largo, agrega un renglón en teléfono. Un salto de línea (Shift + Enter) parte el título en dos renglones donde va: hoy «Nuestros proyectos» / «más relevantes».",
      reglas: max(37, "agrega un renglón en teléfono"),
    }),
    defineField({
      name: "proyectosDestacados",
      title: "Proyectos destacados, en orden",
      type: "array",
      group: "proyectos",
      of: [
        defineArrayMember({
          type: "object",
          name: "destacado",
          title: "Proyecto destacado",
          fields: [
            defineField({
              name: "proyecto",
              title: "Proyecto",
              type: "reference",
              to: [{ type: "proyecto" }],
              options: { disableNew: true },
              validation: (r) => r.required(),
            }),
            /*
             * LO QUE EL HOME DICE DISTINTO (nov 2026). Hoy algunos proyectos se
             * presentan en el carril del home con otro texto que en su unidad
             * (Amarantha: descripción corta y «Zona Sur de Monterrey»). Para que
             * el sitio se vea igual, cada destacado puede llevar el suyo; vacío,
             * se usa el del proyecto.
             */
            bi({ name: "nombre", title: "Nombre en el home (sólo si cambia)", type: "string" }),
            bi({ name: "ubicacion", title: "Ubicación en el home (sólo si cambia)", type: "string" }),
            bi({ name: "descripcion", title: "Descripción en el home (sólo si cambia)", type: "text", rows: 4 }),
            defineField({
              name: "foto",
              title: "Foto en el home (sólo si cambia)",
              type: "image",
              options: { hotspot: true },
              fields: [altBilingue(false)],
              description: "Vacía, se usa la del proyecto.",
            }),
          ],
          preview: {
            select: { title: "proyecto.nombre.es", subtitle: "proyecto.ubicacion.es", media: "proyecto.foto" },
          },
        }),
      ],
      description:
        "Los del carril horizontal, en orden. Son los mismos proyectos de las unidades: si se edita uno, cambia en los dos lados, salvo lo que se escriba aquí para el home.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => [
        cantidad(3, 8, "es el recorrido del carril")(r),
        r.custom((l: { proyecto?: { _ref?: string } }[] | undefined) => {
          const vistos = new Set<string>();
          for (const d of l ?? []) {
            const ref = d.proyecto?._ref;
            if (ref && vistos.has(ref)) return "Un proyecto está dos veces.";
            if (ref) vistos.add(ref);
          }
          return true;
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Inicio" }) },
});

/* ── Nosotros ─────────────────────────────────────────────────────────── */

export const lineasNos1 = lineasTitular({ name: "lineaNos1", marca: "acento", max: 16, motivo: "el titular agrega un renglón en teléfono" });
export const lineasNos2 = lineasTitular({ name: "lineaNos2", marca: "acento", max: 20, motivo: "el titular agrega un renglón en teléfono" });
export const lineasNos3 = lineasTitular({ name: "lineaNos3", marca: "acento", max: 17, motivo: "el titular agrega un renglón en teléfono" });

export const cifraHuella = cifra({
  name: "cifraHuella",
  maxCifra: 15,
  motivoCifra: "en escritorio las dos cifras dejan de caber en una fila",
  maxEtiqueta: 87,
  motivoEtiqueta: "la fila de cifras salta a otro renglón en teléfono",
});

const linea = (n: 1 | 2 | 3, description: string) =>
  bi({
    name: `titularLinea${n}`,
    title: `Titular, línea ${n}`,
    type: `lineaNos${n}`,
    tipoPorIdioma: { es: `lineaNos${n}`, en: `lineaNos${n}En` },
    group: "hero",
    description,
  });

export const paginaNosotros = defineType({
  name: "paginaNosotros",
  title: "Nosotros",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "origen", title: "Historia" },
    { name: "pilares", title: "Pilares" },
    { name: "grupo", title: "Grupo Firmas" },
    { name: "huella", title: "Nuestra Huella" },
    { name: "rs", title: "Responsabilidad social" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    linea(1, "Hoy «Transformamos». Máximo 16."),
    linea(2, "Hoy «territorio en». Máximo 20."),
    linea(3, "Hoy «oportunidades», en coral: selecciónala y usa «Acento». Máximo 17. Más largas, el titular agrega un renglón en teléfono."),
    bi({
      name: "bajada",
      title: "Texto del hero",
      type: "text",
      rows: 3,
      group: "hero",
      requerido: true,
      description: "Máximo 160 caracteres: más largo, agrega un renglón en teléfono.",
      reglas: max(160, "agrega un renglón en teléfono"),
    }),

    bi({
      name: "origenTitulo",
      title: "Título de la historia",
      type: "string",
      group: "origen",
      requerido: true,
      description: "«¿Cómo inició Altea?». La frase grande («Más de 40 años…») es fija: se anima por palabra.",
    }),
    parrafos({ name: "origenParrafos", title: "Párrafos de la historia", group: "origen", min: 1, maxN: 3, motivo: "es la columna de texto junto a la foto" }),
    defineField({
      name: "origenFotos",
      title: "Fotos de la historia",
      type: "array",
      group: "origen",
      of: [fotoDeLista("origen", "la foto de la historia")],
      description: `Con dos o más, se vuelven un carrusel. ${textoDeAncho("origen")}`,
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(1, 4, "es la caja de la foto de la historia")(r),
    }),

    bi({
      name: "pilaresTitulo",
      title: "Título",
      type: "string",
      group: "pilares",
      requerido: true,
      description: "Máximo 47 caracteres: más largo, agrega un renglón.",
      reglas: max(47, "agrega un renglón"),
    }),
    defineField({
      name: "pilares",
      title: "Pilares",
      type: "array",
      group: "pilares",
      of: [textoDeLista("pilar", "Pilar", 49, "el pilar pasa a tres renglones o rompe la fila en teléfono")],
      description:
        "Los tres títulos, en orden. Los iconos están dibujados para cada uno y siguen ese orden: innovación, comunidades, trascendencia. Máximo 49 caracteres cada uno.",
      validation: (r) => cantidad(3, 3, "hay tres iconos, uno por pilar")(r),
    }),

    bi({
      name: "grupoTitulo",
      title: "Título",
      type: "string",
      group: "grupo",
      requerido: true,
      description: "Máximo 41 caracteres: más largo, agrega un renglón en teléfono. El organigrama y sus logos son fijos.",
      reglas: max(41, "agrega un renglón en teléfono"),
    }),
    bi({ name: "grupoIntro", title: "Texto", type: "text", rows: 4, group: "grupo", requerido: true }),
    defineField({
      name: "grupoPie",
      title: "Pie del organigrama",
      type: "array",
      group: "grupo",
      of: [textoDeLista("pieGrupo", "Texto")],
      description: "Los dos textos de abajo: «Seis sectores» · «Una sola visión de largo plazo».",
      validation: (r) => cantidad(2, 2, "van uno a cada lado")(r),
    }),

    bi({
      name: "huellaTitulo",
      title: "Título",
      type: "string",
      group: "huella",
      requerido: true,
      description: "Máximo 16 caracteres: más largo, pasa a dos renglones. El texto de abajo se escribe solo con los estados y países de «Presencia».",
      reglas: max(16, "pasa a dos renglones"),
    }),
    bi({ name: "huellaBoton", title: "Texto del botón", type: "string", group: "huella", requerido: true }),
    defineField({ name: "huellaBotonEnlace", title: "Enlace del botón", type: "url", group: "huella", description: "Hoy el video de YouTube." }),
    defineField({
      name: "huellaCifras",
      title: "Cifras",
      type: "array",
      group: "huella",
      of: [defineArrayMember({ type: "cifraHuella" })],
      description: "Cada cifra: máximo 15 caracteres contando el + y el signo. Hoy «+44,000,000 m²» tiene 14. En inglés el «+» va detrás de la cifra: el sitio lo cambia solo.",
      validation: (r) => cantidad(2, 2, "las dos cifras comparten una fila")(r),
    }),
    defineField({
      name: "huellaDesglose",
      title: "Desglose de la superficie",
      type: "array",
      group: "huella",
      of: [
        defineArrayMember({
          type: "object",
          name: "parte",
          fields: [
            bi({ name: "etiqueta", title: "Etiqueta", type: "string", requerido: true }),
            defineField({ name: "valor", title: "m²", type: "number", validation: (r) => r.required().min(0) }),
          ],
          preview: { select: { title: "etiqueta.es", subtitle: "valor" } },
        }),
      ],
      description: "Las barras debajo de las cifras: «Nuevo León · 24,000,000». La barra se calcula con la proporción.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(2, 5, "son las barras del reparto")(r),
    }),
    bi({ name: "mapaRotulo", title: "Mapa: rótulo", type: "string", group: "huella", description: "«Presencia»." }),
    bi({ name: "mapaPista", title: "Mapa: indicación con cursor", type: "string", group: "huella", description: "«Señala un estado para ver su superficie construida.»" }),
    bi({ name: "mapaPistaTactil", title: "Mapa: indicación en teléfono", type: "string", group: "huella", description: "«Toca un estado o elígelo de la lista.»" }),
    bi({ name: "mapaElegir", title: "Mapa: texto de la lista", type: "string", group: "huella", description: "«Elige un estado»." }),
    bi({ name: "mapaEtiquetaEstado", title: "Mapa: etiqueta del dato", type: "string", group: "huella", description: "«Superficie construida»." }),
    bi({ name: "mapaSinDato", title: "Mapa: estado sin dato", type: "string", group: "huella", description: "Lo que dice un estado sin superficie registrada." }),

    bi({ name: "rsRotulo", title: "Rótulo", type: "string", group: "rs", description: "La línea pequeña: «Compromiso»." }),
    bi({
      name: "rsTitulo",
      title: "Título",
      type: "string",
      group: "rs",
      requerido: true,
      description: "Máximo 37 caracteres: más largo, agrega un renglón.",
      reglas: max(37, "agrega un renglón"),
    }),
    bi({ name: "rsSubtitulo", title: "Subtítulo", type: "string", group: "rs" }),
    parrafos({ name: "rsParrafos", title: "Párrafos", group: "rs", min: 1, maxN: 3, motivo: "es la columna de texto" }),
    defineField({
      name: "rsGaleria",
      title: "Galería de comunidades",
      type: "array",
      group: "rs",
      of: [
        defineArrayMember({
          type: "object",
          name: "fotoGaleria",
          fields: [
            foto({ name: "imagen", title: "Foto", ancho: "galeria", donde: "la galería", altObligatorio: true }),
            bi({ name: "pie", title: "Pie de foto", type: "string", description: "Lo que se lee al pasar el cursor." }),
          ],
          preview: { select: { title: "pie.es", media: "imagen" } },
        }),
      ],
      description: "Seis fotos, en la rejilla diseñada para seis.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(6, 6, "la rejilla está diseñada para seis")(r),
    }),
    bi({
      name: "verdesTitulo",
      title: "Entornos verdes: título",
      type: "string",
      group: "rs",
      requerido: true,
      description: "El segundo bloque de Responsabilidad social: «Impulsamos la creación de entornos más verdes».",
    }),
    parrafos({ name: "verdesParrafos", title: "Entornos verdes: párrafos", group: "rs", min: 1, maxN: 3, motivo: "es la columna de texto" }),
    defineField({
      name: "verdesGaleria",
      title: "Entornos verdes: fotos",
      type: "array",
      group: "rs",
      of: [fotoDeLista("galeria", "la galería de entornos verdes")],
      description: "Cuatro fotos. La primera es la grande.",
      validation: (r) => cantidad(4, 4, "la rejilla está diseñada para cuatro")(r),
    }),

    bi({ name: "metaTitulo", title: "Título en Google", type: "string", group: "seo", requerido: true }),
    bi({
      name: "metaDescripcion",
      title: "Descripción en Google",
      type: "text",
      rows: 3,
      group: "seo",
      requerido: true,
      description: "Hoy repite a mano «21 estados…». Si cambian los estados en «Presencia», hay que cambiarla aquí también.",
    }),
  ],
  preview: { prepare: () => ({ title: "Nosotros" }) },
});

/* ── Presencia (el mapa y las cuentas de Nosotros) ────────────────────── */

export const presencia = defineType({
  name: "presencia",
  title: "Presencia",
  type: "document",
  description:
    "De aquí salen el mapa de /nosotros y las cuentas que se escriben solas («21 estados de México…»).",
  fields: [
    defineField({
      name: "estados",
      title: "Estados con presencia",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "estadoPresencia",
          fields: [
            defineField({ name: "estado", title: "Estado", type: "string", options: { list: ESTADOS_MX }, validation: (r) => r.required() }),
            defineField({ name: "m2", title: "m² construidos", type: "number", description: "Vacío si no hay superficie registrada.", validation: (r) => r.min(0) }),
          ],
          preview: { select: { title: "estado", subtitle: "m2" } },
        }),
      ],
      validation: (r) =>
        r.custom((l: { estado?: string }[] | undefined) => {
          const s = new Set<string>();
          for (const e of l ?? []) {
            if (e.estado && s.has(e.estado)) return `${e.estado} está dos veces.`;
            if (e.estado) s.add(e.estado);
          }
          return true;
        }),
    }),
    defineField({
      name: "paises",
      title: "Países fuera de México",
      type: "array",
      of: [textoDeLista("pais", "País")],
      description: "Hoy Estados Unidos, España y Costa Rica. En inglés, como se lee en la frase: «the United States».",
    }),
  ],
  preview: { prepare: () => ({ title: "Presencia" }) },
});

/* ── Contacto ─────────────────────────────────────────────────────────── */

export const paginaContacto = defineType({
  name: "paginaContacto",
  title: "Contacto",
  type: "document",
  fields: [
    bi({ name: "titulo", title: "Título", type: "string", requerido: true, description: "«Hablemos de tu proyecto»." }),
    bi({ name: "descripcion", title: "Texto", type: "text", rows: 3, requerido: true }),
    bi({ name: "textoWhatsapp", title: "Texto del enlace de WhatsApp", type: "string", description: "«Escríbenos por WhatsApp»." }),
    bi({ name: "exitoTitulo", title: "Mensaje al enviar: título", type: "string", description: "«Gracias, recibimos tu mensaje.»" }),
    bi({ name: "exitoTexto", title: "Mensaje al enviar: texto", type: "string" }),
    bi({ name: "metaTitulo", title: "Título en Google", type: "string", requerido: true }),
    bi({ name: "metaDescripcion", title: "Descripción en Google", type: "text", rows: 3, requerido: true }),
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});

/* ── Documentos legales: uno por documento y por idioma ───────────────── */

/**
 * Cuatro documentos: aviso y términos, en español y en inglés (ids
 * `legal-aviso`, `legal-aviso-en`, `legal-terminos`, `legal-terminos-en`). Un
 * documento por idioma y no casillas lado a lado: son textos largos con sus
 * propias secciones, y la versión en inglés lleva la nota de que vale la
 * española.
 */
export const documentoLegal = defineType({
  name: "documentoLegal",
  title: "Documento legal",
  type: "document",
  fields: [
    defineField({
      name: "idioma",
      title: "Idioma",
      type: "string",
      readOnly: true,
      options: { list: IDIOMAS.map(({ id, titulo }) => ({ value: id, title: titulo })) },
    }),
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "bajada", title: "Texto bajo el título", type: "text", rows: 2 }),
    defineField({ name: "intro", title: "Introducción", type: "textoLegal" }),
    defineField({
      name: "secciones",
      title: "Secciones",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "seccionLegal",
          fields: [
            defineField({ name: "titulo", title: "Título de la sección", type: "string", validation: (r) => r.required() }),
            defineField({ name: "cuerpo", title: "Texto", type: "textoLegal", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titulo" } },
        }),
      ],
      validation: (r) =>
        r.min(1).custom((l: { titulo?: string }[] | undefined) => {
          const s = new Set<string>();
          for (const x of l ?? []) {
            if (x.titulo && s.has(x.titulo)) return `La sección «${x.titulo}» está repetida.`;
            if (x.titulo) s.add(x.titulo);
          }
          return true;
        }),
    }),
    defineField({ name: "cierre", title: "Cierre", type: "textoLegal", description: "El bloque de datos del final." }),
    defineField({ name: "metaTitulo", title: "Título en Google", type: "string" }),
    defineField({ name: "metaDescripcion", title: "Descripción en Google", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "titulo", idioma: "idioma" },
    prepare: ({ title, idioma }) => ({ title, subtitle: idioma === "en" ? "English" : "Español" }),
  },
});
