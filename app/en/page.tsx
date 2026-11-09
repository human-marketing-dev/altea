import type { Metadata } from "next";
import { PaginaHome } from "@/app/_home/PaginaHome";
import { metadatosDe } from "@/lib/idioma";

export const metadata: Metadata = metadatosDe("/", "en", {
  title: "Altea Desarrollos — Commercial, industrial, residential and forestry",
  description:
    "Real estate developer with extensive experience and a substantial land bank: commercial, industrial, residential and forestry projects.",
});

export default function HomeEn() {
  return <PaginaHome idioma="en" />;
}
