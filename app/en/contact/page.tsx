import type { Metadata } from "next";
import { PaginaContacto } from "@/app/_contacto/PaginaContacto";
import { emitirFicha } from "@/lib/antispam";
import { unidadDesdeSlug } from "@/lib/contacto";
import { metadatosDe } from "@/lib/idioma";

export const metadata: Metadata = metadatosDe("/contacto", "en", {
  title: "Contact — Altea",
  description:
    "Write to us to review the area, location and timeline of your commercial, industrial, residential or forestry project.",
});

export default async function ContactEn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { unidad } = await searchParams;
  return (
    <PaginaContacto idioma="en" unidadPorDefecto={unidadDesdeSlug(unidad)} ficha={emitirFicha()} />
  );
}
