"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FichaComercial } from "./FichaComercial";
import { PROXIMOS_PROYECTOS } from "./content";

/**
 * Próximos proyectos: tres tarjetas verticales que abren ficha.
 *
 * EN 4/3 y no en 3/4, que es como estaban. Tres tarjetas verticales en fila
 * dejaban la sección en 572 px de alto por tarjeta a 1440, y de paso obligaban a
 * pintar la foto a 1 023 px de ancho — ver la nota del `sizes`. En 4/3 la tarjeta
 * baja a 322 px y la sección entera con ella.
 *
 * AHORA SÍ SON BOTONES, y antes no. El comentario que había decía que un
 * <button> prometería algo que no pasa, porque los tres son proyectos en
 * desarrollo sin ficha ni página a la que llevar. Lo que cambió es que ya hay
 * ficha: la MISMA de las plazas, <FichaComercial>, con la ubicación y el giro
 * que el contenido ya traía y nadie leía.
 *
 * ⚠ PUNTO LA PASTORA ABRE UNA FICHA SIN DESCRIPCIÓN, y es lo correcto hasta que
 * llegue el copy. El campo está marcado PENDIENTE en content.ts y la ficha se
 * compone sin él —no pinta un párrafo vacío—, así que lo que se ve son la foto,
 * el nombre, el giro y la ubicación. La alternativa era dejar esa tarjeta sin
 * abrir, y tres tarjetas iguales de las que una no responde se lee como un
 * fallo, no como una ausencia de contenido.
 */
export function ProximosComercial() {
  const [activo, setActivo] = useState<
    (typeof PROXIMOS_PROYECTOS.proyectos)[number] | null
  >(null);
  /* Quién abrió la ficha, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="com-prox" aria-labelledby="prox-titulo">
      <h2 className="com-prox__titulo" id="prox-titulo">
        {PROXIMOS_PROYECTOS.titulo}
      </h2>

      <ul className="com-prox__grid">
        {PROXIMOS_PROYECTOS.proyectos.map((proyecto) => (
          <li key={proyecto.slug}>
            <button
              type="button"
              className="com-px"
              onClick={(evento) => {
                origen.current = evento.currentTarget;
                setActivo(proyecto);
              }}
            >
              {proyecto.image && (
                <Image
                  src={proyecto.image}
                  /* Decorativa: el nombre va escrito dentro del propio botón, así
                     que un alt con la misma cadena lo diría dos veces. */
                  alt=""
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
            </button>
          </li>
        ))}
      </ul>

      <FichaComercial
        contenido={
          activo && {
            nombre: activo.name,
            foto: activo.image,
            /* Los tres archivos son 1980x1105. */
            fotoRatio: 1.792,
            alt: activo.name,
            /* Unidad · Ubicación: el giro clasifica y la ciudad sitúa, el mismo
               orden que la ficha de plazas. */
            datos: [
              { etiqueta: "Unidad", valor: activo.unit },
              { etiqueta: "Ubicación", valor: activo.location },
            ],
            descripcion: activo.descripcion,
          }
        }
        onCerrar={() => {
          setActivo(null);
          origen.current?.focus();
        }}
        etiquetaVacia="Ficha del proyecto"
      />
    </section>
  );
}
