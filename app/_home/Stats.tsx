import { CountUp } from "@/app/ui";
import { STATS, STATS_INTRO } from "./content";

/** Texto introductorio + las cifras clave con conteo animado. */
export function Stats() {
  return (
    <section className="home-stats">
      <p className="home-stats__intro">{STATS_INTRO}</p>
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
