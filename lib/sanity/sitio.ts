import { DATOS_RESPALDO, type DatosSitio, type RedSitio } from "./sitio-datos";
import { consultar } from "./cliente";

/**
 * LOS DATOS DE CONTACTO DEL SITIO, DESDE SANITY (noviembre de 2026): el
 * documento «Datos de contacto y del sitio» (`ajustesSitio`).
 *
 * Los usa todo el sitio: el pie, los cierres, Contacto, los datos para Google y
 * el error del formulario. En el servidor se leen con `datosSitio()`; los
 * componentes del navegador los reciben del layout por contexto (ver
 * app/ui/SitioContexto.tsx).
 *
 * Lo que falte en Sanity cae a lib/contacto.ts, que se queda como respaldo y
 * para el script de migración.
 */
type AjustesSanity = {
  correo?: string;
  telefono?: string;
  whatsapp?: string;
  whatsappMensaje?: { es?: string; en?: string };
  domicilio?: string;
  mapa?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
};

export async function datosSitio(): Promise<DatosSitio> {
  const a = await consultar<AjustesSanity | null>(`*[_id == "ajustesSitio"][0]`);
  if (!a) throw new Error("Sanity no tiene el documento ajustesSitio.");
  const R = DATOS_RESPALDO;
  /* Las redes en el orden de siempre; una sin dirección no se pinta. */
  const urls: Record<RedSitio["icono"], string | undefined> = {
    facebook: a.facebook,
    instagram: a.instagram,
    linkedin: a.linkedin,
  };
  return {
    correo: a.correo || R.correo,
    telefono: a.telefono || R.telefono,
    whatsapp: a.whatsapp || R.whatsapp,
    whatsappMensaje: {
      es: a.whatsappMensaje?.es || R.whatsappMensaje.es,
      en: a.whatsappMensaje?.en || R.whatsappMensaje.en,
    },
    domicilio: a.domicilio || R.domicilio,
    mapa: a.mapa || R.mapa,
    redes: R.redes
      .map((r) => ({ ...r, url: urls[r.icono] ?? "" }))
      .filter((r) => r.url),
  };
}

export { enlaceTelefono, enlaceWhatsAppDe, type DatosSitio } from "./sitio-datos";
