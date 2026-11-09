import type { Metadata } from "next";
import { PaginaNosotros } from "@/app/_nosotros/PaginaNosotros";
import { metadatosDe } from "@/lib/idioma";

export const metadata: Metadata = metadatosDe("/nosotros", "en", {
  title: "About us — Altea",
  description:
    "With a presence in 21 states of Mexico, the United States, Spain and Costa Rica, Altea delivers developments that become part of vibrant, dynamic and enduring environments.",
});

export default function AboutUs() {
  return <PaginaNosotros idioma="en" />;
}
