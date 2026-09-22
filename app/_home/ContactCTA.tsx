import { MediaSlot, SectionHeading } from "@/app/ui";
import { enlaceWhatsApp } from "@/lib/contacto";
import { CONTACT_CTA } from "./content";

/** Bloque de contacto con salida directa a WhatsApp. */
export function ContactCTA() {
  const href = enlaceWhatsApp();

  return (
    <section className="home-cta">
      <div className="home-cta__media">
        <MediaSlot
          label="Imagen de sección"
          src={CONTACT_CTA.image}
          alt=""
          tone="dark"
          /* La proporción exacta del archivo (2430×2475). Con el 4/3 anterior,
             `cover` se comía un 26% del alto — y el recorte llega hasta el borde
             superior e inferior, así que cortaba al sujeto. Así no recorta nada. */
          ratio="2430 / 2475"
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>
      <div className="home-cta__body">
        <SectionHeading
          tone="light"
          eyebrow={CONTACT_CTA.eyebrow}
          title={CONTACT_CTA.title}
          description={CONTACT_CTA.description}
        />
        <a
          className="altea-btn altea-btn--primary altea-btn--lg"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contáctanos por WhatsApp
          <span className="altea-btn__arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
