/**
 * Los documentos únicos: uno de cada uno, que no se crea ni se borra desde el
 * Studio (ver sanity.config.ts). Campos fijos por sección: las maquetas están
 * diseñadas, no se arman con bloques.
 */
import { defineArrayMember, defineField, defineType } from "sanity";
import { ESTADOS_MX } from "./estados";
import { anchoMinimo, cantidad, maximo, textoDeAncho } from "../reglas";
import { cifra, foto, lineaTitular } from "./objetos";

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
    defineField({
      name: "whatsappMensaje",
      title: "Mensaje inicial de WhatsApp",
      type: "string",
      group: "contacto",
      description: "El texto que aparece ya escrito cuando alguien abre el chat.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "domicilio",
      title: "Domicilio",
      type: "string",
      group: "contacto",
      description:
        "En una línea: «Paricutín 390, Colonia Roma, Monterrey, N.L.». Los textos legales llevan el suyo aparte y no cambian con éste.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "facebook", title: "Facebook", type: "url", group: "redes" }),
    defineField({ name: "instagram", title: "Instagram", type: "url", group: "redes" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url", group: "redes" }),
    defineField({
      name: "metaTitulo",
      title: "Título del home en Google",
      type: "string",
      group: "seo",
      description: "Hoy es «Altea», a secas.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "metaDescripcion",
      title: "Descripción del home en Google",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Datos de contacto y del sitio" }) },
});

/* ── Cierre (el «Trabajemos juntos» del final de cada página) ─────────── */

export const cierre = defineType({
  name: "cierre",
  title: "Cierre de las páginas",
  type: "document",
  description: "Va al final del home, de Nosotros y de las cuatro unidades.",
  fields: [
    defineField({
      name: "rotulo",
      title: "Rótulo",
      type: "string",
      description: "La línea pequeña: «Trabajemos juntos». El sitio la pone en mayúsculas.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description:
        "Máximo 59 caracteres: más largo, agrega un renglón en teléfono y en las unidades se monta sobre el edificio del cierre.",
      validation: (r) => [r.required(), maximo(59, "agrega un renglón en teléfono")(r)],
    }),
  ],
  preview: { prepare: () => ({ title: "Cierre de las páginas" }) },
});

/* ── Inicio ───────────────────────────────────────────────────────────── */

export const lineaHome1 = lineaTitular({
  name: "lineaHome1",
  marca: "atenuado",
  max: 18,
  motivo: "en teléfono el titular agrega un renglón",
});
export const lineaHome2 = lineaTitular({
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
    defineField({
      name: "titularLinea1",
      title: "Titular, primera línea",
      type: "lineaHome1",
      group: "hero",
      description:
        "Hoy «Creando proyectos». Máximo 18 caracteres: más larga, en teléfono el titular agrega un renglón. Para atenuar palabras (en gris), selecciónalas y usa el botón «Atenuado».",
    }),
    defineField({
      name: "titularLinea2",
      title: "Titular, segunda línea",
      type: "lineaHome2",
      group: "hero",
      description:
        "Hoy «que materializan sueños», con «que» atenuado. Máximo 24 caracteres: más larga, en escritorio el titular agrega un renglón.",
    }),
    defineField({
      name: "frase",
      title: "Frase de entrada",
      type: "text",
      rows: 2,
      group: "cifras",
      description:
        "La frase que se enciende palabra por palabra sobre las cifras. Máximo 179 caracteres: más larga, agrega un renglón en teléfono.",
      validation: (r) => [r.required(), maximo(179, "agrega un renglón en teléfono")(r)],
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
      name: "video",
      title: "Video (escritorio)",
      type: "file",
      group: "video",
      options: { accept: "video/mp4" },
      description:
        "MP4, 1920×1080. Al cambiarlo hay que regenerar el póster (lo hacemos nosotros): sin eso se ve el cuadro del video anterior mientras carga.",
    }),
    defineField({
      name: "videoMovil",
      title: "Video (teléfono)",
      type: "file",
      group: "video",
      options: { accept: "video/mp4" },
      description: "El mismo video en 1280×720: pesa un tercio y en teléfono no se distingue.",
    }),
    defineField({
      name: "videoDescripcion",
      title: "Descripción del video",
      type: "string",
      group: "video",
      description: "No se ve: la leen los lectores de pantalla. «Video corporativo».",
    }),
    defineField({
      name: "tituloUnidades",
      title: "Título de la sección de unidades",
      type: "string",
      group: "unidades",
      description:
        "Máximo 69 caracteres: más largo, agrega un renglón en teléfono y la cabecera fija de las carpetas crece. El texto y la foto de cada carpeta se editan en cada Unidad.",
      validation: (r) => [r.required(), maximo(69, "agrega un renglón en teléfono")(r)],
    }),
    defineField({
      name: "tituloProyectos",
      title: "Título del carril de proyectos",
      type: "string",
      group: "proyectos",
      description: "Máximo 37 caracteres: más largo, agrega un renglón en teléfono.",
      validation: (r) => [r.required(), maximo(37, "agrega un renglón en teléfono")(r)],
    }),
    defineField({
      name: "proyectosDestacados",
      title: "Proyectos destacados, en orden",
      type: "array",
      group: "proyectos",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "proyecto" }],
          options: { disableNew: true },
        }),
      ],
      description:
        "Los del carril horizontal. Son los mismos documentos de las unidades: si se edita uno, cambia en los dos lados.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => [r.unique(), cantidad(3, 8, "es el recorrido del carril")(r)],
    }),
  ],
  preview: { prepare: () => ({ title: "Inicio" }) },
});

