import type { Metadata } from "next";
import { RevealOnScroll } from "@/app/ui/RevealOnScroll";
import { GoogleTag } from "./GoogleTag";
import { SITIO } from "@/lib/idioma";
import "./globals.css";

/**
 * TIPOGRAFÍA DE MARCA: GOTHAM, DESDE ADOBE FONTS (9 nov 2026).
 *
 * Con licencia, por el proyecto web `egf6btn` de Adobe Fonts. Las fuentes de
 * Adobe no se alojan en el servidor: las sirve Adobe desde use.typekit.net con
 * su hoja de estilos, que declara la familia "gotham". Por eso ya no hay .woff2
 * en el repo ni next/font: los archivos que había no tenían licencia web y se
 * quitaron.
 *
 * El manual usa dos pesos: Medium (500) para el texto y Bold (700) para los
 * títulos. El proyecto web trae más (Book, Light, itálicas y las versiones
 * Narrow y Condensed), pero el navegador sólo descarga los que la página usa.
 * Lo que pide 600 cae en Bold, como antes.
 *
 * ⚠ LA LICENCIA VA ATADA A LA SUSCRIPCIÓN DE CREATIVE CLOUD que creó el
 * proyecto. Si se cancela, el sitio deja de mostrar Gotham y cae a la de
 * respaldo (-apple-system / Segoe UI), sin dar error. Si se cambia de proyecto,
 * cambia el ID de la URL de abajo y nada más: la familia se sigue llamando
 * "gotham" (ver --font-brand en globals.css).
 */
const ADOBE_FONTS = "https://use.typekit.net/egf6btn.css";

export const metadata: Metadata = {
  /*
   * El dominio de producción: con él Next vuelve absolutas la canónica, los
   * `hreflang` y la imagen de vista previa (9 nov 2026). Sin él salían
   * relativos, y Google ignora los `hreflang` relativos. Ver SITIO.
   */
  metadataBase: new URL(SITIO),
  title: "Altea",
  description:
    "Inmobiliaria con sólida experiencia y una vasta reserva territorial: proyectos comerciales, industriales y de vivienda.",
  /*
   * NO INDEXABLE, Y HAY QUE QUITARLO PARA PUBLICAR.
   *
   * Venía de un layout propio en app/plantilla/, que marcaba solo ese subárbol;
   * al mover el sitio a la raíz el subárbol desapareció y la marca subió aquí,
   * donde cubre todas las rutas por herencia: cualquier página emite
   * `<meta name="robots" content="noindex, nofollow">` sin repetirlo en su propio
   * `metadata`, y una página nueva queda cubierta por el mero hecho de nacer.
   *
   * El `nofollow` impide además que un rastreador siga los enlaces internos y
   * vaya descubriendo el resto de las rutas.
   *
   * Es la red, no el cinturón: el bloqueo de verdad está en app/robots.ts, y los
   * dos se quitan juntos. Ver el comentario de ese archivo.
   */
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className="h-full antialiased"
    >
      <head>
        {/* La conexión con el servidor de las fuentes se abre ya, en paralelo
            con la hoja; `crossOrigin` porque las fuentes se piden con CORS. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={ADOBE_FONTS} />
      </head>
      {/*
        Aquí había dos <link rel="preload"> de la intro —el cielo y el edificio,
        1.67 MB— que se pedían con prioridad alta en TODAS las páginas. La intro
        ya no se monta en ninguna (salió del proyecto; ver PaginaHome), así que
        competían con la foto principal de cada página por nada. Si vuelve, que
        vuelvan con ella.
      */}
      <body className="min-h-full flex flex-col">
        {children}
        <RevealOnScroll />
        <GoogleTag />
      </body>
    </html>
  );
}
