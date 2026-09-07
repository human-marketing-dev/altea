import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { RevealOnScroll, WhatsAppFab } from "@/app/ui";
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Altea",
  description:
    "Inmobiliaria con sólida experiencia y una vasta reserva territorial: proyectos comerciales, industriales y de vivienda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${brandFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Las dos están en el primer cuadro de la intro: se piden antes de que
            el componente cliente llegue a montarse. El cielo va como
            background-image en el CSS module, así que sin esto ni siquiera
            empieza a descargarse hasta que el navegador resuelve la hoja. */}
        <link
          rel="preload"
          as="image"
          href="/hero/background-cloud-altea-hero.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/hero/edificio-altea-home.webp"
          type="image/webp"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppFab />
        <RevealOnScroll />
      </body>
    </html>
  );
}
