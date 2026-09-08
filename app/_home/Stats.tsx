import { CountUp } from "@/app/ui";
import { STATS, STATS_INTRO } from "./content";

/** Texto introductorio + las cifras clave con conteo animado. */
export function Stats() {
  return (
    <section className="home-stats">
      {/*
        Las comillas van CENTRADAS ENCIMA y no colgando a la izquierda: el
        párrafo está centrado y una marca al margen lo descuadraría.

        Y van como SVG decorativo, no como carácter en el texto: metidas en el
        contenido, el lector de pantalla las anunciaría y se copiarían al
        seleccionar el párrafo.
      */}
      <div className="home-stats__cita">
        <svg
          className="home-stats__comillas"
          viewBox="0 0 40 28"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0 28V15.4C0 6.9 4.9 1.3 14 0l1.6 4.6c-5 1.3-7.5 4-7.7 8h6.9V28H0Zm24.4 0V15.4c0-8.5 4.9-14.1 14-15.4l1.6 4.6c-5 1.3-7.5 4-7.7 8H39V28H24.4Z" />
        </svg>
        <p className="home-stats__intro">{STATS_INTRO}</p>
      </div>
      <dl className="home-stats__grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="home-stats__item">
            <dd className="home-stats__value">
              <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
              {stat.note && <span className="home-stats__note">{stat.note}</span>}
            </dd>
            <dt className="home-stats__label">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
