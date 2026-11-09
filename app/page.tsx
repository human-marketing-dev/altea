import type { Metadata } from "next";
import { PaginaHome } from "./_home/PaginaHome";
import { metadatosDe } from "@/lib/idioma";

/* Antes heredaba el título del layout, «Altea» a secas (9 nov 2026). */
export const metadata: Metadata = metadatosDe("/", "es", {
  title: "Altea Desarrollos — Comercial, industrial, vivienda y forestal",
  description:
    "Inmobiliaria con sólida experiencia y una vasta reserva territorial: proyectos comerciales, industriales, de vivienda y forestales.",
});

/* La composición del home vive en app/_home/PaginaHome.tsx, que comparte con /en. */
export default function Home() {
  return <PaginaHome />;
}
