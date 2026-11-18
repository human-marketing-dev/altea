import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";

/**
 * LOS TEXTOS DE /contacto DESDE SANITY (noviembre de 2026).
 *
 * Sólo los textos de la página; los datos de contacto (correo, teléfono,
 * WhatsApp, domicilio) son de «Datos de contacto y del sitio» y los usa todo el
 * sitio. Lo que falte en Sanity cae al texto de hoy, que pasa la página.
 */
type Bi = { es?: string; en?: string };
type ContactoSanity = {
  titulo?: Bi;
  descripcion?: Bi;
  textoWhatsapp?: Bi;
  exitoTitulo?: Bi;
  exitoTexto?: Bi;
  metaTitulo?: Bi;
  metaDescripcion?: Bi;
};

export type TextosContacto = {
  titulo?: string;
  descripcion?: string;
  textoWhatsapp?: string;
  exitoTitulo?: string;
  exitoTexto?: string;
  metaTitulo?: string;
  metaDescripcion?: string;
};

export async function textosContacto(idioma: Idioma): Promise<TextosContacto> {
  const d = await consultar<ContactoSanity | null>(`*[_id == "paginaContacto"][0]`);
  if (!d) throw new Error("Sanity no tiene el documento paginaContacto.");
  const t = (v?: Bi) => (idioma === "en" ? v?.en || v?.es : v?.es) || undefined;
  return {
    titulo: t(d.titulo),
    descripcion: t(d.descripcion),
    textoWhatsapp: t(d.textoWhatsapp),
    exitoTitulo: t(d.exitoTitulo),
    exitoTexto: t(d.exitoTexto),
    metaTitulo: t(d.metaTitulo),
    metaDescripcion: t(d.metaDescripcion),
  };
}
