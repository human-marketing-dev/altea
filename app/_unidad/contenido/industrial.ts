import type { ContenidoUnidad } from "../tipos";
import { ANCLA_POR_DEFECTO } from "../tipos";
import { colorDeUnidad } from "@/lib/color-unidad";
import { BANDERA_ALTEA } from "./marca";
import { tarjetaDe } from "./desde-home";

/**
 * Contenido de /industrial.
 *
 * Las cifras del hero y los proyectos son el copy que entregó Altea para
 * Industrial. La descripción de los metadatos se lee del home. Lo que sigue
 * marcado PENDIENTE no ha llegado, y no se rellena.
 *
 * ⚠ LOS DATOS DE LAS FICHAS SON LOS DEL COPY, PARTIDOS EN SU DOS PUNTOS: "Nave
 * en renta: 7,568 m²" es la etiqueta "Nave en renta" y el valor "7,568 m²".
 * Dos ajustes de forma, no de contenido:
 *   · "Opción de Naves Especulativas y Build to Suit" va como etiqueta
 *     "Opción" y valor "Naves Especulativas y Build to Suit".
 *   · Los tres terrenos de Cadereyta van en un par cada uno —lotes y área
 *     rentable en el mismo valor—: partidos serían nueve filas en la ficha.
 * El primer par de cada parque, "Formato: Parque industrial", sale del
 * encabezado "Parques industriales" del copy; el del aeropuerto, de
 * lib/proyectos.ts ("Infraestructura aeroportuaria").
 */

const NAVES = "/images/industrial/naves-industriales";
const PROXIMOS = "/images/industrial/proximos-proyectos";
const OPCION = { etiqueta: "Opción", valor: "Naves Especulativas y Build to Suit" };
const PARQUE = { etiqueta: "Formato", valor: "Parque industrial" };

const TARJETA = tarjetaDe("industrial");
const GALERIA = "/images/industrial/galeria";

