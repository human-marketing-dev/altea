"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CarrilTarjetas } from "@/app/ui";
import type { FeaturedProject } from "./content";
import { FEATURED_PROJECTS, FEATURED_PROJECTS_INTRO } from "./content";

/**
 * Los proyectos del home, en un recorrido horizontal.
 *
 * El carril y la tarjeta ya no viven aquí: son <CarrilTarjetas> en ui/, que
 * comparte con las plazas de /comercial. Lo que queda es lo propio del home —qué
 * se pone en cada tarjeta y qué ficha abre—, que es justo lo que las dos
 * secciones no comparten.
 */
export function CarrilProyectos() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [activo, setActivo] = useState<FeaturedProject | null>(null);
  /* Quién abrió la ficha, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta
       el ::backdrop sin escribir una línea para ello. */
    if (activo && !nodo.open) nodo.showModal();
    if (!activo && nodo.open) nodo.close();
  }, [activo]);

  return (
    <CarrilTarjetas
      titulo={FEATURED_PROJECTS_INTRO.titulo}
      tituloId="carril-titulo"
      items={FEATURED_PROJECTS.map((p) => ({
        id: p.slug,
        nombre: p.name,
        /* La unidad de negocio: es lo que distingue a un proyecto de otro en una
           lista que mezcla comercial, industrial y vivienda. */
        pie: p.unit,
        foto: p.image,
      }))}
      onAbrir={(k, boton) => {
        origen.current = boton;
        setActivo(FEATURED_PROJECTS[k] ?? null);
      }}
    >
      <dialog
        ref={dialogo}
        className="home-ficha"
        aria-label={activo ? `Ficha de ${activo.name}` : "Ficha del proyecto"}
        onClose={() => {
          setActivo(null);
          origen.current?.focus();
        }}
        onClick={(evento) => {
          // El backdrop es el propio <dialog>: un clic fuera de la ficha cierra.
          if (evento.target === dialogo.current) setActivo(null);
        }}
      >
        {activo && (
          <article>
            <button
              type="button"
              className="home-ficha__x"
              onClick={() => setActivo(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>

            {/* El nombre va SOBRE la foto, no en una cabecera aparte: así la
                ficha se abre mostrando el proyecto y no una etiqueta. */}
            <div className="home-ficha__foto">
              {activo.image && (
                <Image
                  src={activo.image}
                  alt=""
                  fill
                  sizes="(max-width: 940px) 94vw, 880px"
                  className="home-ficha__img"
                />
              )}
              <h3 className="home-ficha__nombre">{activo.name}</h3>
            </div>

            <div className="home-ficha__cuerpo">
              <dl className="home-ficha__datos">
                <div className="home-ficha__d">
                  <dt>Unidad</dt>
                  <dd>{activo.unit}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>Ubicación</dt>
                  <dd>{activo.location}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>Estado</dt>
                  <dd>{activo.estado}</dd>
                </div>
              </dl>
              {activo.descripcion && <p>{activo.descripcion}</p>}
            </div>
          </article>
        )}
      </dialog>
    </CarrilTarjetas>
  );
}
