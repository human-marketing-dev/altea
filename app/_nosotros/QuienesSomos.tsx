"use client";

import { useState } from "react";
import { QUIENES_SOMOS } from "./content";

/**
 * Quiénes somos, en acordeón.
 *
 * UNO ABIERTO A LA VEZ. Con tres textos de este largo, dos abiertos ya obligan a
 * desplazarse para compararlos, que es exactamente lo que el acordeón venía a
 * evitar; y un botón que cierra el que estaba abierto comunica que son tres
 * lecturas de lo mismo, no tres cosas independientes.
 *
 * EL CUERPO SE ABRE CON `grid-template-rows: 0fr → 1fr`, no con `max-height`. Con
 * max-height hay que adivinar un valor más alto que el texto más largo, y se
 * rompe en cuanto el copy cambia o envuelve a otro número de líneas. Con la
 * rejilla, el alto es el que mide el contenido y nadie tiene que saberlo.
 *
 * El disparador es un <button> de verdad con `aria-expanded`, que se actualiza al
 * abrir y al cerrar. Un <div> con onClick no se alcanza con el teclado.
 */
export function QuienesSomos() {
  /* El primero abierto: un acordeón que arranca todo cerrado deja la sección
     siendo tres títulos y nada más. */
  const [abierto, setAbierto] = useState<string | null>(
    QUIENES_SOMOS.bloques[0]?.id ?? null,
  );

  return (
    <section className="nos-quienes" aria-labelledby="quienes-titulo">
      <h2 className="nos-quienes__titulo" id="quienes-titulo">
        {QUIENES_SOMOS.titulo}
      </h2>

      <div className="nos-quienes__acordeon">
        {QUIENES_SOMOS.bloques.map((bloque, i) => {
          const on = abierto === bloque.id;
          return (
            <div className="nos-ac" key={bloque.id} data-on={on ? "si" : undefined}>
              <h3 className="nos-ac__fila">
                <button
                  type="button"
                  className="nos-ac__bt"
                  aria-expanded={on}
                  aria-controls={`ac-${bloque.id}`}
                  /* Pulsar el abierto lo cierra: si sólo abriera, no habría forma
                     de dejar la sección en reposo. */
                  onClick={() => setAbierto(on ? null : bloque.id)}
                >
                  <span className="nos-ac__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="nos-ac__t">{bloque.title}</span>
                  <span className="nos-ac__mas" aria-hidden="true" />
                </button>
              </h3>

              {/*
                El cuerpo NO se desmonta al cerrar: la transición de 0fr a 1fr
                necesita que el contenido exista para medirlo, y además el texto
                tiene que estar en el DOM para que una búsqueda del navegador lo
                encuentre. `hidden` tampoco sirve, porque no es animable.
              */}
              {/* Sin role="region": una región necesita nombre accesible y aquí no
                  tiene ninguno propio. El patrón de divulgación lo cierran el
                  aria-expanded y el aria-controls del botón, que ya dicen qué
                  abre y si está abierto. */}
              <div className="nos-ac__cuerpo" id={`ac-${bloque.id}`}>
                <div>
                  <p>{bloque.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
