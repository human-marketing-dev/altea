import type { Metadata } from "next";
import { PaginaNosotros } from "../_nosotros/PaginaNosotros";
import { metadatosDe } from "@/lib/idioma";
import { metaNosotros } from "@/lib/sanity/nosotros";

/* El título y la descripción para Google vienen de Sanity; éstos son el respaldo. */
const RESPALDO = {
  title: "Nosotros — Altea",
  description:
    "Con presencia en 21 estados de México, Estados Unidos, España y Costa Rica, Altea impulsa desarrollos que se vuelven parte de entornos vivos, dinámicos y duraderos.",
};

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaNosotros("es");
  return metadatosDe("/nosotros", "es", {
    title: m.title || RESPALDO.title,
    description: m.description || RESPALDO.description,
  });
}

/* La composición vive en app/_nosotros/PaginaNosotros.tsx, que comparte con /en. */
export default function Nosotros() {
  return <PaginaNosotros />;
}
