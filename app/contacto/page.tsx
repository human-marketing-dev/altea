import type { Metadata } from "next";
import { PaginaContacto } from "../_contacto/PaginaContacto";
import { emitirFicha } from "@/lib/antispam";
import { unidadDesdeSlug } from "@/lib/contacto";
import { metadatosDe } from "@/lib/idioma";

export const metadata: Metadata = metadatosDe("/contacto", "es", {
  title: "Contacto — Altea",
  description:
    "Escríbenos para revisar superficie, ubicación y tiempos de tu proyecto comercial, industrial, de vivienda o forestal.",
});

/* La composición vive en app/_contacto/PaginaContacto.tsx, que comparte con /en. */
export default async function Contacto({ searchParams }: PageProps<"/contacto">) {
  const { unidad } = await searchParams;
  /* La ficha antispam: una por petición, firmada con la hora. Ver lib/antispam.ts. */
  return <PaginaContacto unidadPorDefecto={unidadDesdeSlug(unidad)} ficha={emitirFicha()} />;
}
