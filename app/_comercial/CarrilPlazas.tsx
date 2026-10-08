"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CarrilTarjetas } from "@/app/ui";
import type { Plaza } from "./content";
import { GALERIA_PLAZAS, PLAZAS } from "./content";

/**
 * Las ocho plazas, en el mismo recorrido horizontal que los proyectos del home.
 *
 * El carril y la tarjeta son <CarrilTarjetas> en ui/: aquí sólo está lo propio
 * de comercial —qué dice cada tarjeta y qué ficha abre—.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ANTES ERA UN ÍNDICE, Y SE FUE ENTERO
 *
 * Eran filas de texto —nombre, ubicación, formato y visitantes— separadas por
 * línea fina, con una foto que perseguía al cursor con retraso y se inclinaba
 * según la velocidad. Con el carril no hay dónde ponerla: la foto ya está en la
 * tarjeta, a tamaño grande y quieta, así que un visor flotante repetiría la
 * misma imagen dos veces. Se fueron con él .com-ix y .com-visor de la hoja.
 *
 * Lo que sí se pierde y conviene saberlo: el índice enseñaba los cuatro datos de
 * las ocho plazas DE UNA VEZ, y el carril enseña dos por tarjeta y obliga a
 * abrir la ficha para el resto. Es el trato que pide un formato de tarjetas.
 */
export function CarrilPlazas() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [activa, setActiva] = useState<Plaza | null>(null);
  const origen = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta el
       ::backdrop sin escribir una línea para ello. */
    if (activa && !nodo.open) nodo.showModal();
    if (!activa && nodo.open) nodo.close();
  }, [activa]);

  return (
    <CarrilTarjetas
      titulo={GALERIA_PLAZAS.titulo}
      tituloId="plazas-titulo"
      items={PLAZAS.map((plaza) => ({
        id: plaza.id,
        nombre: plaza.nombre,
        /*
         * La ciudad y no el formato, que es lo que llevaría la línea equivalente
         * del home. Dentro de /comercial las ocho son comerciales, así que el
         * formato distingue poco —cinco de las ocho son Fashion Mall— y lo que de
         * verdad separa una plaza de otra es dónde está.
         */
        pie: plaza.ubicacion,
        foto: plaza.foto,
      }))}
      onAbrir={(k, boton) => {
        origen.current = boton;
        setActiva(PLAZAS[k] ?? null);
      }}
    >
      <dialog
        ref={dialogo}
        className="com-fx"
        aria-label={activa ? `Ficha de ${activa.nombre}` : "Ficha de la plaza"}
        onClose={() => {
          setActiva(null);
          origen.current?.focus();
        }}
        onClick={(evento) => {
          // El backdrop es el propio <dialog>: un clic fuera cierra.
          if (evento.target === dialogo.current) setActiva(null);
        }}
      >
        {activa && (
          <article>
            <button
              type="button"
              className="com-fx__x"
              onClick={() => setActiva(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>

            {/*
              La foto arriba, a todo el ancho y con el nombre encima; los datos y
              la descripción debajo. Lo que hace que entre sin barra no es la
              estructura sino el tope de alto de la foto, en comercial.css.
            */}
            <div
              className="com-fx__foto"
              /* La proporción del archivo. Sin el dato, 3/2: es la de cinco de
                 las ocho, así que un valor que falte falla por poco. */
              style={{ ["--proporcion" as string]: activa.fotoRatio ?? 1.5 }}
            >
              {activa.foto && (
                <Image
                  src={activa.foto}
                  alt={activa.alt}
                  fill
                  /* La caja ocupa el ancho entero del diálogo. */
                  sizes="(max-width: 900px) 94vw, 1040px"
                  className="com-fx__img"
                />
              )}
              <h3 className="com-fx__nombre">{activa.nombre}</h3>
            </div>

            <div className="com-fx__cuerpo">
              <dl className="com-fx__datos">
                <div className="com-fx__d">
                  <dt>Ubicación</dt>
                  <dd>{activa.ubicacion}</dd>
                </div>
                {activa.datos.map((dato) => (
                  <div className="com-fx__d" key={dato.etiqueta}>
                    <dt>{dato.etiqueta}</dt>
                    <dd>{dato.valor ?? "—"}</dd>
                  </div>
                ))}
              </dl>
              <p>{activa.descripcion}</p>
            </div>
          </article>
        )}
      </dialog>
    </CarrilTarjetas>
  );
}
