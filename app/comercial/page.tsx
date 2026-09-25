import type { Metadata } from "next";
import { CONTACT_CTA } from "@/app/_home/content";
import {
  Footer,
  HeroUnidad,
  CierreContacto,
  Marcas,
  NavBar,
  ProyectosPaneles,
  SeccionRelato,
} from "@/app/ui";
import {
  DESCRIPCION_COMERCIAL,
  HERO_COMERCIAL,
  MOSTRAR_MARCAS_COMERCIAL,
  PROXIMOS_PROYECTOS,
} from "../_comercial/content";
import { BandaGiros } from "../_comercial/BandaGiros";
import { CifrasComercial } from "../_comercial/SeccionesComercial";
import { ShowcasePlazas } from "../_comercial/ShowcasePlazas";
import "../_comercial/comercial.css";

export const metadata: Metadata = {
  title: "Comercial — Altea",
  description:
    "Centros comerciales de Altea: siete plazas en operación en cinco estados, con hoteles, hospital y educación dentro de los mismos desarrollos.",
};

export default function Comercial() {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <HeroUnidad {...HERO_COMERCIAL} />
        <CifrasComercial />
        <SeccionRelato {...DESCRIPCION_COMERCIAL} />
        <ShowcasePlazas />
        <BandaGiros />
        {MOSTRAR_MARCAS_COMERCIAL && (
          <Marcas title="Marcas que operan en nuestros centros" />
        )}
        <ProyectosPaneles {...PROXIMOS_PROYECTOS} />
      </main>
      <CierreContacto {...CONTACT_CTA} unidad="Comercial" />
      <Footer />
    </>
  );
}
