import type { Metadata } from "next";
import { PaginaHome } from "@/app/_home/PaginaHome";
import { metadatosDe } from "@/lib/idioma";
import { metaHome } from "@/lib/sanity/home";

/* El título y la descripción para Google vienen de Sanity; éstos son el respaldo. */
const RESPALDO = {
  title: "Altea Desarrollos — Commercial, industrial, residential and forestry",
  description:
    "Real estate developer with extensive experience and a substantial land bank: commercial, industrial, residential and forestry projects.",
};

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaHome("en");
  return metadatosDe("/", "en", {
    title: m.title || RESPALDO.title,
    description: m.description || RESPALDO.description,
  });
}

export default function HomeEn() {
  return <PaginaHome idioma="en" />;
}
