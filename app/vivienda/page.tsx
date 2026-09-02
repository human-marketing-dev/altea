import type { Metadata } from "next";
import { Footer, LeadCTA, NavBar, Proximamente } from "@/app/ui";

export const metadata: Metadata = {
  title: "Vivienda — Altea",
  description:
    "Unidad de negocio Vivienda de Altea. Sección en construcción.",
};

export default function Vivienda() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Proximamente
          unidad="Vivienda"
      lockup="/brand/business-units/altea-vivienda-color.svg"
      tagline="Crear hogares donde comienza tu historia."
        />
      </main>
      <LeadCTA unidadPorDefecto="Vivienda" />
      <Footer />
    </>
  );
}
