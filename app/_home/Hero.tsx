import { Button } from "@/app/ui";
import { HERO } from "./content";
import { HeroSlider } from "./HeroSlider";

/**
 * Banner de portada: las tres palabras de la marca sobre un carrusel con una
 * imagen por división.
 */
export function Hero() {
  return (
    <section className="home-hero">
      <HeroSlider slides={HERO.slides} />
      <div className="home-hero__content">
        <h1 className="home-hero__title">
          {HERO.words.map((word) => (
            <span key={word} className="home-hero__word">
              {word}
            </span>
          ))}
        </h1>
        <p className="home-hero__description">{HERO.description}</p>
        <div className="home-hero__actions">
          <Button variant="primary" size="lg">
            Conocer proyectos
          </Button>
        </div>
      </div>
    </section>
  );
}
