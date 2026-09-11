import { EMBLEM } from "./content";

/**
 * Emblema de Altea: la frase sola sobre ink, sin fotografía.
 *
 * El manual describe la identidad como "plana y tipográfica": la frase se
 * sostiene sola sobre el fondo sólido, sin marca que la ancle.
 */
export function Emblem() {
  return (
    <section className="home-emblem">
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
