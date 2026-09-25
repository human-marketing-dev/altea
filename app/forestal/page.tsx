import type { Metadata } from "next";
import { CONTACT_CTA } from "@/app/_home/content";
import { Footer, CierreContacto, NavBar, Proximamente } from "@/app/ui";

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
      <CierreContacto {...CONTACT_CTA} unidad="Forestal" />
      <Footer />
    </>
  );
}
