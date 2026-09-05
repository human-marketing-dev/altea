import Image from "next/image";
import { EMBLEM } from "./content";

/**
 * Emblema de Altea: la frase sola sobre ink, sin fotografía.
 *
 * El manual describe la identidad como "plana y tipográfica" y prohíbe poner el
 * logo sobre imágenes. Sobre fondo sólido esa restricción no aplica, así que la
 * frase puede anclarse con el isotipo.
 */
export function Emblem() {
  return (
    <section className="home-emblem">
      <Image
        className="home-emblem__isotipo"
        src="/brand/logos/altea-icon-light.svg"
        alt=""
        width={494}
        height={430}
        unoptimized
      />
      <p className="home-emblem__text">
        {EMBLEM.palabras.map((palabra, i) => (
          <span
            key={`${palabra}-${i}`}
            className={
              i === EMBLEM.acento
                ? "home-emblem__palabra home-emblem__palabra--acento"
                : "home-emblem__palabra"
            }
          >
            {palabra}
          </span>
        ))}
      </p>
    </section>
  );
}
