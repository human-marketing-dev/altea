import type { Metadata } from "next";
import {
  BloquesRevelados,
  Footer,
  HeroUnidad,
  LeadCTA,
  Marcas,
  NavBar,
  ProyectosPaneles,
} from "@/app/ui";
import {
  CANALES_COMERCIAL,
  HERO_COMERCIAL,
  MOSTRAR_MARCAS_COMERCIAL,
  OTROS_GIROS,
  PROXIMOS_PROYECTOS,
} from "../_comercial/content";
import {
  BandaComercial,
  CifrasComercial,
  DescripcionComercial,
} from "../_comercial/SeccionesComercial";
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
        <BandaComercial />
        <CifrasComercial />
        <DescripcionComercial />
        <ShowcasePlazas />
        <BloquesRevelados {...OTROS_GIROS} />
        {MOSTRAR_MARCAS_COMERCIAL && (
          <Marcas title="Marcas que operan en nuestros centros" />
        )}
        <ProyectosPaneles {...PROXIMOS_PROYECTOS} />
      </main>
      <LeadCTA unidadPorDefecto="Comercial" canales={CANALES_COMERCIAL} />
      <Footer />
    </>
  );
}
