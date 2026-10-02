import type { Metadata } from "next";
import { CONTACT_CTA } from "@/app/_home/content";
import { CierreContacto, Footer, NavBar } from "@/app/ui";
import { HeroCalado } from "../_comercial/HeroCalado";
import { IndicePlazas } from "../_comercial/IndicePlazas";
import { Modelo } from "../_comercial/Modelo";
import { MuroMarcas } from "../_comercial/MuroMarcas";
import { OtrosGiros } from "../_comercial/OtrosGiros";
import { ProximosComercial } from "../_comercial/ProximosComercial";
import { MOSTRAR_MARCAS_COMERCIAL } from "../_comercial/content";
import "../_comercial/comercial.css";

export const metadata: Metadata = {
  title: "Comercial — Altea",
  description:
    "Centros comerciales de Altea: ocho plazas en operación en cinco estados, con hoteles, hospital y educación dentro de los mismos desarrollos.",
};

export default function Comercial() {
  return (
    <>
      {/* El `aria-current` de Comercial lo pone <NavBar> comparando el enlace con
          usePathname: no hay que pasarlo. */}
      <NavBar tone="light" />
      <main>
        <HeroCalado />
        <Modelo />
        <IndicePlazas />
        <OtrosGiros />
        {MOSTRAR_MARCAS_COMERCIAL && <MuroMarcas />}
        <ProximosComercial />
      </main>
      <CierreContacto {...CONTACT_CTA} unidad="Comercial" />
      <Footer />
    </>
  );
}
