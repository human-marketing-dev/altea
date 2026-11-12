import { CANALES, REDES } from "@/lib/contacto";
import { SITIO, rutaDe, type Idioma } from "@/lib/idioma";

/**
 * DATOS ESTRUCTURADOS (JSON-LD) DE ALTEA, en el home (13 nov 2026).
 *
 * No se ven en la página: son para los buscadores. Le dicen a Google, de forma
 * oficial, quién es la empresa —nombre, logo, dominio, redes, teléfono, correo y
 * domicilio— y cómo se llama el sitio. Es lo que alimenta el panel de la empresa
 * y el nombre del sitio en los resultados.
 *
 * Van sólo en el home (/ y /en), que es donde Google los espera para una
 * organización. Los datos salen de lib/contacto.ts, los mismos del pie y de
 * Contacto: si cambia el teléfono o una red, cambia aquí también.
 *
 * Sin `legalName` ni código postal a propósito: la razón social de los legales
 * sigue pendiente y el domicilio no trae código postal. Mejor nada que un dato
 * a medias.
 *
 * Para comprobarlo: https://search.google.com/test/rich-results con la URL del
 * home.
 */
const DESCRIPCION: Record<Idioma, string> = {
  es: "Desarrolladora inmobiliaria integral con sede en Monterrey, Nuevo León, con proyectos comerciales, industriales, de vivienda y forestales.",
  en: "Full-service real estate developer based in Monterrey, Nuevo León, with commercial, industrial, residential and forestry projects.",
};

export function DatosEstructurados({ idioma }: { idioma: Idioma }) {
  const organizacion = `${SITIO}/#organizacion`;
  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizacion,
        name: "Altea Desarrollos",
        alternateName: "Altea",
        url: `${SITIO}/`,
        /* El isotipo en PNG de 180 × 180: Google pide al menos 112 × 112. */
        logo: `${SITIO}/apple-icon.png`,
        description: DESCRIPCION[idioma],
        email: CANALES.correo,
        telephone: CANALES.telefono,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Paricutín 390, Colonia Roma",
          addressLocality: "Monterrey",
          addressRegion: "Nuevo León",
          addressCountry: "MX",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: CANALES.telefono,
          email: CANALES.correo,
          areaServed: "MX",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: REDES.map((r) => r.url),
      },
      {
        "@type": "WebSite",
        "@id": `${SITIO}/#sitio`,
        name: "Altea Desarrollos",
        alternateName: "Altea",
        url: new URL(rutaDe("/", idioma), SITIO).href,
        inLanguage: idioma === "en" ? "en" : "es-MX",
        publisher: { "@id": organizacion },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      /* `<` escapado: un texto con «</script>» no puede cerrar la etiqueta. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
