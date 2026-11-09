import { Footer } from "@/app/ui/Footer";
import { Marcas } from "@/app/ui/Marcas";
import { NavBar } from "@/app/ui/NavBar";
import { MOSTRAR_MARCAS } from "@/lib/marcas";
import { CarpetasUnidades } from "./CarpetasUnidades";
import { CarrilProyectos } from "./CarrilProyectos";
import { CierrePuntos } from "./CierrePuntos";
import { CorporateVideo } from "./CorporateVideo";
import { contenidoHome } from "./contenido";
import type { Idioma } from "@/lib/idioma";
import { Emblem } from "./Emblem";
import { FraseCifras } from "./FraseCifras";
import { HeroA } from "./heroA/HeroA";
import { VideoYoutube } from "./VideoYoutube";
import "./home.css";
import "./hero-a.css";
import "./secciones.css";

/**
 * El home, en el idioma que se le pida (noviembre de 2026). Lo montan app/page.tsx
 * en español y app/en/page.tsx en inglés: la composición es una sola.
 */
export function PaginaHome({ idioma = "es" }: { idioma?: Idioma }) {
  const { CONTACT_CTA, VIDEO } = contenidoHome(idioma);
  return (
    <>
      {/* La barra va antes que el hero, aunque el hero sea el primer contenido:
          es sticky, y si se declarara después quedaría anclada bajo los 300svh del
          recorrido — o sea, invisible durante toda la escena, que es justo donde
          tiene que verse flotando. */}
      <NavBar tone="light" transicionIntro />
      {/* El hero anterior, la intro de nubes (<IntroAltea />), salió del
          proyecto el 9 nov 2026 para que pesara menos. Está respaldada, con sus
          imágenes y un README para reusarla, en
          ~/Files/human/respaldos/altea-intro-nubes/, y en el historial de git
          (commit f12798d, el sitio completo con ella). */}
      <HeroA />
      {/*
        El orden de las secciones. Tres de ellas cambiaron de componente y los
        anteriores siguen en _home/ con su ⚠ en home.css:

          <Stats>            → <FraseCifras>      cifras escalonadas, no en rejilla
          <BusinessUnits>    → <CarpetasUnidades> carpetas apiladas, no tarjetas
          <ProyectosPaneles> → <CarrilProyectos>  recorrido horizontal, no bandas

        ⚠ <ProyectosPaneles> SÍ quedó huérfano, al final: cuando se escribió esta
        nota /comercial lo seguía usando para sus próximos proyectos, y el
        rediseño de esa página lo sustituyó por <ProximosComercial>. Hoy no tiene
        consumidores, igual que <HeroUnidad> y <SeccionRelato>.

        Y <WhyAltea> se quitó: iba entre el video y las carpetas, y el home se
        queda sin ella. Lo que ocupaba su hueco está en el comentario de
        .home-carpetas, que heredó el aire que ponía su padding superior.
      */}
      <main>
        <FraseCifras />
        {/* El video completo, de YouTube. Sin `VIDEO.youtube` vuelve el clip
            local en bucle, que sigue entero en <CorporateVideo>. */}
        {VIDEO.youtube ? <VideoYoutube /> : <CorporateVideo />}
        <CarpetasUnidades />
        <Emblem />
        <CarrilProyectos />
        {MOSTRAR_MARCAS &&
          (idioma === "en" ? (
            <Marcas title="Brands operating in our developments" />
          ) : (
            <Marcas />
          ))}
        {/* Últimas publicaciones: oculta hasta tener la API de Instagram o el
            widget. El componente y sus datos siguen en app/ui/Publicaciones.tsx
            y lib/publicaciones.ts — para volver a mostrarla basta con importarla
            y poner <Publicaciones /> aquí. */}
        {/* El cierre del home es <CierrePuntos>, sin foto; /nosotros lleva el
            mismo y las unidades el suyo (<CierreUnidad>). Para devolver el de la
            foto a la izquierda, basta con volver a poner
            <CierreContacto {...CONTACT_CTA} /> en esta línea. */}
        <CierrePuntos eyebrow={CONTACT_CTA.eyebrow} title={CONTACT_CTA.title} />
      </main>
      <Footer idioma={idioma} />
    </>
  );
}
