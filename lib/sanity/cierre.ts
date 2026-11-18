import { contenidoHome } from "@/app/_home/contenido";
import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";

/**
 * EL CIERRE «TRABAJEMOS JUNTOS» DESDE SANITY (noviembre de 2026): el documento
 * «Cierre de las páginas». El home, Nosotros y las unidades usan su rótulo; el
 * título, el home y Nosotros (las unidades llevan el suyo, en cada Unidad).
 * La imagen es diseño y sigue en el código.
 */
type Bi = { es?: string; en?: string };

export async function cierreSitio(idioma: Idioma) {
  const base = contenidoHome(idioma).CONTACT_CTA;
  const c = await consultar<{ rotulo?: Bi; titulo?: Bi } | null>(`*[_id == "cierre"][0]{ rotulo, titulo }`);
  const t = (v?: Bi) => (idioma === "en" ? v?.en || v?.es : v?.es) || undefined;
  return { ...base, eyebrow: t(c?.rotulo) ?? base.eyebrow, title: t(c?.titulo) ?? base.title };
}
