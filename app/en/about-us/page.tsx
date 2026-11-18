import type { Metadata } from "next";
import { PaginaNosotros } from "@/app/_nosotros/PaginaNosotros";
import { metadatosDe } from "@/lib/idioma";
import { metaNosotros } from "@/lib/sanity/nosotros";

/* El título y la descripción para Google vienen de Sanity; éstos son el respaldo. */
const RESPALDO = {
  title: "About us — Altea",
  description:
    "With a presence in 21 states of Mexico, the United States, Spain and Costa Rica, Altea delivers developments that become part of vibrant, dynamic and enduring environments.",
};

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaNosotros("en");
  return metadatosDe("/nosotros", "en", {
    title: m.title || RESPALDO.title,
    description: m.description || RESPALDO.description,
  });
}

export default function AboutUs() {
  return <PaginaNosotros idioma="en" />;
}
