import { Button, CountUp } from "@/app/ui";
import { HUELLA } from "./content";
import { MapaPuntos } from "./MapaPuntos";
import { Reparto } from "./Reparto";

/**
 * Nuestra huella: las dos cifras, el reparto por territorio y el mapa.
 *
 * Las cifras se escalonan como en el home —el sangrado sale del índice— en vez de
 * ir en dos columnas iguales.
 *
 * EL ENVOLTORIO .nos-huella__info EXISTE POR LA REJILLA. La sección es de dos
 * columnas —información a la izquierda, mapa a la derecha— y los tres bloques de
 * texto tienen que ocupar UNA celda entre los tres, no tres celdas. Sin él, la
 * rejilla repartiría titular, cifras, reparto y mapa en cuatro huecos.
 */
export function Huella() {
  return (
    <section className="nos-huella" aria-labelledby="huella-titulo">
      <div className="nos-huella__info">
        <div className="nos-huella__intro">
          <h2 className="nos-huella__titulo" id="huella-titulo">
            {HUELLA.title}
          </h2>
          <p className="nos-huella__body">{HUELLA.body}</p>
        </div>

        <dl className="nos-huella__datos">
          {HUELLA.stats.map((stat, i) => (
            <div
              className="nos-hd"
              key={stat.label}
              style={{ ["--i" as string]: i }}
            >
              {/* dt antes que dd, que es el orden que pide un <dl>; la cifra se ve
                primero porque la rejilla la coloca en la primera columna. */}
              <dt className="nos-hd__etiqueta">{stat.label}</dt>
              <dd className="nos-hd__cifra">
                <CountUp
                  to={stat.to}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>

        <Reparto />

        {/*
          El CTA. <Button> cuando no hay destino —un <button type="button"> que no
          navega—, y un enlace con las MISMAS clases en cuanto lo haya: el
          proyecto ya pinta así sus botones-enlace, ver <CierreContacto>.

          `primary` porque la sección es ink: `dark` es ink sobre claro y no se
          vería, y el contorno está pensado para superficies claras.
        */}
        {HUELLA.cta.href ? (
          <a
            className="altea-btn altea-btn--primary altea-btn--lg nos-huella__cta"
            href={HUELLA.cta.href}
            /* Fuera del sitio, en una pestaña nueva: el video se ve en YouTube y
               la página se queda donde estaba. */
            target="_blank"
            rel="noopener noreferrer"
          >
            {HUELLA.cta.texto}
            <span className="altea-btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <Button variant="primary" size="lg" className="nos-huella__cta">
            {HUELLA.cta.texto}
            <span className="altea-btn__arrow" aria-hidden="true">
              →
            </span>
          </Button>
        )}
      </div>

      <MapaPuntos />
    </section>
  );
}
