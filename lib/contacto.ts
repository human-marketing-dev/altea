/**
 * Datos y copy de contacto. Fuente única: los consumen el CTA de la portada,
 * el bloque de captación de todas las páginas y la página /contacto.
 *
 * PENDIENTE: nada de esto está confirmado por Altea — correo, teléfono,
 * WhatsApp y domicilio son provisionales.
 */

import { INSTAGRAM_URL } from "./publicaciones";

export const CONTACTO = {
  eyebrow: "Contacto",
  title: "Cuéntanos qué quieres construir",
  description:
    "Déjanos tus datos y un asesor te contacta para revisar superficie, ubicación y tiempos de tu proyecto.",
  /** Cada línea con el icono que le toca; el texto sale de CANALES. */
  datos: [
    { texto: "ventas@altea.mx", icono: "correo" },
    { texto: "Saltillo, Coahuila, México", icono: "ubicacion" },
  ],
} as const;

export const CANALES = {
  correo: "ventas@altea.mx",
  /** En formato E.164 sin signos, como lo pide wa.me. */
  whatsapp: "528110000000",
  whatsappMensaje: "Hola Altea, me interesa conocer más sobre sus proyectos.",
  telefono: "+52 81 1000 0000",
  domicilio: "Saltillo, Coahuila, México",
} as const;

/**
 * Redes sociales.
 *
 * PENDIENTE: sólo hay una, y la cuenta NO está confirmada — sale de
 * INSTAGRAM_USUARIO en lib/publicaciones.ts, que está marcado ahí mismo como
 * dato que Altea todavía no entregó. Agregar el resto es una línea por red y su
 * icono en ICONOS_RED.
 */
export const REDES = [
  { nombre: "Instagram", url: INSTAGRAM_URL, icono: "instagram" },
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
