/**
 * Datos y copy de contacto. Fuente única: los consumen el CTA de la portada,
 * el bloque de captación de todas las páginas y la página /contacto.
 *
 * Correo, teléfono, WhatsApp y domicilio CONFIRMADOS por Altea.
 *
 * Ojo: el teléfono y el WhatsApp son números DISTINTOS. Antes compartían uno
 * solo y el enlace de WhatsApp se armaba con el mismo dígito del teléfono.
 */

import { INSTAGRAM_URL } from "./publicaciones";

export const CONTACTO = {
  eyebrow: "Contacto",
  title: "Hablemos de nuevas oportunidades",
  description: "Déjanos tus datos y nuestro equipo se pondrá en contacto contigo.",
  /** Cada línea con el icono que le toca. */
  datos: [
    { texto: "info@alteadesarrollos.com", icono: "correo" },
    {
      texto: "Paricutín 390, Colonia Roma, Monterrey, Nuevo León",
      icono: "ubicacion",
    },
  ],
} as const;

export const CANALES = {
  correo: "info@alteadesarrollos.com",
  /**
   * NO es el mismo número que `telefono`. En E.164 sin signos, como pide wa.me.
   * El de marcar es +52 81 3551 2000.
   */
  whatsapp: "528135512000",
  whatsappMensaje: "Hola Altea, me interesa conocer más sobre sus proyectos.",
  telefono: "+52 81 1772 7272",
  domicilio: "Monterrey, Nuevo León, México",
} as const;

/** Redes sociales. Los tres enlaces los confirmó Altea. */
export const REDES = [
  { nombre: "Facebook", url: "https://www.facebook.com/alteamxof", icono: "facebook" },
  /* Sale de INSTAGRAM_USUARIO para no repetir el handle en dos sitios. */
  { nombre: "Instagram", url: INSTAGRAM_URL, icono: "instagram" },
  {
    /*
     * Sin el `/posts/?viewAsMember=true` que traía el enlace original: es un
     * parámetro de la vista de quien lo copió, no parte de la dirección.
     */
    nombre: "LinkedIn",
    url: "https://www.linkedin.com/company/alteamx/",
    icono: "linkedin",
  },
] as const;

/** Enlace de WhatsApp ya armado, para no repetir el encodeURIComponent. */
export const enlaceWhatsApp = (mensaje: string = CANALES.whatsappMensaje) =>
  `https://wa.me/${CANALES.whatsapp}?text=${encodeURIComponent(mensaje)}`;

/** Las cuatro divisiones, tal como las lista el selector del formulario. */
export const UNIDADES = ["Comercial", "Industrial", "Vivienda", "Forestal"] as const;
export type Unidad = (typeof UNIDADES)[number];

/** Traduce el slug de la URL (?unidad=comercial) al valor del selector. */
export function unidadDesdeSlug(valor: string | string[] | undefined): Unidad | undefined {
  const slug = Array.isArray(valor) ? valor[0] : valor;
  if (!slug) return undefined;
  return UNIDADES.find((unidad) => unidad.toLowerCase() === slug.toLowerCase());
}
