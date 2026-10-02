import Image from "next/image";
import { PROXIMOS_PROYECTOS } from "./content";

/**
 * Próximos proyectos: tres tarjetas verticales.
 *
 * EN 4/3 y no en 3/4, que es como estaban. Tres tarjetas verticales en fila
 * dejaban la sección en 572 px de alto por tarjeta a 1440, y de paso obligaban a
 * pintar la foto a 1 023 px de ancho — ver la nota del `sizes`. En 4/3 la tarjeta
 * baja a 322 px y la sección entera con ella.
 *
 * No son botones. Los tres son proyectos en desarrollo sin ficha ni página a la
 * que llevar, así que un <button> prometería algo que no pasa; cuando existan
 * esas páginas, se envuelven en un <Link> y el CSS no se entera.
 */
export function ProximosComercial() {
  return (
    <section className="com-prox" aria-labelledby="prox-titulo">
      <h2 className="com-prox__titulo" id="prox-titulo">
        {PROXIMOS_PROYECTOS.titulo}
      </h2>

      <ul className="com-prox__grid">
        {PROXIMOS_PROYECTOS.proyectos.map((proyecto) => (
          <li className="com-px" key={proyecto.slug}>
            {proyecto.image && (
              <Image
                src={proyecto.image}
                alt={proyecto.name}
                fill
                /*
                  ESTO era la pixelación.
                  Los tres archivos miden 1980x1105 (proporción 1.79) y la caja es
                  vertical, así que con `object-fit: cover` la imagen se escala
                  hasta que su ALTO cubre la caja y su ancho RENDERIZADO queda muy
                  por encima del de la caja. En 3/4 la tarjeta medía 429x572 y había
                  que pintar 1 023 px de ancho, mientras el `sizes` declaraba 475:
                  Next servía w=640 a 1x, estirado 1.6x.

                  En 4/3 la tarjeta es 429x322 y el ancho a pintar baja a 575 px
                  (783 a 1920, 470 en móvil). Con 800 px declarados sobra, y los
                  archivos no hay que tocarlos: 1980 de ancho es de sobra.
                */
                sizes="(max-width: 900px) 135vw, 800px"
                className="com-px__img"
              />
            )}
            <span className="com-px__velo" aria-hidden="true" />
            <span className="com-px__t">
              <b>{proyecto.name}</b>
              <span>{proyecto.unit}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
