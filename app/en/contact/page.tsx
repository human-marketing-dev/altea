import type { Metadata } from "next";
import { PaginaContacto } from "@/app/_contacto/PaginaContacto";
import { emitirFicha } from "@/lib/antispam";
import { unidadDesdeSlug } from "@/lib/contacto";
import { metadatosDe } from "@/lib/idioma";
import { textosContacto } from "@/lib/sanity/contacto";

/* El título y la descripción para Google vienen de Sanity; éstos son el respaldo. */
const RESPALDO = {
  title: "Contact — Altea",
  description:
    "Write to us to review the area, location and timeline of your commercial, industrial, residential or forestry project.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await textosContacto("en");
  return metadatosDe("/contacto", "en", {
    title: t.metaTitulo || RESPALDO.title,
    description: t.metaDescripcion || RESPALDO.description,
  });
}

export default async function ContactEn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { unidad } = await searchParams;
  return (
    <PaginaContacto
      idioma="en"
      unidadPorDefecto={unidadDesdeSlug(unidad)}
      ficha={emitirFicha()}
      editables={await textosContacto("en")}
    />
  );
}
