import type { Metadata } from "next";
import { PaginaNosotros } from "../_nosotros/PaginaNosotros";
import { metadatosDe } from "@/lib/idioma";

export const metadata: Metadata = metadatosDe("/nosotros", "es", {
  title: "Nosotros — Altea",
  description:
    "Con presencia en 21 estados de México, Estados Unidos, España y Costa Rica, Altea impulsa desarrollos que se vuelven parte de entornos vivos, dinámicos y duraderos.",
});

/* La composición vive en app/_nosotros/PaginaNosotros.tsx, que comparte con /en. */
export default function Nosotros() {
  return <PaginaNosotros />;
}
