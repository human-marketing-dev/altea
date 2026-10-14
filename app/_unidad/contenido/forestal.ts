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
      etiqueta: "Producción de árboles al año",
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
      id: "viveros-asturias",
      titulo: "Viveros Asturias",
      parrafos: [
        "Contamos con experiencia desde 2002 en la producción y manejo de especies forestales para arbolado urbano, proyectos empresariales y gubernamentales. Ofrecemos soluciones integrales que abarcan la producción, suministro y mantenimiento de arbolado, así como servicios de jardinería y conservación de espacios verdes, aplicando técnicas especializadas para favorecer su desarrollo y preservación.",
      ],
      foto: {
        src: "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-1.webp",
        alt: "Árboles en contenedor en Viveros Asturias",
        /* 1280x963 */
        ratio: 1.3292,
      },
      lado: "derecha",
      lista: {
        rotulo: "Servicios",
        items: [
          { titulo: "Servicio de jardinería", icono: "jardineria" },
          { titulo: "Reforestación", icono: "reforestacion" },
          { titulo: "Mantenimiento", icono: "mantenimiento" },
        ],
      },
    },
    {
      id: "teca",
      rotulo: "Plantación forestal comercial",
      titulo: "Teca",
      parrafos: [
        "Proyecto de plantación forestal comercial enfocado en recuperar el uso forestal de áreas degradadas por actividades agrícolas y ganaderas mediante la plantación sostenible de Teca en la Península de Yucatán.",
        "Integramos prácticas de manejo forestal y nuevas tecnologías para impulsar una producción de madera rentable y responsable, al mismo tiempo que contribuimos a la conservación de especies de fauna endémica y al desarrollo de una cultura forestal sostenible en la región.",
      ],
      foto: {
        src: "/images/forestal/teca/teca-forestal-altea.webp",
        alt: "Plantación de teca de Altea en la Península de Yucatán",
        /* 1980x1485 */
        ratio: 1.3333,
      },
      lado: "izquierda",
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
  proximos: {
    /* El mismo rótulo de sección que Comercial. */
    titulo: "Próximos\nproyectos",
    /* ⚠ PENDIENTE: no hay próximos proyectos de Forestal en el repo. */
    proyectos: [],
  },
};
