import type { Metadata } from "next";
import { Footer, LeadCTA, NavBar, Proximamente } from "@/app/ui";

export const metadata: Metadata = {
  title: "Forestal — Altea",
  description:
    "Unidad de negocio Forestal de Altea. Sección en construcción.",
};

export default function Forestal() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Proximamente
          unidad="Forestal"
        />
      </main>
      <LeadCTA unidadPorDefecto="Forestal" />
      <Footer />
    </>
  );
}
