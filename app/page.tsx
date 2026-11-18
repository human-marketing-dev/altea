import type { Metadata } from "next";
import { PaginaHome } from "./_home/PaginaHome";
import { metadatosDe } from "@/lib/idioma";
import { metaHome } from "@/lib/sanity/home";

/* Antes heredaba el título del layout, «Altea» a secas (9 nov 2026). */
/* El título y la descripción para Google vienen de Sanity; éstos son el respaldo. */
const RESPALDO = {
  title: "Altea Desarrollos — Comercial, industrial, vivienda y forestal",
  description:
    "Inmobiliaria con sólida experiencia y una vasta reserva territorial: proyectos comerciales, industriales, de vivienda y forestales.",
};

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaHome("es");
  return metadatosDe("/", "es", {
    title: m.title || RESPALDO.title,
    description: m.description || RESPALDO.description,
  });
}

/* La composición del home vive en app/_home/PaginaHome.tsx, que comparte con /en. */
export default function Home() {
  return <PaginaHome />;
}
