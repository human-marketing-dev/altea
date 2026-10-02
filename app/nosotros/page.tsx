import type { Metadata } from "next";
import { CierreContacto, Footer, NavBar } from "@/app/ui";
import { CONTACT_CTA } from "@/app/_home/content";
import { GrupoFirma } from "../_nosotros/GrupoFirma";
import { HeroNube } from "../_nosotros/HeroNube";
import { Huella } from "../_nosotros/Huella";
import { Origen } from "../_nosotros/Origen";
import { Pilares } from "../_nosotros/Pilares";
import { QuienesSomos } from "../_nosotros/QuienesSomos";
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
      {/*
        La misma barra del home, pero SIN transicionIntro: aquí es `sticky` y
        ocupa su hueco, que es lo que mantiene el aire sobre el hero. El prop sólo
        lo pasa el home, donde el hero tiene que empezar en la coordenada 0.

        El aspecto —cápsula, velo a los 24px, esconderse al bajar— es el mismo en
        las siete rutas y no depende de nada que la página tenga que pasar.
      */}
      <NavBar tone="light" />
      <main>
        <HeroNube />
        <Origen />
        <GrupoFirma />
        <Huella />
        <Pilares />
        <QuienesSomos />
        <ResponsabilidadSocial />
      </main>
      <CierreContacto {...CONTACT_CTA} />
      <Footer />
    </>
  );
}
