"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CarrilTarjetas } from "@/app/ui/CarrilTarjetas";
import { LogoDesarrollo } from "@/app/ui/LogoDesarrollo";
import { logoDe } from "@/lib/logos-desarrollos";
import { textos } from "@/app/ui/textos";
import { useIdioma } from "@/app/ui/useIdioma";
import type { FeaturedProject } from "./content";
import { useContenidoHome } from "./ContenidoHome";

/**
 * Los proyectos del home, en un recorrido horizontal.
 *
 * El carril y la tarjeta ya no viven aquí: son <CarrilTarjetas> en ui/, que
 * comparte con las plazas de /comercial. Lo que queda es lo propio del home —qué
 * se pone en cada tarjeta y qué ficha abre—, que es justo lo que las dos
 * secciones no comparten.
 */

/*
 * ⚠ LOS ITEMS, MEMORIZADOS, NO EN EL JSX. <CarrilTarjetas> rehace su animación
 * cuando cambia `items`, y un `.map()` en el JSX es un arreglo nuevo en cada
 * render: abrir o cerrar una ficha (setActivo) volvía a montar el carril entero
 * —otro juego de ScrollTriggers, otro oyente de resize y la entrada de las
 * tarjetas repetida— encima del anterior. Antes se armaban una vez al cargar el
 * módulo; desde que el contenido viene de Sanity (nov 2026), con useMemo.
 */
export function CarrilProyectos() {
  const idioma = useIdioma();
  const { FEATURED_PROJECTS, FEATURED_PROJECTS_INTRO } = useContenidoHome();
  /* Una lista estable mientras no cambie el contenido: ver la nota de arriba
     sobre por qué el carril no puede recibir un arreglo nuevo en cada render. */
  const items = useMemo(
    () =>
      FEATURED_PROJECTS.map((p) => ({
        id: p.slug,
        nombre: p.name,
        /* La unidad de negocio: es lo que distingue a un proyecto de otro en una
           lista que mezcla comercial, industrial y vivienda. */
        pie: p.unit,
        foto: p.image,
      })),
    [FEATURED_PROJECTS],
  );
  const t = textos(idioma).ficha;
  const dialogo = useRef<HTMLDialogElement>(null);
  const [activo, setActivo] = useState<FeaturedProject | null>(null);
  const logoActivo = activo ? logoDe(activo.slug) : undefined;
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
      items={items}
      onAbrir={(k, boton) => {
        origen.current = boton;
        setActivo(FEATURED_PROJECTS[k] ?? null);
      }}
    >
      <dialog
        ref={dialogo}
        className="home-ficha"
        aria-label={activo ? t.de(activo.name) : t.delProyecto}
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
              aria-label={t.cerrar}
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
              {/* Con logo del desarrollo, el logo en lugar del nombre (2 nov
                  2026); ver lib/logos-desarrollos.ts. */}
              <h3
                className={
                  logoActivo
                    ? "home-ficha__nombre home-ficha__nombre--logo"
                    : "home-ficha__nombre"
                }
              >
                {logoActivo ? (
                  <LogoDesarrollo logo={logoActivo} nombre={activo.name} />
                ) : (
                  activo.name
                )}
              </h3>
            </div>

            <div className="home-ficha__cuerpo">
              <dl className="home-ficha__datos">
                <div className="home-ficha__d">
                  <dt>{t.unidad}</dt>
                  <dd>{activo.unit}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>{t.ubicacion}</dt>
                  <dd>{activo.location}</dd>
                </div>
                <div className="home-ficha__d">
                  <dt>{t.estado}</dt>
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
