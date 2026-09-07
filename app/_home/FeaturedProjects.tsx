"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeaturedProject } from "./content";
import { FEATURED_PROJECTS, FEATURED_PROJECTS_INTRO } from "./content";

/** El corte de todos los paneles y de todas las chapas. */
const ANGULO = 11;
const RAD = (ANGULO * Math.PI) / 180;

/** Grosor del anillo de foco. Tiene que coincidir con el del CSS. */
const FOCO = 3;

/** Por debajo de aquí las bandas se apilan y no hay diagonales. */
const MOVIL = "(max-width: 820px)";

const [BANDA_1, BANDA_2] = [FEATURED_PROJECTS.slice(0, 3), FEATURED_PROJECTS.slice(3)];

/**
 * Seis paneles en paralelogramo, en dos bandas. El título es una celda más de
 * la primera.
 *
 * El desplazamiento de la diagonal sale del alto real de la celda, así que no
 * se puede escribir en el CSS: se calcula aquí al montar y en cada resize.
 */
export function FeaturedProjects() {
  const raiz = useRef<HTMLElement>(null);
  const [activo, setActivo] = useState<FeaturedProject | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  /* Quién abrió el diálogo, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    /* showModal y no `open`: es lo que atrapa el foco, habilita Escape y pinta
       el ::backdrop sin necesidad de una librería. */
    if (activo && !nodo.open) nodo.showModal();
    if (!activo && nodo.open) nodo.close();
  }, [activo]);

  const abrir = (proyecto: FeaturedProject, boton: HTMLButtonElement) => {
    origen.current = boton;
    setActivo(proyecto);
  };

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;

    const medir = () => {
      const movil = window.matchMedia(MOVIL).matches;
      /* El grosor de la costura vive en el CSS (--costura en .home-proyectos):
         de ahí salen también el aire de la sección y el hueco entre bandas. Se
         lee en cada medición para que un cambio —o una redefinición dentro de
         un media query— llegue aquí sin tocar este archivo. */
      const costura = parseFloat(getComputedStyle(nodo).getPropertyValue("--costura")) || 5;

      nodo.querySelectorAll<HTMLElement>(".js-banda").forEach((banda) => {
        const celdas = Array.from(banda.children) as HTMLElement[];
        // Todas las celdas de una banda miden lo mismo de alto, así que basta
        // con una medición por banda.
        const diagonal = Math.tan(RAD) * (celdas[0]?.offsetHeight ?? 0);

        celdas.forEach((celda, i) => {
          const primera = i === 0;
          const ultima = i === celdas.length - 1;
          const chapa = celda.querySelector<HTMLElement>(".js-chapa");

          if (movil) {
            // Se limpia lo calculado: un valor en línea le gana a la regla del
            // media query, así que sin esto el clip-path sobreviviría.
            celda.style.clipPath = "";
            celda.style.marginLeft = "";
            celda.style.removeProperty("--recorte-foco");
            if (chapa) {
              chapa.style.clipPath = "";
              chapa.style.setProperty("--chip", "0px");
              chapa.style.setProperty("--chipx", "0px");
            }
            return;
          }

          // Las orillas de la sección van rectas; los cortes, sólo hacia dentro.
          const izq = primera ? 0 : diagonal;
          const der = ultima ? 0 : diagonal;
          celda.style.clipPath =
            `polygon(${izq}px 0, 100% 0, calc(100% - ${der}px) 100%, 0 100%)`;

          /*
           * El margen negativo es lo que produce la separación, y es
           * contraintuitivo: el hueco entre dos diagonales paralelas no es el
           * margen de la caja, es el margen MÁS el desplazamiento de la
           * diagonal. Un `gap` normal dejaría `costura + diagonal` px de aire.
           * Solapando `diagonal - costura` queda la costura justa, igual a lo
           * largo de toda la altura.
           */
          celda.style.marginLeft = primera ? "0px" : `${-(diagonal - costura)}px`;

          /*
           * El anillo de foco repite la forma del panel, encogida. El
           * desplazamiento horizontal de un lado inclinado es FOCO / cos(ángulo),
           * no FOCO: con el valor recto el anillo saldría más fino en las
           * diagonales que en los lados rectos.
           */
          const h = FOCO / Math.cos(RAD);
          celda.style.setProperty(
            "--recorte-foco",
            `polygon(${izq + h}px ${FOCO}px, calc(100% - ${h}px) ${FOCO}px, ` +
              `calc(100% - ${der + h}px) calc(100% - ${FOCO}px), ${h}px calc(100% - ${FOCO}px))`,
          );

          if (chapa) {
            /*
             * La primera celda de cada banda tiene el borde izquierdo recto, así
             * que su chapa también va recta: inclinada contra un borde recto
             * dejaba una cuña vacía en la esquina superior.
             *
             * Con --chip en 0 el polígono degenera en rectángulo y el padding
             * lateral vuelve a sus 18px, pero se pone `clip-path: none` de todos
             * modos para que quede dicho en el DOM.
             *
             * En la banda 1 la primera celda es la del título, que no lleva
             * chapa: ahí Paseo La Fe conserva su borde diagonal y su
             * inclinación. El único panel afectado es el primero de la banda 2.
             */
            if (primera) {
              chapa.style.clipPath = "none";
              chapa.style.setProperty("--chip", "0px");
              chapa.style.setProperty("--chipx", "0px");
            } else {
              // Mismo ángulo, pero sobre el alto de la chapa: con el del panel
              // saldría deformada.
              const propia = Math.tan(RAD) * chapa.offsetHeight;
              chapa.style.clipPath = "";
              chapa.style.setProperty("--chip", `${propia}px`);
              // `diagonal / 2` es donde cae el borde del panel a media altura;
              // restarle medio corrimiento propio deja la chapa a ras y paralela.
              chapa.style.setProperty("--chipx", `${diagonal / 2 - propia / 2}px`);
            }
          }
        });
      });
    };

    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const [linea1, linea2] = FEATURED_PROJECTS_INTRO.titulo;

  return (
    <section ref={raiz} className="home-proyectos">
      <div className="home-proyectos__banda js-banda">
        <div className="home-proyectos__celda home-proyectos__titulo">
          <h2>
            {linea1}
            <span className="home-proyectos__titulo-2">{linea2}</span>
          </h2>
        </div>
        {BANDA_1.map((p) => (
          <Panel key={p.slug} proyecto={p} onAbrir={abrir} />
        ))}
      </div>

      <div className="home-proyectos__banda js-banda">
        {BANDA_2.map((p) => (
          <Panel key={p.slug} proyecto={p} onAbrir={abrir} />
        ))}
      </div>

      <dialog
        ref={dialogo}
        className="home-proyectos__dialogo"
        onClose={() => {
          setActivo(null);
          /* Los navegadores modernos ya lo devuelven solos, pero se hace
             explícito: el panel de origen puede haberse re-renderizado. */
          origen.current?.focus();
        }}
        onClick={(evento) => {
          // El backdrop es el propio <dialog>: un clic fuera de la ficha cierra.
          if (evento.target === dialogo.current) setActivo(null);
        }}
      >
        {activo && (
          <article className="home-proyectos__ficha">
            <button
              type="button"
              className="home-proyectos__cerrar"
              onClick={() => setActivo(null)}
              aria-label="Cerrar ficha"
            >
              ×
            </button>

            {activo.image && (
              <Image
                className="home-proyectos__ficha-foto"
                src={activo.image}
                alt=""
                aria-hidden
                width={1280}
                height={720}
                sizes="(max-width: 720px) 92vw, 640px"
              />
            )}

            <div className="home-proyectos__ficha-cuerpo">
              <span className="home-proyectos__giro">{activo.unit}</span>
              <h3 className="home-proyectos__ficha-nombre">{activo.name}</h3>
              <p className="home-proyectos__ficha-lugar">{activo.location}</p>
            </div>
          </article>
        )}
      </dialog>
    </section>
  );
}

