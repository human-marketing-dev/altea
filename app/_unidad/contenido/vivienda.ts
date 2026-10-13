import type { ContenidoUnidad } from "../tipos";
import { ANCLA_POR_DEFECTO } from "../tipos";
import { colorDeUnidad } from "@/lib/color-unidad";
import { BANDERA_ALTEA } from "./marca";
import { tarjetaDe } from "./desde-home";

/**
 * Contenido de /vivienda.
 *
 * Las cifras del hero y los proyectos son el copy que entregó Altea para
 * Vivienda. La descripción de los metadatos se lee del home. Lo que sigue
 * marcado PENDIENTE no ha llegado, y no se rellena.
 *
 * Los pares de las fichas —formato, lotes, desde— salen de la propia
 * descripción, como en Comercial salen el formato y los visitantes. Donde el
 * copy no da la ubicación, la ficha pinta un guion.
 */

const LOTES = { etiqueta: "Formato", valor: "Lotes residenciales" };
const PROXIMOS = "/images/vivienda/proximos-proyectos";

const TARJETA = tarjetaDe("vivienda");
const GALERIA = "/images/vivienda/galeria";

export const VIVIENDA: ContenidoUnidad = {
  unidad: "Vivienda",
  metadata: {
    title: "Vivienda — Altea",
    /* La descripción de la tarjeta de Vivienda en el home. */
    description: TARJETA.descripcion,
  },
  hero: {
    palabra: "Vivienda",
    /*
     * Sin consumidor, como en Comercial. Es la descripción del home. La frase de
     * la tarjeta («Creamos espacios donde comienza una nueva forma de vivir.») y
     * la de la página anterior («Crear hogares donde comienza tu historia.»)
     * tampoco tienen hueco en esta estructura.
     */
    descripcion: TARJETA.descripcion,
    segundos: 4.2,
    /*
     * Las cinco de la galería, 1980 px de ancho.
     *
     * ⚠ galeria-vivienda-altea-1 es el pórtico de Amarantha y la 4 el de Reserva
     * Mezquital: las mismas tomas que sus fotos de proyecto, con otro encuadre.
     *
     * ⚠ PENDIENTE: el `ancla` de las cinco es el valor por defecto, sin medir.
     */
    fotos: [
      { foto: `${GALERIA}/galeria-vivienda-altea-1.webp`, ratio: 1.5011, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-vivienda-altea-2.webp`, ratio: 1.5023, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-vivienda-altea-3.webp`, ratio: 1.5023, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-vivienda-altea-4.webp`, ratio: 1.5, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-vivienda-altea-5.webp`, ratio: 1.5, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
    ],
    /*
     * El color de Vivienda, de Altea: --unidad-vivienda en app/ui/tokens.css, el mismo de
     * su carpeta en el home. Pinta la mitad derecha de la banderola y los signos
     * de las cifras. No se ajusta aunque pese distinto que el de otra unidad.
     */
    color: colorDeUnidad("Vivienda"),
    /* La marca de Altea, la misma de las cuatro (contenido/marca.ts). */
    bandera: BANDERA_ALTEA,
  },
  cifras: [
    {
      prefijo: "+",
      valor: 18.8,
      signo: "M",
      etiqueta: "de m² desarrollables, equivalente +30 terrenos",
    },
    {
      prefijo: "+",
      valor: 376034,
      etiqueta: "de m² en desarrollo",
    },
  ],
  proyectos: {
    titulo: "Nuestros desarrollos residenciales",
    /*
     * ⚠ Amarantha va aquí y no en Próximos porque así lo pone el copy, aunque su
     * descripción empiece por "Próximo desarrollo" y el carril del home la tenga
     * "En desarrollo".
     */
    lista: [
      {
        id: "amarantha",
        nombre: "Amarantha",
        /* La del carril del home; el copy dice "Zona Sur de Monterrey, sobre
           Carretera Nacional". */
        ubicacion: "Zona Sur de Monterrey, Nuevo León",
        foto: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
        /* 1979x1319 */
        fotoRatio: 1.5004,
        alt: "",
        label: "Amarantha",
        descripcion:
          "Próximo desarrollo de lotes residenciales ubicado en la Zona Sur de Monterrey, sobre Carretera Nacional. Cuenta con aproximadamente 323 lotes desde 200 m², además de amenidades como: casa club, alberca, gimnasio, cancha de pádel, juegos infantiles, pet park, cowork, sport bar, asadores y áreas sociales. Un proyecto que integra ubicación estratégica y amenidades de alto nivel, creando un entorno pensado para vivir, crecer y construir patrimonio.",
        datos: [
          LOTES,
          { etiqueta: "Lotes", valor: "Aproximadamente 323" },
          { etiqueta: "Desde", valor: "200 m²" },
        ],
      },
      {
        id: "reserva-mezquital",
        nombre: "Reserva Mezquital",
        ubicacion: "Apodaca, Nuevo León",
        /* La carpeta trae una errata de origen ("mazquital"). */
        foto: "/images/vivienda/reserva-mazquital/reserva-mezquital-portico-vivienda-altea.webp",
        /* 1536x1024 */
        fotoRatio: 1.5,
        alt: "",
        label: "Reserva Mezquital",
        descripcion:
          "Reserva Mezquital es un desarrollo de 238 lotes residenciales en Apodaca, Nuevo León. Con terrenos desde 127.5 m², ubicados en una zona con alta conectividad y potencial de crecimiento. El proyecto cuenta con acceso controlado, áreas verdes, área social, juegos infantiles, cancha deportiva, ejercitadores y área para mascotas; espacios pensados para disfrutar, convivir y construir un hogar.",
        datos: [
          LOTES,
          /* "(en colaboración con Terra Regia)", que en el copy va junto al nombre. */
          { etiqueta: "En colaboración con", valor: "Terra Regia" },
          { etiqueta: "Lotes", valor: "238" },
          { etiqueta: "Desde", valor: "127.5 m²" },
        ],
      },
    ],
  },
  giros: {
    /** PENDIENTE */
    eyebrow: "PENDIENTE",
    /** PENDIENTE */
    titulo: "Vivienda · PENDIENTE",
    bloques: [],
  },
  marcas: {
    mostrar: false,
    /** PENDIENTE */
    titulo: "Vivienda · PENDIENTE",
    lista: [],
  },
  proximos: {
    /* El mismo rótulo de sección que Comercial. */
    titulo: "Próximos\nproyectos",
    proyectos: [
      {
        slug: "valle-de-los-altos",
        name: "Valle de los Altos",
        unit: "Vivienda",
        /* El copy da la vialidad, no la ciudad: PENDIENTE. */
        location: "Prolongación Eloy Cavazos",
        image: `${PROXIMOS}/valle-de-los-altos-altea.webp`,
        /* 1980x1106 */
        fotoRatio: 1.7902,
        descripcion:
          "Desarrollo residencial sobre Prolongación Eloy Cavazos, con una ubicación que facilita la conexión con las principales vialidades de la zona, así como con centros educativos, áreas comerciales y servicios de salud. Un proyecto pensado para integrar vivienda y conectividad en un entorno con potencial de crecimiento.",
      },
      {
        slug: "huajuquito",
        name: "Huajuquito",
        unit: "Vivienda",
        /* PENDIENTE: el copy no da ubicación. La ficha pinta un guion. */
        location: undefined,
        image: `${PROXIMOS}/huajuquito-altea.webp`,
        /* 1980x1105 */
        fotoRatio: 1.7919,
        descripcion:
          "Proyecto de lotes habitacionales que brinda la libertad de construir una residencia a la medida, complementada por la cercanía de una zona comercial. Una propuesta que integra vivienda, servicios y espacios para la vida cotidiana dentro de un mismo entorno.",
      },
      {
        slug: "margaritas",
        name: "Margaritas",
        unit: "Vivienda",
        /* El copy da la zona, no la ciudad: PENDIENTE. */
        location: "Zona de Carretera Nacional",
        image: `${PROXIMOS}/margaritas-altea.webp`,
        /* 1980x1105 */
        fotoRatio: 1.7919,
        descripcion:
          "Desarrollo de lotes habitacionales ubicado en la zona de Carretera Nacional. Un proyecto que combina planeación urbana, seguridad y un entorno residencial pensado para construir un hogar y disfrutar de una mejor calidad de vida.",
      },
      {
        slug: "cumbres-de-loreto",
        name: "Cumbres de Loreto",
        unit: "Vivienda",
        location: "Zona Cumbres, al poniente de Monterrey",
        image: `${PROXIMOS}/cumbres-de-loreto-altea.webp`,
        /* 1980x1566 */
        fotoRatio: 1.2644,
        descripcion:
          "Desarrollo residencial ubicado en la zona Cumbres, al poniente de Monterrey. Un proyecto que integra arquitectura contemporánea y vistas hacia las montañas, en un entorno pensado para combinar calidad de vida, conectividad y naturaleza.",
      },
    ],
  },
};
