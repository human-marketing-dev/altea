import Image from "next/image";
import Link from "next/link";
import { BUSINESS_UNITS, BUSINESS_UNITS_INTRO } from "./content";

/**
 * Las cuatro divisiones, en tarjetas que se expanden al pasar el cursor.
 *
 * La tarjeta apuntada gana espacio a costa de sus vecinas —animando
 * `flex-grow`, no el ancho— la foto se acerca y aparece la descripción. En
 * móvil no hay hover, así que se apilan con la descripción siempre visible.
 */
export function BusinessUnits() {
  const [inicio, acento] = BUSINESS_UNITS_INTRO.titulo;

  // El id es el destino del CTA del hero.
  return (
    <section id="unidades" className="home-units">
      <div className="home-units__encabezado">
        <h2 className="home-units__titulo">
          {inicio} <span className="home-units__acento">{acento}</span>
        </h2>
        <p className="home-units__intro">{BUSINESS_UNITS_INTRO.descripcion}</p>
      </div>

      <ul className="home-units__grid">
        {BUSINESS_UNITS.map((unit) => (
          <li key={unit.slug} className="home-units__item">
            <Link href={`/${unit.slug}`} className="home-units__card">
              <span className="home-units__media">
                {unit.image && (
                  <Image
                    src={unit.image}
                    alt={unit.alt ?? `Proyecto Altea ${unit.name}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 520px"
                    className="home-units__img"
                  />
                )}
              </span>
              <span className="home-units__velo" aria-hidden="true" />

              <span className="home-units__contenido">
                <span className="home-units__nombre">{unit.name}</span>

                <span className="home-units__desc-caja">
                  <span className="home-units__desc">{unit.descripcion}</span>
                </span>

                <span className="home-units__cta">
                  Explorar
                  <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
