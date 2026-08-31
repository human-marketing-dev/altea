/**
 * Datos y copy de contacto. Fuente única: los consumen el CTA de la portada,
 * el bloque de captación de todas las páginas y la página /contacto.
 *
 * PENDIENTE: nada de esto está confirmado por Altea — correo, teléfono,
 * WhatsApp y domicilio son provisionales.
 */

export const CONTACTO = {
  eyebrow: "Contacto",
  title: "Cuéntanos qué quieres construir",
  description:
    "Déjanos tus datos y un asesor te contacta para revisar superficie, ubicación y tiempos de tu proyecto.",
  datos: ["ventas@altea.mx", "Saltillo, Coahuila, México"],
} as const;

export const CANALES = {
  correo: "ventas@altea.mx",
  /** En formato E.164 sin signos, como lo pide wa.me. */
  whatsapp: "528110000000",
  whatsappMensaje: "Hola Altea, me interesa conocer más sobre sus proyectos.",
  telefono: "+52 81 1000 0000",
  domicilio: "Saltillo, Coahuila, México",
} as const;

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
