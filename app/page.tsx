import { CierreContacto, Footer, Marcas, NavBar } from "@/app/ui";
import { MOSTRAR_MARCAS } from "@/lib/marcas";
import { CarpetasUnidades } from "./_home/CarpetasUnidades";
import { CarrilProyectos } from "./_home/CarrilProyectos";
import { CorporateVideo } from "./_home/CorporateVideo";
import { CONTACT_CTA } from "./_home/content";
import { Emblem } from "./_home/Emblem";
import { FraseCifras } from "./_home/FraseCifras";
import { HeroA } from "./_home/heroA/HeroA";
import "./_home/home.css";
import "./_home/hero-a.css";
import "./_home/secciones.css";

export default function Home() {
  return (
    <>
      {/* La barra va antes que el hero, aunque el hero sea el primer contenido:
          es sticky, y si se declarara después quedaría anclada bajo los 300svh del
          recorrido — o sea, invisible durante toda la escena, que es justo donde
          tiene que verse flotando. */}
      <NavBar tone="light" transicionIntro />
      {/* El hero anterior, <IntroAltea />, sigue intacto en app/ui/intro/: para
          volver a él se cambian estas dos líneas y su import, nada más. Ver la
          nota del reporte sobre por qué NO conviven los dos. */}
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
        <CorporateVideo />
        <CarpetasUnidades />
        <Emblem />
        <CarrilProyectos />
        {MOSTRAR_MARCAS && <Marcas />}
        {/* Últimas publicaciones: oculta hasta tener la API de Instagram o el
            widget. El componente y sus datos siguen en app/ui/Publicaciones.tsx
            y lib/publicaciones.ts — para volver a mostrarla basta con importarla
            y poner <Publicaciones /> aquí. */}
        <CierreContacto {...CONTACT_CTA} />
      </main>
      <Footer />
    </>
  );
}
