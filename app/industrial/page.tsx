import type { Metadata } from "next";
import { Footer, LeadCTA, NavBar, Proximamente } from "@/app/ui";

export const metadata: Metadata = {
  title: "Industrial — Altea",
  description:
    "Unidad de negocio Industrial de Altea. Sección en construcción.",
};

export default function Industrial() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Proximamente
          unidad="Industrial"
      lockup="/brand/business-units/altea-industrial-color.svg"
      tagline="Desarrollar infraestructura con visión de futuro."
        />
      </main>
      <LeadCTA unidadPorDefecto="Industrial" />
      <Footer />
    </>
  );
}
