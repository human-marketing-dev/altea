import type { Metadata } from "next";
import { BloquesRevelados, Footer, LeadCTA, Marcas, NavBar } from "@/app/ui";
import { MOSTRAR_MARCAS } from "@/lib/marcas";
import {
  MOSTRAR_QUE_HACEMOS_INTRO,
  QUIENES_SOMOS,
} from "../_nosotros/content";
import { Banner } from "../_nosotros/Banner";
import { Huella } from "../_nosotros/Huella";
import { Origen } from "../_nosotros/Origen";
import { QueHacemosIntro } from "../_nosotros/QueHacemosIntro";
import { ResponsabilidadSocial } from "../_nosotros/ResponsabilidadSocial";
import "../_nosotros/nosotros.css";

export const metadata: Metadata = {
  title: "Nosotros — Altea",
  description:
    "Con presencia en 21 estados de México, Estados Unidos, España y Costa Rica, Altea impulsa desarrollos que se vuelven parte de entornos vivos, dinámicos y duraderos.",
};

export default function Nosotros() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <Banner />
        <Origen />
        <Huella />
        {MOSTRAR_QUE_HACEMOS_INTRO && <QueHacemosIntro />}
        {/* 5. Quiénes somos */}
        <BloquesRevelados {...QUIENES_SOMOS} />
        {/* 7. Responsabilidad social */}
        <ResponsabilidadSocial />
        {MOSTRAR_MARCAS && <Marcas />}
        {/* Últimas publicaciones: oculta hasta tener la API de Instagram o el
            widget. El componente y sus datos siguen en app/ui/Publicaciones.tsx
            y lib/publicaciones.ts — para volver a mostrarla basta con importarla
            y poner <Publicaciones /> aquí. */}
        {/* 6. CTA — va al final para que cierre la página, como en el resto
            del sitio. */}
        <LeadCTA />
      </main>
      <Footer />
    </>
  );
}
