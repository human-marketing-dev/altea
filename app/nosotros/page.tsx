import type { Metadata } from "next";
import { Footer, LeadCTA, Marcas, NavBar, Publicaciones } from "@/app/ui";
import { Banner } from "../_nosotros/Banner";
import { Huella } from "../_nosotros/Huella";
import { Origen } from "../_nosotros/Origen";
import { QueHacemosIntro } from "../_nosotros/QueHacemosIntro";
import { ResponsabilidadSocial } from "../_nosotros/ResponsabilidadSocial";
import { SeccionAngulada } from "../_nosotros/SeccionAngulada";
import { QUE_HACEMOS } from "../_nosotros/content";
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
        <QueHacemosIntro />
        {/* 5. Qué hacemos */}
        {QUE_HACEMOS.map((bloque) => (
          <SeccionAngulada key={bloque.id} bloque={bloque} />
        ))}
        {/* 7. Responsabilidad social */}
        <ResponsabilidadSocial />
        <Marcas />
        <Publicaciones />
        {/* 6. CTA — va al final para que cierre la página, como en el resto
            del sitio. */}
        <LeadCTA />
      </main>
      <Footer />
    </>
  );
}
