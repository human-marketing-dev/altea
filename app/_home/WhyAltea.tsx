import { SectionHeading } from "@/app/ui";
import { WHY_ALTEA } from "./content";

/** Responde: ¿por qué confiar y hacer alianzas con Altea? */
export function WhyAltea() {
  return (
    <section className="home-why">
      <SectionHeading eyebrow={WHY_ALTEA.eyebrow} title={WHY_ALTEA.title} />
      <div className="home-why__body">
        {WHY_ALTEA.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
