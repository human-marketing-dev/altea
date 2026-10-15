"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CarruselTarjetas } from "@/app/ui";
import { FichaUnidad } from "./FichaUnidad";
import type { ContenidoUnidad, ProximoProyecto } from "./tipos";

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
 * ficha: la MISMA de las plazas, <FichaUnidad>, con la ubicación y el giro
 * que el contenido ya traía y nadie leía.
 *
 * ⚠ PUNTO LA PASTORA ABRE UNA FICHA SIN DESCRIPCIÓN, y es lo correcto hasta que
 * llegue el copy. El campo está marcado PENDIENTE en contenido/comercial.ts y la ficha se
 * compone sin él —no pinta un párrafo vacío—, así que lo que se ve son la foto,
 * el nombre, el giro y la ubicación. La alternativa era dejar esa tarjeta sin
 * abrir, y tres tarjetas iguales de las que una no responde se lee como un
 * fallo, no como una ausencia de contenido.
 */
export function ProximosProyectos({
  proximos,
}: Pick<ContenidoUnidad, "proximos">) {
  const PROXIMOS_PROYECTOS = proximos;
  const [activo, setActivo] = useState<ProximoProyecto | null>(null);
  /* Quién abrió la ficha, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  const ficha = (
    <FichaUnidad
      contenido={
        activo && {
          nombre: activo.name,
          foto: activo.image,
          /* Del contenido: en Comercial los tres archivos son 1980x1105. */
          fotoRatio: activo.fotoRatio,
          alt: activo.name,
          /* Unidad · Ubicación: el giro clasifica y la ciudad sitúa, el mismo
             orden que la ficha de plazas. */
          datos: [
            { etiqueta: "Unidad", valor: activo.unit },
            { etiqueta: "Ubicación", valor: activo.location },
            ...(activo.datos ?? []),
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
  );

  /*
   * MÁS DE TRES, EN CARRUSEL. La rejilla es de tres columnas: con cuatro o más
   * —hoy Vivienda— partía la sección en dos filas, y lo que se quiere es una
   * sola. Entonces va el mismo carrusel de los proyectos de la unidad, con su
   * arrastre, flechas y contador, y abre la misma ficha.
   */
  if (PROXIMOS_PROYECTOS.proyectos.length > 3) {
    const lista = PROXIMOS_PROYECTOS.proyectos;
    return (
      <CarruselTarjetas
        titulo={PROXIMOS_PROYECTOS.titulo}
        tituloId="prox-titulo"
        items={lista.map((p) => ({
          id: p.slug,
          nombre: p.name,
          pie: p.unit,
          foto: p.image,
        }))}
        onAbrir={(k, boton) => {
          origen.current = boton;
          setActivo(lista[k] ?? null);
        }}
      >
        {ficha}
      </CarruselTarjetas>
    );
  }

  const lista = PROXIMOS_PROYECTOS.proyectos;
  return (
    <>
      {/*
      EN MÓVIL, CARRUSEL TAMBIÉN CON TRES O MENOS: la rejilla se apilaba en una
      columna de tarjetas a lo alto. Se montan los dos y la hoja enseña uno según
      el ancho (ver .uni-prox--rejilla y .uni-prox__movil en unidad.css); la
      ficha es una sola, fuera de los dos.
    */}
      <div className="uni-prox__movil">
        <CarruselTarjetas
          titulo={PROXIMOS_PROYECTOS.titulo}
          tituloId="prox-titulo-movil"
          rejillaHasta={0}
          items={lista.map((p) => ({
            id: p.slug,
            nombre: p.name,
            pie: p.unit,
            foto: p.image,
          }))}
          onAbrir={(k, boton) => {
            origen.current = boton;
            setActivo(lista[k] ?? null);
          }}
        />
      </div>
      <section
        className="uni-prox uni-prox--rejilla"
        aria-labelledby="prox-titulo"
      >
        <h2 className="uni-prox__titulo" id="prox-titulo">
          {PROXIMOS_PROYECTOS.titulo}
        </h2>

        {/* Tantas columnas como proyectos, hasta tres: con dos no queda un
          hueco a la derecha. */}
        <ul
          className="uni-prox__grid"
          style={{
            ["--cols" as string]: Math.min(
              3,
              PROXIMOS_PROYECTOS.proyectos.length,
            ),
          }}
        >
          {PROXIMOS_PROYECTOS.proyectos.map((proyecto) => (
            <li key={proyecto.slug}>
              <button
                type="button"
                className="uni-px"
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
                    className="uni-px__img"
                  />
                )}
                <span className="uni-px__velo" aria-hidden="true" />
                <span className="uni-px__t">
                  <b>{proyecto.name}</b>
                  <span>{proyecto.unit}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      {ficha}
    </>
  );
}
