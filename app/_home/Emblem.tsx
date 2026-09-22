import { Fragment } from "react";
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
        {/*
          El espacio va como hermano del <span> y no se apoya en el CSS: antes
          las palabras eran ítems de un flex y el hueco lo ponía su `gap`, así
          que en el DOM no había ningún carácter entre ellas y la frase copiada
          salía "Creamosproyectosquematerializansueños". Mismo arreglo que en
          QuienesSomos.

          Los <span> no se pueden quitar: RevealOnScroll anima
          `.home-emblem__palabra` una a una.
        */}
        {EMBLEM.palabras.map((palabra, i, todas) => (
          <Fragment key={`${palabra}-${i}`}>
            <span
              className={
                i === EMBLEM.acento
                  ? "home-emblem__palabra home-emblem__palabra--acento"
                  : "home-emblem__palabra"
              }
            >
              {palabra}
            </span>
            {i < todas.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
