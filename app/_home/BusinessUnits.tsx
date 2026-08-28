import Link from "next/link";
import { MediaSlot } from "@/app/ui";
import { BUSINESS_UNITS } from "./content";

/**
 * Las cuatro divisiones. Cada tarjeta lleva a su pestaña correspondiente.
 */
export function BusinessUnits() {
  return (
    <section className="home-units">
      <h2 className="home-units__title">Unidades de negocio</h2>
      <ul className="home-units__grid">
        {BUSINESS_UNITS.map((unit) => (
          <li key={unit.slug}>
            <Link href={`/${unit.slug}`} className="home-units__card">
              <span className="home-units__name">{unit.name}</span>
              <MediaSlot
                label={`Render ${unit.name}`}
                src={unit.image}
                alt={`Proyecto Altea ${unit.name}`}
                tone="dark"
                ratio="4 / 5"
                sizes="(max-width: 720px) 50vw, 25vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
