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
          ratio="4 / 3"
          sizes="(max-width: 900px) 100vw, 40vw"
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
