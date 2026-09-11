import { Footer, IntroAltea, LeadCTA, Marcas, NavBar } from "@/app/ui";
import { MOSTRAR_MARCAS } from "@/lib/marcas";
import { BusinessUnits } from "./_home/BusinessUnits";
import { ContactCTA } from "./_home/ContactCTA";
import { CorporateVideo } from "./_home/CorporateVideo";
import { Emblem } from "./_home/Emblem";
import { FeaturedProjects } from "./_home/FeaturedProjects";
import { Stats } from "./_home/Stats";
import { WhyAltea } from "./_home/WhyAltea";
import "./_home/home.css";

export default function Home() {
  return (
    <>
      {/* La barra va antes que la intro, aunque la intro sea el primer
          contenido: es sticky, y si se declarara después quedaría anclada bajo
          los 550vh del recorrido — o sea, invisible durante toda la escena, que
          es justo donde tiene que verse flotando. */}
      <NavBar tone="light" transicionIntro />
      <IntroAltea />
      <main>
        <Stats />
        <CorporateVideo />
        <WhyAltea />
        <BusinessUnits />
        <Emblem />
        <FeaturedProjects />
        <ContactCTA />
        {MOSTRAR_MARCAS && <Marcas />}
        {/* Últimas publicaciones: oculta hasta tener la API de Instagram o el
            widget. El componente y sus datos siguen en app/ui/Publicaciones.tsx
            y lib/publicaciones.ts — para volver a mostrarla basta con importarla
            y poner <Publicaciones /> aquí. */}
        <LeadCTA />
      </main>
      <Footer />
    </>
  );
}
