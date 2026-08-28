import type { Metadata } from "next";
import { Footer, NavBar } from "@/app/ui";
import { Banner } from "../_nosotros/Banner";
import { Huella } from "../_nosotros/Huella";
import { Origen } from "../_nosotros/Origen";
import { QueHacemosIntro } from "../_nosotros/QueHacemosIntro";
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
        {/* Pendientes del sitemap: 5. Qué hacemos (3 secciones) · 6. CTA
            · 7. Responsabilidad social */}
      </main>
      <Footer />
    </>
  );
}
