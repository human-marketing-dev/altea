import Image from "next/image";
import { OTROS_GIROS } from "./content";

/**
 * Otros giros: hoteles, hospital y educación.
 *
 * Tres láminas en banda. La señalada se abre y las otras ceden, y eso se resuelve
 * ENTERO EN CSS con `:has()`: `.fila:has(.gr:hover) .gr:not(:hover)` encoge a las
 * que no están bajo el cursor. Sin una línea de JavaScript, sin estado y sin
 * escuchar eventos — ver el bloque en comercial.css.
 *
 * EN TÁCTIL LA DESCRIPCIÓN VA SIEMPRE VISIBLE. Si sólo existiera en el hover, en
 * un teléfono no existiría, y tres láminas con un título y nada más no dicen de
 * qué va la sección. Lo decide `@media (hover: none)`.
 *
 * Son <article> y no <button>: no llevan a ninguna parte ni abren nada. Lo único
 * que hacen es revelar su propio texto, que en táctil ya está revelado.
 */
export function OtrosGiros() {
  return (
    <section className="com-giros" aria-labelledby="giros-titulo">
      <p className="com-giros__rotulo">{OTROS_GIROS.eyebrow}</p>
      <h2 className="com-giros__titulo" id="giros-titulo">
        {OTROS_GIROS.titulo}
      </h2>

      <div className="com-giros__fila">
        {OTROS_GIROS.bloques.map((giro) => (
          <article className="com-gr" key={giro.id}>
            <Image
              src={giro.image}
              alt={giro.alt}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className="com-gr__img"
            />
            {/* El velo no es decorativo: es lo que garantiza el contraste del
                título y la descripción sobre una foto cualquiera. */}
            <span className="com-gr__velo" aria-hidden="true" />

            <span className="com-gr__n" aria-hidden="true">
              {giro.numero}
            </span>
            <div className="com-gr__t">
              <h3>{giro.title}</h3>
              {/*
                El envoltorio no es decorativo: la caja anima UNA fila de rejilla
                de 0fr a 1fr y necesita un hijo único con overflow oculto. Con
                max-height habría que adivinar un alto y se rompería al cambiar
                el texto.
              */}
              <div className="com-gr__caja">
                <p>{giro.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
