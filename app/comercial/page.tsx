import type { Metadata } from "next";
import { Footer, LeadCTA, NavBar, Proximamente } from "@/app/ui";

export const metadata: Metadata = {
  title: "Comercial — Altea",
  description:
    "Unidad de negocio Comercial de Altea. Sección en construcción.",
};

export default function Comercial() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Proximamente
          unidad="Comercial"
      lockup="/brand/business-units/altea-comercial-color.svg"
      tagline="Activar la energía de la ciudad en un solo lugar."
        />
      </main>
      <LeadCTA unidadPorDefecto="Comercial" />
      <Footer />
    </>
  );
}
