import { Button, MediaSlot } from "@/app/ui";
import { HERO } from "./content";

/**
 * Banner de portada: las tres palabras de la marca a la izquierda y el collage
 * de divisiones (pendiente) al fondo.
 */
export function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero__media" aria-hidden="true">
        <MediaSlot
          label={HERO.bannerNote}
          src={HERO.image}
          alt=""
          tone="dark"
          sizes="100vw"
          priority
        />
      </div>
      <div className="home-hero__content">
        <h1 className="home-hero__title">
          {HERO.words.map((word) => (
            <span key={word} className="home-hero__word">
              {word}
            </span>
          ))}
        </h1>
        <div className="home-hero__actions">
          <Button variant="primary" size="lg">
            Conocer proyectos
          </Button>
        </div>
      </div>
    </section>
  );
}
