import type { Metadata } from "next";
import localFont from "next/font/local";
import { RevealOnScroll } from "@/app/ui/RevealOnScroll";
import { GoogleTag } from "./GoogleTag";
import { SITIO } from "@/lib/idioma";
import "./globals.css";

/**
 * Tipografía de marca: Gotham, como especifica el manual de identidad.
 *
 * ⚠ SOLO PARA LA MAQUETA LOCAL. Estos archivos no tienen licencia web. Antes de
 * desplegar esto a cualquier dominio, Altea tiene que comprar la licencia web de
 * Gotham en typography.com y reemplazar los .woff2 por los suyos. Los archivos
 * están fuera de git a propósito (ver .gitignore) para que no viajen con el
 * repo — si el build falla en otra máquina por fuentes faltantes, es la señal.
 *
 * El manual usa dos pesos y nada más: Medium para cuerpo, Bold para display.
 * El sistema pide 600 en algunos lados (títulos de sección, botones, tags); sin
 * un Semibold real el navegador sube a Bold, así que esos elementos se ven algo
 * más contundentes que con Montserrat.
 */
const brandFont = localFont({
  variable: "--font-brand",
  display: "swap",
  fallback: ["Montserrat", "-apple-system", "Segoe UI", "sans-serif"],
  src: [
    { path: "./fonts/Gotham-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Gotham-Bold.woff2", weight: "700", style: "normal" },
  ],
});

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
      className={`${brandFont.variable} h-full antialiased`}
    >
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