export const INDUSTRIAL: ContenidoUnidad = {
  unidad: "Industrial",
  metadata: {
    title: "Industrial — Altea",
    /* La descripción de la tarjeta de Industrial en el home. */
    description: TARJETA.descripcion,
  },
  hero: {
    palabra: "Industrial",
    /*
     * Sin consumidor, como en Comercial: la estructura no lleva bajada. Es la
     * descripción del home. La frase de esa misma tarjeta («Infraestructura que
     * impulsa el futuro.») y la que traía la página anterior del deck
     * («Desarrollar infraestructura con visión de futuro.») tampoco tienen hueco.
     */
    descripcion: TARJETA.descripcion,
    segundos: 4.2,
    /*
     * Las cinco de la galería, 1980 px de ancho: es lo más cerca de los 2 000 que
     * pide el hero sin ablandarse (ver ZOOM y SOBRE_CUBRE en HeroCalado). Las de
     * naves-industriales van de 1 078 a 2 182 px y varias se quedarían cortas.
     *
     * ⚠ galeria-industrial-altea-3 es la misma toma que la foto de Bajío
     * Industrial Park, con otro nombre de archivo.
     *
     * ⚠ PENDIENTE: el `ancla` de las cinco es el valor por defecto, sin medir.
     * Se ajusta mirando el hero montado, foto por foto.
     */
    fotos: [
      { foto: `${GALERIA}/galeria-industrial-altea-1.webp`, ratio: 1.7919, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-industrial-altea-2.webp`, ratio: 1.6751, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-industrial-altea-3.webp`, ratio: 1.8099, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-industrial-altea-4.webp`, ratio: 1.7919, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${GALERIA}/galeria-industrial-altea-5.webp`, ratio: 1.5, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
    ],
    /*
     * El color de Industrial, de Altea: --unidad-industrial en app/ui/tokens.css, el mismo de
     * su carpeta en el home. Pinta la mitad derecha de la banderola y los signos
     * de las cifras. No se ajusta aunque pese distinto que el de otra unidad.
     */
    color: colorDeUnidad("Industrial"),
    /* La marca de Altea, la misma de las cuatro (contenido/marca.ts). */
    bandera: BANDERA_ALTEA,
  },
  cifras: [
    {
      prefijo: "+",
      valor: 400,
      signo: " mil",
      etiqueta: "m² desarrollados",
    },
    {
      valor: 4,
      signo: "M",
      etiqueta: "de m² desarrollables",
    },
  ],
  /* El bloque de tres atributos bajo el hero. Sin descripción: no hay copy. */
  atributos: [
    { titulo: "Ubicación estratégica", icono: "ubicacion" },
    { titulo: "Sustentabilidad operativa", icono: "sustentabilidad" },
    { titulo: "Infraestructura de clase mundial", icono: "infraestructura" },
  ],
  proyectos: {
    titulo: "Nuestros proyectos industriales",
    /*
     * ⚠ Hay fotos de dos parques más sin copy, que no entran: Juárez y Mezquital
     * Industrial Park (naves-industriales).
     *
     * ⚠ Huinalá y López Mateos tienen la foto en proximos-proyectos/, pero el
     * copy los pone EN OPERACIÓN; manda el copy. Al revés con Cadereyta y
     * Salinas Victoria, que están en naves-industriales y son próximos.
     *
     * ⚠ Pocket Park y Primavera tienen fotos chicas (1078 y 1200 px de ancho):
     * en la ficha, a 1040 px, se verán algo blandas.
     */
    lista: [
      {
        id: "aeropuerto-saltillo",
        nombre: "Aeropuerto de Saltillo",
        ubicacion: "Saltillo, Coahuila",
        foto: "/images/industrial/aeropuerto/aeropuerto-saltillo-altea.webp",
        /* 2560x1412 */
        fotoRatio: 1.813,
        alt: "",
        label: "Aeropuerto de Saltillo",
        descripcion:
          "Proyecto de remodelación, modernización y ampliación del Aeropuerto Internacional Plan de Guadalupe en Saltillo, Coahuila, en el que participamos como socios tanto en su desarrollo como en su operación. El proyecto busca reactivar y modernizar sus instalaciones, mejorar integralmente las salas de espera y generar nuevas oportunidades de negocio que contribuyan al crecimiento y desarrollo de la región.",
        datos: [{ etiqueta: "Formato", valor: "Infraestructura aeroportuaria" }],
      },
      {
        id: "bajio-industrial-park",
        nombre: "Bajío Industrial Park",
        /* El copy no la nombra; es la del carril del home. */
        ubicacion: "Salamanca, Guanajuato",
        /* El nombre del archivo trae una errata de origen ("undustrial"). */
        foto: `${NAVES}/bajio-undustrial-park-altea.webp`,
        /* 1726x954 */
        fotoRatio: 1.8092,
        alt: "",
        label: "Bajío Industrial Park",
        descripcion:
          "Parque industrial estratégicamente ubicado en la entrada de la planta Mazda, con acceso directo a la carretera libre (45) Salamanca-Irapuato y lateral a la carretera de cuota a León. Su conectividad facilita las operaciones industriales, logísticas y el acceso a los principales corredores productivos de la región.",
        datos: [
          PARQUE,
          { etiqueta: "Nave en renta", valor: "7,568 m²" },
          { etiqueta: "Terreno en venta", valor: "21,946 m²" },
          OPCION,
        ],
      },
      {
        id: "pocket-park-aeropuerto",
        nombre: "Pocket Park Aeropuerto",
        ubicacion: "Apodaca, Nuevo León",
        foto: `${NAVES}/pocket-park-aeropuerto-altea.webp`,
        /* 1078x732 */
        fotoRatio: 1.4727,
        alt: "",
        label: "Pocket Park Aeropuerto",
        descripcion:
          "Parque industrial ubicado sobre la Autopista al Aeropuerto Internacional de Monterrey, en Apodaca, Nuevo León. Diseñado para logística y manufactura ligera, ofrece espacios flexibles que facilitan la operación de empresas que requieren una ubicación accesible y conexión con importantes vías de transporte.",
        datos: [
          PARQUE,
          /* "(en sociedad con GP Desarrollos)", que en el copy va junto al nombre. */
          { etiqueta: "En sociedad con", valor: "GP Desarrollos" },
          { etiqueta: "4 Naves en renta", valor: "13,285 m²" },
          { etiqueta: "Área Rentable Total", valor: "53,140 m²" },
        ],
      },
      {
        id: "primavera-industrial-park",
        nombre: "Primavera Industrial Park",
        ubicacion: "Apodaca, Nuevo León",
        foto: `${NAVES}/primavera-industrial-park-altea.webp`,
        /* 1200x896 */
        fotoRatio: 1.3393,
        alt: "",
        label: "Primavera Industrial Park",
        descripcion:
          "Parque industrial ubicado sobre Av. Miguel Alemán, en Apodaca, Nuevo León. Cuenta con naves PYME y espacios modulares diseñados para adaptarse a las necesidades de proveedores de la cadena de suministro y empresas de distribución regional, con acceso a uno de los principales corredores industriales de la zona.",
        datos: [
          PARQUE,
          { etiqueta: "Bodegas en renta", valor: "De 901 m² a 1,800 m²" },
          { etiqueta: "Área Rentable Total", valor: "6,538 m²" },
        ],
      },
      {
        id: "huinala-industrial-park",
        nombre: "Huinalá Industrial Park",
        ubicacion: "Apodaca, Nuevo León",
        foto: `${PROXIMOS}/huinala-industrial-park-altea.webp`,
        /* 1980x1182 */
        fotoRatio: 1.6751,
        alt: "",
        label: "Huinalá Industrial Park",
        descripcion:
          "Parque industrial ubicado sobre Av. Miguel Alemán, en Apodaca, Nuevo León. Su conexión directa con la carretera facilita el acceso al Aeropuerto Internacional de Monterrey y a las principales vías de la zona metropolitana, favoreciendo la operación y movilidad de empresas industriales y logísticas.",
        datos: [
          PARQUE,
          { etiqueta: "Área Rentable Total", valor: "18,410 m²" },
          { etiqueta: "Área Disponible", valor: "6,344 m²" },
          OPCION,
        ],
      },
      {
        id: "lopez-mateos-industrial-park",
        nombre: "López Mateos Industrial Park",
        ubicacion: "San Nicolás de los Garza, Nuevo León",
        foto: `${PROXIMOS}/lopez-mateos-industrial-park-altea.webp`,
        /* 1980x1105 */
        fotoRatio: 1.7919,
        alt: "",
        label: "López Mateos Industrial Park",
        descripcion:
          "Parque industrial ubicado sobre Av. López Mateos, en San Nicolás de los Garza, Nuevo León. Su conexión directa con esta importante arteria facilita la integración logística con el área metropolitana de Monterrey y brinda acceso a una amplia base de mano de obra local, favoreciendo la operación y crecimiento de las empresas.",
        datos: [
          PARQUE,
          { etiqueta: "Área Rentable Total", valor: "20,825 m²" },
          { etiqueta: "Área Disponible", valor: "5,825 m²" },
          OPCION,
        ],
      },
    ],
  },
  giros: {
    /** PENDIENTE */
    eyebrow: "PENDIENTE",
    /** PENDIENTE */
    titulo: "Industrial · PENDIENTE",
    /*
     * ⚠ PENDIENTE: el equivalente a "Otros giros" de Comercial. Hay una foto del
     * aeropuerto en /images/industrial/aeropuerto, pero sin bloques de copy no
     * hay sección.
     */
    bloques: [],
  },
  marcas: {
    /*
     * Apagado. En /images/industrial/logo-marcas hay cuatro logotipos —CEVA
     * Logistics, Güntner, Mazda, Viakable— sin medir para el muro, y el mismo
     * pendiente legal que el de Comercial: usar marcas ajenas implica endoso.
     */
    mostrar: false,
    /** PENDIENTE */
    titulo: "Industrial · PENDIENTE",
    lista: [],
  },
  /*
   * El cierre con la foto que se sale del panel, como Comercial y Forestal.
   * Para volver al cierre de siempre, borra este campo.
   *
   * La foto es una copia recortada de cta/industrial-cta.webp: el original trae
   * 454 px transparentes arriba y 248 a la izquierda. El recorte es al borde de
   * la nave y nada más; WebP sin pérdida.
   */
  cierre: {
    color: colorDeUnidad("Industrial"),
    foto: {
      src: "/images/industrial/cta/industrial-cta-recorte.webp",
      ancho: 832,
      alto: 626,
    },
  },
  proximos: {
    /* El mismo rótulo de sección que Comercial. */
    titulo: "Próximos\nproyectos",
    proyectos: [
      {
        slug: "aeropuerto-industrial-park",
        name: "Aeropuerto Industrial Park",
        unit: "Industrial",
        location: "Apodaca, Nuevo León",
        image: `${PROXIMOS}/aeropuerto-industrial-park.webp`,
        /* 1980x1098 */
        fotoRatio: 1.8033,
        descripcion:
          "Próximo parque industrial ubicado sobre la Autopista al Aeropuerto Internacional de Monterrey, en Apodaca, Nuevo León. Forma parte de un entorno empresarial consolidado, se encuentra próximo a Pocket Park Aeropuerto, parque que desarrollamos en colaboración con Garza Ponce, y a un costado el Centro de Innovación y Diseño Estratégico de Productos del Tecnológico de Monterrey.",
        datos: [
          { etiqueta: "4 Naves", valor: "Desde 10,087 m² hasta 13,891 m²" },
          { etiqueta: "Área Rentable Total", valor: "50,712 m²" },
          OPCION,
        ],
      },
      {
        slug: "cadereyta-industrial-park",
        name: "Cadereyta Industrial Park",
        unit: "Industrial",
        location: "Cadereyta Jiménez, Nuevo León",
        image: `${NAVES}/cadereyta-industrial-park-altea.webp`,
        /* 1718x966 */
        fotoRatio: 1.7785,
        descripcion:
          "Parque industrial ubicado en el km 25.1 de la carretera libre a Reynosa, en Cadereyta Jiménez, Nuevo León. Su acceso directo a esta importante vía facilita la conexión con Monterrey y otros puntos de la región, ofreciendo una ubicación funcional para operaciones industriales, logísticas y comerciales.",
        datos: [
          { etiqueta: "Terreno 1", valor: "Lotes de 21,820 m² a 41,920 m² · Área rentable: 730,965 m²" },
          { etiqueta: "Terreno 2", valor: "Lotes de 12,241 m² a 33,655 m² · Área rentable: 644,324 m²" },
          { etiqueta: "Terreno 3", valor: "Lotes de 23,507 m² a 28,598 m² · Área rentable: 363,511 m²" },
          OPCION,
        ],
      },
      {
        slug: "salinas-victoria-industrial-park",
        name: "Salinas Victoria Industrial Park",
        unit: "Industrial",
        location: "Salinas Victoria, Nuevo León",
        image: `${NAVES}/salinas-victoria-industrial-park-altea.webp`,
        /* 1728x958 */
        fotoRatio: 1.8038,
        descripcion:
          "Parque industrial ubicado sobre la carretera Colombia km 14.4, en Salinas Victoria, Nuevo León. Forma parte de uno de los corredores industriales de mayor crecimiento al norte del estado y cuenta con conexión directa hacia la frontera a través de la ruta Colombia–Laredo, facilitando el acceso a importantes mercados y rutas de comercio.",
        datos: [
          { etiqueta: "Lotes", valor: "De 40,977 m² a 135,228 m²" },
          { etiqueta: "Área Rentable Total", valor: "517,361 m²" },
          OPCION,
        ],
      },
    ],
  },
};
