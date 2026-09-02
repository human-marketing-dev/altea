import Image from "next/image";
import { EMBLEM, EMBLEM_IMAGE } from "./content";

/** Emblema de Altea, a todo lo ancho, sobre una foto muy atenuada. */
export function Emblem() {
  return (
    <section className="home-emblem">
      <div className="home-emblem__fondo" aria-hidden="true">
        <Image
          src={EMBLEM_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="home-emblem__img"
        />
      </div>
      <p className="home-emblem__text">{EMBLEM}</p>
    </section>
  );
}
