"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * La ficha de las páginas de unidad: el <dialog> que abren las tarjetas. Era
 * <FichaComercial>.
 *
 * Vive aparte porque la abren DOS secciones —las plazas del carrusel y los
 * próximos proyectos— y es exactamente el mismo diálogo. Duplicar el marcado era
 * garantizar que la primera vez que alguien tocara el velo o el tope de alto en
 * una, dejaran de ser la misma.
 *
 * <dialog> nativo con showModal(): el foco atrapado, el cierre con Escape y el
 * ::backdrop salen gratis, sin una línea de JavaScript para ello.
 *
 * Lo que NO es: una ficha genérica del sitio. La del home tiene su propio
 * tratamiento —otra proporción de foto, otro tope de alto— y las dos están
 * calibradas por separado; ver .uni-fx y .home-ficha en sus hojas.
 */

export interface DatoFicha {
  etiqueta: string;
  /** `undefined` pinta un guion: el copy no da el dato y no se inventa. */
  valor?: string;
}

export interface ContenidoFicha {
  nombre: string;
  foto?: string;
  /**
   * Proporción ancho/alto del archivo. La caja la adopta para que `cover` no
   * recorte nada mientras haya alto; ver .uni-fx__foto.
   */
  fotoRatio?: number;
  alt?: string;
  datos: DatoFicha[];
  /** Opcional: Punto La Pastora aún no tiene descripción en el copy de Altea. */
  descripcion?: string;
  /** El sitio web del proyecto. Con él, la ficha lleva un botón que lo abre. */
  sitio?: string;
}

export function FichaUnidad({
  contenido,
  onCerrar,
  etiquetaVacia,
}: {
  /** `null` cierra. Al abrir, el nombre entra en el aria-label del diálogo. */
  contenido: ContenidoFicha | null;
  onCerrar: () => void;
  /** Lo que se anuncia mientras no hay nada abierto. */
  etiquetaVacia: string;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta el
       ::backdrop sin escribir una línea para ello. */
    if (contenido && !nodo.open) nodo.showModal();
    if (!contenido && nodo.open) nodo.close();
  }, [contenido]);

  return (
    <dialog
      ref={dialogo}
      className="uni-fx"
      aria-label={contenido ? `Ficha de ${contenido.nombre}` : etiquetaVacia}
      onClose={onCerrar}
      onClick={(evento) => {
        // El backdrop es el propio <dialog>: un clic fuera cierra.
        if (evento.target === dialogo.current) onCerrar();
      }}
    >
      {contenido && (
        <article>
          <button
            type="button"
            className="uni-fx__x"
            onClick={onCerrar}
            aria-label="Cerrar ficha"
          >
            ×
          </button>

          {/*
            La foto arriba, a todo el ancho y con el nombre encima; los datos y la
            descripción debajo. Lo que hace que entre sin barra es que la foto
            cede el alto que le sobra al cuerpo, en unidad.css.
          */}
          <div
            className="uni-fx__foto"
            /* La proporción del archivo. Sin el dato, 3/2: es la de cinco de las
               ocho plazas, así que un valor que falte falla por poco. */
            style={{ ["--proporcion" as string]: contenido.fotoRatio ?? 1.5 }}
          >
            {contenido.foto && (
              <Image
                src={contenido.foto}
                alt={contenido.alt ?? ""}
                fill
                /* La caja ocupa el ancho entero del diálogo. */
                sizes="(max-width: 900px) 94vw, 1040px"
                className="uni-fx__img"
              />
            )}
            <h3 className="uni-fx__nombre">{contenido.nombre}</h3>
          </div>

          <div className="uni-fx__cuerpo">
            <dl className="uni-fx__datos">
              {contenido.datos.map((dato) => (
                <div className="uni-fx__d" key={dato.etiqueta}>
                  <dt>{dato.etiqueta}</dt>
                  <dd>{dato.valor ?? "—"}</dd>
                </div>
              ))}
            </dl>
            {/* Sin descripción ni sitio no se pinta nada: la rejilla deja la
                columna libre y el bloque de datos se lee igual. */}
            {(contenido.descripcion || contenido.sitio) && (
              <div className="uni-fx__texto">
                {contenido.descripcion && <p>{contenido.descripcion}</p>}
                {contenido.sitio && (
                  <a
                    className="altea-btn altea-btn--dark altea-btn--md uni-fx__sitio"
                    href={contenido.sitio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar sitio web
                    <span className="sr-only"> (se abre en otra pestaña)</span>
                    <span className="altea-btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
      )}
    </dialog>
  );
}