interface PanelProps {
  proyecto: FeaturedProject;
  onAbrir: (proyecto: FeaturedProject, boton: HTMLButtonElement) => void;
}

function Panel({ proyecto, onAbrir }: PanelProps) {
  return (
    <div className="home-proyectos__celda home-proyectos__celda--enlace">
      {/*
        Botón y no enlace: abre un diálogo, no navega. Un <a> que no lleva a
        ninguna parte rompe el clic con rueda y el "abrir en pestaña nueva", y
        el lector de pantalla anuncia un destino que no existe.
        El área de pulsación sigue siendo el panel entero.
      */}
      <button
        type="button"
        className="home-proyectos__panel"
        aria-haspopup="dialog"
        onClick={(evento) => onAbrir(proyecto, evento.currentTarget)}
      >
        <span className="home-proyectos__lienzo">
          <span className="home-proyectos__foto">
            {proyecto.image && (
              <Image
                src={proyecto.image}
                alt=""
                aria-hidden
                fill
                /*
                  No es el ancho del panel. La caja es más alta que ancha y la
                  foto entra con `cover`, así que el recorte lo manda el ALTO:
                  a 1920 el panel mide ~640 de ancho y la foto acaba
                  renderizándose a ~880, más el 9% del hover. Declarar el ancho
                  del contenedor pediría la mitad de la resolución necesaria.
                */
                sizes="(max-width: 820px) 100vw, 950px"
              />
            )}
          </span>
          <span className="home-proyectos__degradado" aria-hidden="true" />

          <span className="home-proyectos__chapa js-chapa">
            <span className="home-proyectos__nombre">{proyecto.name}</span>
            <span className="home-proyectos__giro">{proyecto.unit}</span>
          </span>
        </span>
      </button>
    </div>
  );
}
