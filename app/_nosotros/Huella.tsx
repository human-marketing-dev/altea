import { CountUp, MapaProyectos } from "@/app/ui";
import {
  ESTADOS_CON_PRESENCIA,
  PRESENCIA_INTERNACIONAL,
  PROYECTOS,
} from "@/lib/proyectos";
import { HUELLA } from "./content";

/** Sección 3 — Nuestra Huella. Mapa a la izquierda, texto y cifras a la derecha. */
export function Huella() {
  return (
    <section className="nos-huella">
      <div className="nos-huella__map">
        <MapaProyectos
          proyectos={PROYECTOS}
          estadosConPresencia={ESTADOS_CON_PRESENCIA}
          paisesAdicionales={PRESENCIA_INTERNACIONAL}
          layout="stacked"
        />
      </div>
      <div className="nos-huella__body">
        <h2 className="nos-huella__title">{HUELLA.title}</h2>
        <p className="nos-huella__text">{HUELLA.body}</p>

        <dl className="nos-huella__stats">
          {HUELLA.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="nos-huella__value">
                <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
              <dt className="nos-huella__label">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="nos-huella__desglose">
          {HUELLA.desglose.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <span className="nos-huella__desglose-value">
                {row.value.toLocaleString("es-MX")} m²
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
