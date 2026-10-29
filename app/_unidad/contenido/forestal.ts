import type { ContenidoUnidad } from "../tipos";
import { ANCLA_POR_DEFECTO } from "../tipos";
import { colorDeUnidad } from "@/lib/color-unidad";
import { BANDERA_ALTEA } from "./marca";
import { tarjetaDe } from "./desde-home";

/**
 * Contenido de /forestal.
 *
 * Las cifras del hero, los servicios y el proyecto son el copy que entregó
 * Altea para Forestal. La descripción de los metadatos se lee del home. Lo que
 * sigue marcado PENDIENTE no ha llegado, y no se rellena.
 */

const TARJETA = tarjetaDe("forestal");
const PRINCIPAL = "/images/forestal/imagen-principal";

export const FORESTAL: ContenidoUnidad = {
  unidad: "Forestal",
  metadata: {
    title: "Forestal — Altea",
    /* La descripción de la tarjeta de Forestal en el home. */
    description: TARJETA.descripcion,
  },
  hero: {
    palabra: "Forestal",
    /*
     * Sin consumidor, como en Comercial. Es la descripción del home; la frase de
     * la tarjeta («Plantación y manejo forestal a largo plazo.») tampoco tiene
     * hueco en esta estructura.
     */
    descripcion: TARJETA.descripcion,
    segundos: 4.2,
    /*
     * Las dos de imagen-principal, que es la carpeta que la propia unidad marca
     * para esto. Rota entre dos.
     *
     * ⚠ PENDIENTE: el `ancla` de las dos es el valor por defecto, sin medir. Son
     * tomas de plantación con cielo arriba, y Forestal es la palabra más corta
     * de las cuatro: aquí un ancla mal puesta se nota más que en ninguna.
     */
    fotos: [
      { foto: `${PRINCIPAL}/lote-13-forestal-altea.webp`, ratio: 1.5023, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
      { foto: `${PRINCIPAL}/lote-9-forestal-altea.webp`, ratio: 1.5023, ancla: ANCLA_POR_DEFECTO /* PENDIENTE */ },
    ],
    /*
     * El color de Forestal, de Altea: --unidad-forestal en app/ui/tokens.css, el mismo de
     * su carpeta en el home. Pinta la mitad derecha de la banderola y los signos
     * de las cifras. No se ajusta aunque pese distinto que el de otra unidad.
     *
     * Forestal no tiene logotipo de unidad en public/brand/business-units:
     * mientras llega, los trazos son los de la marca de Altea, como en las otras.
     */
    color: colorDeUnidad("Forestal"),
    /* La marca de Altea, la misma de las cuatro (contenido/marca.ts). */
    bandera: BANDERA_ALTEA,
  },
  cifras: [
    {
      valor: 1465,
      etiqueta: "hectáreas para uso forestal",
    },
    {
      /*
       * El copy dice "Producción de 18 mil árboles al año". La cifra va arriba y
       * la etiqueta debajo, así que la frase se reordena —como el "Tasa de
       * ocupación" del 94 % de Comercial— sin cambiar una palabra de sitio que
       * no haga falta.
       */
      valor: 18,
      signo: " mil",
      etiqueta: "producción de árboles al año",
    },
  ],
  /*
   * LAS DOS LÍNEAS DE FORESTAL, cada una con su texto, su foto y su lista. El
   * copy es el que entregó Altea. Sustituyen al carrusel de una sola tarjeta
   * (Teca) y a las láminas de servicios sin foto que había antes.
   *
   * Los iconos de las siete columnas están en Atributos.tsx, en el mismo
   * lenguaje que los de pilares e Industrial. Van en el color de Forestal
   * (--unidad-forestal), que sobre la página clara da 1.79:1: a trazo capilar
   * quedan tenues A PROPÓSITO. Si se ven lavados, la respuesta es el fondo, no
   * el color.
   */
  lineas: [
    {
      id: "teca",
      titulo: "Teca",
      /* El logotipo va en lugar del título. 630x376, recortado de
         logo-teca-altea.webp. ⚠ El logo dice «Teca San Miguel», no sólo «Teca». */
      logo: {
        src: "/images/forestal/teca/logo-teca-altea-recorte.webp",
        alt: "Teca San Miguel",
        ancho: 630,
        alto: 376,
      },
      parrafos: [
        "Proyecto de plantación forestal comercial ubicado en Tizimín, Yucatán, enfocado en recuperar la vocación forestal de tierras degradadas por actividades agrícolas y ganaderas. En 2011, iniciamos la plantación sostenible de 682,853 árboles de teca en 841 hectáreas, un proceso que permitió restaurar la salud del suelo y que contribuye a revitalizar la economía de al menos 100 familias mayas de la región.",
      ],
      fotos: [
        {
          src: "/images/forestal/teca/teca-forestal-altea.webp",
          alt: "Plantación de teca de Altea en la Península de Yucatán",
          /* 1980x1485 */
          ratio: 1.3333,
        },
      ],
      lado: "derecha",
      lista: {
        rotulo: "Aplicaciones",
        items: [
          { titulo: "Mobiliario", icono: "mobiliario" },
          { titulo: "Construcción", icono: "construccion" },
          { titulo: "Hotelería", icono: "hoteleria" },
          { titulo: "Embarcaciones", icono: "embarcaciones" },
        ],
      },
    },
    {
      id: "viveros-asturias",
      titulo: "Viveros Asturias",
      /* El logotipo va en lugar del título, a color (29 oct 2026). 601x403,
         recortado a su mancha de LOGOTIPO_VIVEROS_ASTURIAS_CURVAS-01-COLOR.webp,
         que viene en 1650x1275 con casi todo el lienzo vacío. */
      logo: {
        src: "/images/forestal/viveros-asturias/logo-viveros-asturias-color-altea-recorte.webp",
        alt: "Viveros Asturias",
        ancho: 601,
        alto: 403,
      },
      parrafos: [
        "Ofrecemos soluciones integrales de arbolado urbano, jardinería y conservación de espacios verdes para proyectos empresariales y gubernamentales. Nuestros servicios abarcan desde la producción y suministro de árboles hasta su mantenimiento y preservación, mediante técnicas especializadas que favorecen su desarrollo.",
        "Actualmente, brindamos servicios de jardinería en 23 centros comerciales y mantenimiento en 19 terrenos, con más de 40,000 m² de áreas verdes atendidas mensualmente y más de 18,000 nuevos árboles plantados, contribuyendo a la conservación y mejora de los espacios naturales.",
      ],
      /*
       * Las tres de la carpeta, en carrusel. ⚠ La 2 y la 3 son 1980x915 —más
       * apaisadas que la caja— y se recortan mucho por los lados, sobre todo
       * en escritorio, donde la caja es casi cuadrada.
       */
      fotos: [
        {
          src: "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-1.webp",
          alt: "Árboles en contenedor en Viveros Asturias",
          /* 1280x963 */
          ratio: 1.3292,
        },
        {
          src: "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-2.webp",
          alt: "Plántulas en bolsas de vivero, vistas desde arriba, en Viveros Asturias",
          /* 1980x915 */
          ratio: 2.1639,
        },
        {
          src: "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-3.webp",
          alt: "Plantas de tuya en maceta en Viveros Asturias",
          /* 1980x915 */
          ratio: 2.1639,
        },
      ],
      lado: "izquierda",
      lista: {
        rotulo: "Servicios",
        items: [
          { titulo: "Servicio de jardinería", icono: "jardineria" },
          { titulo: "Reforestación", icono: "reforestacion" },
          { titulo: "Mantenimiento", icono: "mantenimiento" },
        ],
      },
    },
  ],
  /*
   * Vacío: Teca pasó a su línea de negocio, arriba. El título se conserva por si
   * vuelve un carrusel de proyectos forestales.
   */
  proyectos: {
    titulo: "Nuestro proyecto de plantación forestal",
    lista: [],
  },
  /* Vacío: los servicios pasaron a la lista de Viveros Asturias, arriba. */
  giros: {
    titulo: "Servicios",
    bloques: [],
  },
  marcas: {
    mostrar: false,
    /** PENDIENTE */
    titulo: "Forestal · PENDIENTE",
    lista: [],
  },
  /*
   * El cierre con la foto que se sale del panel, como Comercial. Para volver al
   * cierre de siempre, borra este campo.
   *
   * La foto es una copia recortada de cta/forestal-cta.webp: el original trae
   * el 37 % de arriba transparente (395 de 1080 px). El recorte es al borde de
   * las copas y nada más; WebP sin pérdida.
   */
  cierre: {
    color: colorDeUnidad("Forestal"),
    foto: {
      src: "/images/forestal/cta/forestal-cta-recorte.webp",
      ancho: 1080,
      alto: 685,
    },
  },
  proximos: {
    /* El mismo rótulo de sección que Comercial. */
    titulo: "Próximos\nproyectos",
    /* ⚠ PENDIENTE: no hay próximos proyectos de Forestal en el repo. */
    proyectos: [],
  },
};
