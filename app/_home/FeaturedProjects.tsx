"use client";

import { useEffect, useRef, useState } from "react";
import { MediaSlot } from "@/app/ui";
import { FEATURED_PROJECTS } from "./content";

type Project = (typeof FEATURED_PROJECTS)[number];

/**
 * Franja de proyectos en paneles inclinados. Al dar click se despliega la ficha
 * con la información general del proyecto.
 */
export function FeaturedProjects() {
  const [active, setActive] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  return (
    <section className="home-projects">
      <h2 className="home-projects__title">
        Nuestros proyectos
        <br />
        más relevantes
      </h2>

      <ul className="home-projects__track">
        {FEATURED_PROJECTS.map((project) => (
          <li key={project.slug} className="home-projects__item">
            <button
              type="button"
              className="home-projects__button"
              onClick={() => setActive(project)}
            >
              <span className="home-projects__media-wrap">
                <MediaSlot
                  label={`Render ${project.name}`}
                  src={project.image}
                  alt={project.name}
                  tone="dark"
                  /*
                    El panel mide ~190px de ancho pero ~360 de alto, y la foto
                    entra con object-fit: cover. En un contenedor vertical con
                    fuente apaisada, el recorte lo manda el ALTO: la imagen se
                    escala hasta cubrir 360px, y su ancho renderizado acaba en
                    ~540px. Declarar el ancho del contenedor (20vw ≈ 300px)
                    hacía que el navegador pidiera la mitad de la resolución
                    necesaria y la estirara.
                  */
                  sizes="560px"
                  className="home-projects__media"
                />
              </span>
              <span className="home-projects__name">{project.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="home-projects__dialog"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActive(null);
        }}
      >
        {active && (
          <article className="home-projects__ficha">
            <button
              type="button"
              className="home-projects__close"
              onClick={() => setActive(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>
            <MediaSlot
              label={`Render ${active.name}`}
              src={active.image}
              alt={active.name}
              ratio="16 / 9"
              sizes="(max-width: 720px) 90vw, 640px"
            />
            <div className="home-projects__ficha-body">
              <span className="home-projects__ficha-unit">{active.unit}</span>
              <h3 className="home-projects__ficha-title">{active.name}</h3>
              <p className="home-projects__ficha-location">{active.location}</p>
              <p className="home-projects__ficha-note">
                Información general del proyecto — pendiente de Altea.
              </p>
            </div>
          </article>
        )}
      </dialog>
    </section>
  );
}