/* ── Nosotros ─────────────────────────────────────────────────────────── */

export const lineaNos1 = lineaTitular({ name: "lineaNos1", marca: "acento", max: 16, motivo: "el titular agrega un renglón en teléfono" });
export const lineaNos2 = lineaTitular({ name: "lineaNos2", marca: "acento", max: 20, motivo: "el titular agrega un renglón en teléfono" });
export const lineaNos3 = lineaTitular({ name: "lineaNos3", marca: "acento", max: 17, motivo: "el titular agrega un renglón en teléfono" });

export const cifraHuella = cifra({
  name: "cifraHuella",
  maxCifra: 15,
  motivoCifra: "en escritorio las dos cifras dejan de caber en una fila",
  maxEtiqueta: 87,
  motivoEtiqueta: "la fila de cifras salta a otro renglón en teléfono",
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
    defineField({ name: "titularLinea1", title: "Titular, línea 1", type: "lineaNos1", group: "hero", description: "Hoy «Transformamos». Máximo 16." }),
    defineField({ name: "titularLinea2", title: "Titular, línea 2", type: "lineaNos2", group: "hero", description: "Hoy «territorio en». Máximo 20." }),
    defineField({
      name: "titularLinea3",
      title: "Titular, línea 3",
      type: "lineaNos3",
      group: "hero",
      description: "Hoy «oportunidades», en coral: selecciónala y usa «Acento». Máximo 17. Más largas, el titular agrega un renglón en teléfono.",
    }),
    defineField({
      name: "bajada",
      title: "Texto del hero",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Máximo 160 caracteres: más largo, agrega un renglón en teléfono.",
      validation: (r) => [r.required(), maximo(160, "agrega un renglón en teléfono")(r)],
    }),

    defineField({
      name: "origenParrafos",
      title: "Párrafos de la historia",
      type: "array",
      group: "origen",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      description: "La frase grande de arriba («Más de 40 años…») es fija: se anima por palabra.",
      validation: (r) => cantidad(1, 3, "es la columna de texto junto a la foto")(r),
    }),
    defineField({
      name: "origenFotos",
      title: "Fotos de la historia",
      type: "array",
      group: "origen",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Descripción de la foto", type: "string", validation: (r) => r.required() })],
          validation: (r) => anchoMinimo("origen", "la foto de la historia")(r),
        }),
      ],
      description: `Con dos o más, se vuelven un carrusel. ${textoDeAncho("origen")}`,
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(1, 4, "es la caja de la foto de la historia")(r),
    }),

    defineField({
      name: "pilaresTitulo",
      title: "Título",
      type: "string",
      group: "pilares",
      description: "Máximo 47 caracteres: más largo, agrega un renglón.",
      validation: (r) => [r.required(), maximo(47, "agrega un renglón")(r)],
    }),
    defineField({
      name: "pilares",
      title: "Pilares",
      type: "array",
      group: "pilares",
      of: [defineArrayMember({ type: "string", validation: (r) => [r.required(), maximo(49, "el pilar pasa a tres renglones o rompe la fila en teléfono")(r)] })],
      description:
        "Los tres títulos, en orden. Los iconos están dibujados para cada uno y siguen ese orden: innovación, comunidades, trascendencia. Máximo 49 caracteres cada uno.",
      validation: (r) => cantidad(3, 3, "hay tres iconos, uno por pilar")(r),
    }),

    defineField({
      name: "grupoTitulo",
      title: "Título",
      type: "string",
      group: "grupo",
      description: "Máximo 41 caracteres: más largo, agrega un renglón en teléfono. El organigrama y sus logos son fijos.",
      validation: (r) => [r.required(), maximo(41, "agrega un renglón en teléfono")(r)],
    }),
    defineField({ name: "grupoIntro", title: "Texto", type: "text", rows: 4, group: "grupo", validation: (r) => r.required() }),
    defineField({
      name: "grupoPie",
      title: "Pie del organigrama",
      type: "array",
      group: "grupo",
      of: [defineArrayMember({ type: "string" })],
      description: "Los dos textos de abajo: «Seis sectores» · «Una sola visión de largo plazo».",
      validation: (r) => cantidad(2, 2, "van uno a cada lado")(r),
    }),

    defineField({
      name: "huellaTitulo",
      title: "Título",
      type: "string",
      group: "huella",
      description: "Máximo 16 caracteres: más largo, pasa a dos renglones. El texto de abajo se escribe solo con los estados y países de «Presencia».",
      validation: (r) => [r.required(), maximo(16, "pasa a dos renglones")(r)],
    }),
    defineField({ name: "huellaBoton", title: "Texto del botón", type: "string", group: "huella", validation: (r) => r.required() }),
    defineField({ name: "huellaBotonEnlace", title: "Enlace del botón", type: "url", group: "huella", description: "Hoy el video de YouTube." }),
    defineField({
      name: "huellaCifras",
      title: "Cifras",
      type: "array",
      group: "huella",
      of: [defineArrayMember({ type: "cifraHuella" })],
      description: "Cada cifra: máximo 15 caracteres contando el + y el signo. Hoy «+44,000,000 m²» tiene 14.",
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
            defineField({ name: "etiqueta", title: "Etiqueta", type: "string", validation: (r) => r.required() }),
            defineField({ name: "valor", title: "m²", type: "number", validation: (r) => r.required().min(0) }),
          ],
          preview: { select: { title: "etiqueta", subtitle: "valor" } },
        }),
      ],
      description: "Las barras debajo de las cifras: «Nuevo León · 24,000,000». La barra se calcula con la proporción.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(2, 5, "son las barras del reparto")(r),
    }),
    defineField({ name: "mapaRotulo", title: "Mapa: rótulo", type: "string", group: "huella", description: "«Presencia»." }),
    defineField({ name: "mapaPista", title: "Mapa: indicación", type: "string", group: "huella", description: "La frase que invita a pasar el cursor por un estado." }),
    defineField({ name: "mapaEtiquetaEstado", title: "Mapa: etiqueta del dato", type: "string", group: "huella" }),
    defineField({ name: "mapaSinDato", title: "Mapa: estado sin dato", type: "string", group: "huella", description: "Lo que dice un estado sin superficie registrada." }),

    defineField({
      name: "rsTitulo",
      title: "Título",
      type: "string",
      group: "rs",
      description: "Máximo 37 caracteres: más largo, agrega un renglón.",
      validation: (r) => [r.required(), maximo(37, "agrega un renglón")(r)],
    }),
    defineField({ name: "rsSubtitulo", title: "Subtítulo", type: "string", group: "rs" }),
    defineField({
      name: "rsParrafos",
      title: "Párrafos",
      type: "array",
      group: "rs",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (r) => cantidad(1, 3, "es la columna de texto")(r),
    }),
    defineField({
      name: "rsGaleria",
      title: "Galería",
      type: "array",
      group: "rs",
      of: [
        defineArrayMember({
          type: "object",
          name: "fotoGaleria",
          fields: [
            foto({ name: "imagen", title: "Foto", ancho: "galeria", donde: "la galería", altObligatorio: true }),
            defineField({ name: "pie", title: "Pie de foto", type: "string", description: "Lo que se lee al pasar el cursor." }),
          ],
          preview: { select: { title: "pie", media: "imagen" } },
        }),
      ],
      description: "Seis fotos, en la rejilla diseñada para seis.",
      // Decidido, no medido: la maqueta no cambia en este número.
      validation: (r) => cantidad(6, 6, "la rejilla está diseñada para seis")(r),
    }),

    defineField({ name: "metaTitulo", title: "Título en Google", type: "string", group: "seo", validation: (r) => r.required() }),
    defineField({
      name: "metaDescripcion",
      title: "Descripción en Google",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Hoy repite a mano «21 estados…». Si cambian los estados en «Presencia», hay que cambiarla aquí también.",
      validation: (r) => r.required(),
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
      of: [defineArrayMember({ type: "string" })],
      description: "Hoy Estados Unidos, España y Costa Rica.",
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
    defineField({ name: "titulo", title: "Título", type: "string", description: "«Hablemos de tu proyecto».", validation: (r) => r.required() }),
    defineField({ name: "descripcion", title: "Texto", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "textoWhatsapp", title: "Texto del enlace de WhatsApp", type: "string", description: "«Escríbenos por WhatsApp»." }),
    defineField({ name: "exitoTitulo", title: "Mensaje al enviar: título", type: "string", description: "«Gracias, recibimos tu mensaje.»" }),
    defineField({ name: "exitoTexto", title: "Mensaje al enviar: texto", type: "string" }),
    defineField({ name: "metaTitulo", title: "Título en Google", type: "string", validation: (r) => r.required() }),
    defineField({ name: "metaDescripcion", title: "Descripción en Google", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});

/* ── Documentos legales (dos: aviso de privacidad y términos) ─────────── */

export const documentoLegal = defineType({
  name: "documentoLegal",
  title: "Documento legal",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "fecha", title: "Última actualización", type: "date", description: "Opcional. Sale bajo el título." }),
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
    defineField({ name: "metaDescripcion", title: "Descripción en Google", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "titulo" } },
});
