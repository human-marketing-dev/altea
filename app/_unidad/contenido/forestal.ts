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
  proyectos: {
    titulo: "Nuestro proyecto de plantación forestal",
    /*
     * ⚠ Hay fotos de Viveros Asturias (/images/forestal/viveros-asturias, tres)
     * sin copy: no entran.
     */
    lista: [
      {
        id: "teca",
        nombre: "Teca",
        ubicacion: "Península de Yucatán",
        foto: "/images/forestal/teca/teca-forestal-altea.webp",
        /* 1980x1485 */
        fotoRatio: 1.3333,
        alt: "",
        label: "Teca",
        /* Dos párrafos en el copy: la línea en blanco la respeta la ficha
           (white-space: pre-line en .uni-fx__cuerpo > p). */
        descripcion:
          "Proyecto de plantación forestal comercial enfocado en recuperar el uso forestal de áreas degradadas por actividades agrícolas y ganaderas mediante la plantación sostenible de Teca en la Península de Yucatán.\n\nIntegramos prácticas de manejo forestal y nuevas tecnologías para impulsar una producción de madera rentable y responsable, al mismo tiempo que contribuimos a la conservación de especies de fauna endémica y al desarrollo de una cultura forestal sostenible en la región.",
        /* De la primera frase del copy: "Proyecto de plantación forestal
           comercial". */
        datos: [{ etiqueta: "Formato", valor: "Plantación forestal comercial" }],
      },
    ],
  },
  giros: {
    /*
     * La sección de "Otros giros" de Comercial —hoteles, hospital, educación—
     * con los tres servicios. Mismo diseño y misma estructura.
     *
     * ⚠ PENDIENTE: los iconos. El copy los pide y no están en el repo. Hasta
     * que lleguen, las láminas van sin imagen, sobre ink, con el número y el
     * título. Tampoco hay descripción de cada servicio, así que no se abren al
     * pasar el cursor.
     *
     * Sin `eyebrow`: el copy da "Servicios" como encabezado y nada más.
     */
    titulo: "Servicios",
    bloques: [
      { id: "jardineria", numero: "01", title: "Servicio de jardinería" },
      { id: "reforestacion", numero: "02", title: "Reforestación" },
      { id: "mantenimiento", numero: "03", title: "Mantenimiento" },
    ],
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
