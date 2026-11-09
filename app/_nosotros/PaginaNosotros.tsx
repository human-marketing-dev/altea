import { Footer } from "@/app/ui/Footer";
import { NavBar } from "@/app/ui/NavBar";
import { CierrePuntos } from "@/app/_home/CierrePuntos";
import { contenidoHome } from "@/app/_home/contenido";
import type { Idioma } from "@/lib/idioma";
import { GrupoFirma } from "./GrupoFirma";
import { HeroNube } from "./HeroNube";
import { Huella } from "./Huella";
import { Origen } from "./Origen";
import { Pilares } from "./Pilares";
import { ResponsabilidadSocial } from "./ResponsabilidadSocial";
import "./nosotros.css";


/**
 * /nosotros en el idioma que se le pida (noviembre de 2026). Lo montan
 * app/nosotros/page.tsx y app/en/about-us/page.tsx.
 */
export function PaginaNosotros({ idioma = "es" }: { idioma?: Idioma }) {
  const { CONTACT_CTA } = contenidoHome(idioma);
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
        <Pilares idioma={idioma} />
        <GrupoFirma idioma={idioma} />
        <Huella idioma={idioma} />
        <ResponsabilidadSocial idioma={idioma} />
        {/* El cierre del home, el de la banderola de puntos (octubre de 2026).
            Para volver al de la foto: <CierreContacto {...CONTACT_CTA} />,
            fuera de <main>, como estaba. */}
        <CierrePuntos eyebrow={CONTACT_CTA.eyebrow} title={CONTACT_CTA.title} />
      </main>
      <Footer idioma={idioma} />
    </>
  );
}
