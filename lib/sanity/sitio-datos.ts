import { CANALES, MENSAJE_WHATSAPP, REDES } from "@/lib/contacto";
import type { Idioma } from "@/lib/idioma";

/**
 * Los datos de contacto del sitio: el tipo, el respaldo y los enlaces. Aparte de
 * sitio.ts para que los componentes del navegador los usen sin cargar el
 * cliente de Sanity. Ver lib/sanity/sitio.ts.
 */
export type RedSitio = { nombre: string; url: string; icono: "facebook" | "instagram" | "linkedin" };

export type DatosSitio = {
  correo: string;
  telefono: string;
  /** Sólo dígitos, con lada de país: lo que va en wa.me. */
  whatsapp: string;
  whatsappMensaje: Record<Idioma, string>;
  domicilio: string;
  mapa: string;
  redes: RedSitio[];
};

/** Los de lib/contacto.ts: el respaldo, y el valor del contexto si nadie lo pone. */
export const DATOS_RESPALDO: DatosSitio = {
  correo: CANALES.correo,
  telefono: CANALES.telefono,
  whatsapp: CANALES.whatsapp,
  whatsappMensaje: { ...MENSAJE_WHATSAPP },
  domicilio: CANALES.domicilio,
  mapa: CANALES.mapa,
  redes: REDES.map((r) => ({ ...r })) as RedSitio[],
};

/** El enlace de WhatsApp con el mensaje inicial en el idioma de la página. */
export const enlaceWhatsAppDe = (d: DatosSitio, idioma: Idioma, mensaje?: string) =>
  `https://wa.me/${d.whatsapp}?text=${encodeURIComponent(mensaje ?? d.whatsappMensaje[idioma])}`;

/** El enlace para marcar: sin espacios. */
export const enlaceTelefono = (telefono: string) => `tel:${telefono.replace(/\s/g, "")}`;
