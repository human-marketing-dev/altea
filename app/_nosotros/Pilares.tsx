import type { IconoPilar } from "./content";
import { PILARES } from "./content";

/**
 * Los tres pilares, sobre ink.
 *
 * El icono, el título y el texto van JUNTOS en cada columna. La referencia del
 * cliente separaba los tres textos en una banda aparte debajo, y eso obliga a
 * mirar arriba y abajo para emparejar cada uno con su pilar: tres idas y venidas
 * para leer tres párrafos.
 *
 * Los iconos son geométricos, de trazo, con el mismo grosor (1.3–1.4) y la misma
 * caja de 120. Decorativos y aria-hidden: el significado lo lleva el título que
 * tienen debajo, y describir una retícula atravesada por una diagonal no añade
 * nada a "Innovación disruptiva".
 */
const ICONOS_PILAR: Record<IconoPilar, React.ReactNode> = {
  /* Una retícula ordenada que una diagonal rompe y desplaza. */
  "retícula": (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <g opacity=".55" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M24 24h72M24 48h72M24 72h72M24 96h72" />
        <path d="M24 24v72M48 24v72M72 24v72M96 24v72" />
      </g>
      <path d="M14 106 106 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <g fill="currentColor">
        <circle cx="24" cy="96" r="3.6" />
        <circle cx="48" cy="72" r="3.6" />
        <circle cx="72" cy="48" r="3.6" />
        <circle cx="96" cy="24" r="3.6" />
      </g>
    </svg>
  ),
  /* Seis nodos en círculo, todos unidos con todos: la conexión, no la jerarquía. */
  red: (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="42" opacity=".35" stroke="currentColor" strokeWidth="1.3" />
      <g opacity=".85" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M60 18 96 39 96 81 60 102 24 81 24 39Z" />
        <path d="M60 18 96 81M60 18 24 81M96 39 24 81M96 39 60 102M96 81 24 39M60 102 24 39" />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="18" r="4" />
        <circle cx="96" cy="39" r="4" />
        <circle cx="96" cy="81" r="4" />
        <circle cx="60" cy="102" r="4" />
        <circle cx="24" cy="81" r="4" />
        <circle cx="24" cy="39" r="4" />
      </g>
    </svg>
  ),
  /* El triángulo subdividido: la misma forma a tres escalas, que es lo que dice
     "perdurable" sin escribirlo — y es además la figura del isotipo. */
  "triángulo": (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M60 14 108 104H12Z" />
        <path d="M36 59h48M60 14 36 59M60 14 84 59M36 59 12 104M36 59 60 104M84 59 60 104M84 59 108 104" />
        <path d="M24 81h24M72 81h24M48 81 60 59 72 81" opacity=".5" />
      </g>
    </svg>
  ),
};

export function Pilares() {
  return (
    <section className="nos-pilares" aria-labelledby="pilares-titulo">
      <h2 className="nos-pilares__titulo" id="pilares-titulo">
        {PILARES.title}
      </h2>
      <ul className="nos-pilares__grid">
        {PILARES.bloques.map((pilar) => (
          <li className="nos-pilar" key={pilar.id}>
            <span className="nos-pilar__icono">{ICONOS_PILAR[pilar.icono]}</span>
            <h3 className="nos-pilar__titulo">{pilar.title}</h3>
            <p className="nos-pilar__texto">{pilar.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
