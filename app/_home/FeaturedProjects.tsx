"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeaturedProject } from "./content";
import { FEATURED_PROJECTS, FEATURED_PROJECTS_INTRO } from "./content";

/** Grados por defecto si el CSS no los declara. El valor real sale de
 *  `--angulo` en .home-proyectos, que en móvil lo baja. */
const ANGULO_BASE = 11;

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
      /* La costura y el ángulo viven en el CSS (--costura y --angulo en
         .home-proyectos): de la primera salen también el aire de la sección y
         el hueco entre bandas, y el segundo baja en móvil, donde el corte se
         come demasiado ancho de tarjeta. Se leen en cada medición para que un
         cambio —o una redefinición dentro de un media query— llegue aquí sin
         tocar este archivo. */
      const estilo = getComputedStyle(nodo);
      const costura = parseFloat(estilo.getPropertyValue("--costura")) || 5;
      const rad = ((parseFloat(estilo.getPropertyValue("--angulo")) || ANGULO_BASE) * Math.PI) / 180;

      const bandas = Array.from(nodo.querySelectorAll<HTMLElement>(".js-banda"));
      const hijos = (b: HTMLElement) => Array.from(b.children) as HTMLElement[];

      /*
       * En escritorio cada banda es una fila. En móvil las dos bandas pasan a
       * `display: contents` y sus paneles forman UNA sola fila dentro del
       * carril, así que hay que unirlas aquí también: si se siguieran tratando
       * como dos, el primer panel de la segunda banda recibiría el borde recto
       * que sólo le toca al que abre la fila.
       *
       * La celda del titular se excluye: en móvil está oculta y el titular vive
       * fuera del carril.
       */
      const filas: HTMLElement[][] = movil
        ? [bandas.flatMap(hijos).filter((c) => !c.classList.contains("js-titulo"))]
        : bandas.map(hijos);

      filas.forEach((celdas) => {
        /*
         * En fila el corte va a los lados y su desplazamiento sale del ALTO de
         * la celda; apiladas va arriba y abajo y sale del ANCHO. Todas las
         * celdas de una serie miden igual, así que basta una medición.
         */
        const primeraCelda = celdas[0];
        const diagonal =
          Math.tan(rad) * (movil ? (primeraCelda?.offsetWidth ?? 0) : (primeraCelda?.offsetHeight ?? 0));

        celdas.forEach((celda, i) => {
          const primera = i === 0;
          const ultima = i === celdas.length - 1;
          const chapa = celda.querySelector<HTMLElement>(".js-chapa");

          /*
           * La celda del titular no lleva recorte: se quedó sin fondo propio,
           * así que el corte no dibujaría ninguna diagonal — sólo cortaría el
           * texto, y «Nuestros proyectos» se pasa por 1px del hueco que le deja.
           * El aire contra el panel vecino lo pone su padding derecho.
           */
          if (celda.classList.contains("js-titulo")) {
            celda.style.clipPath = "";
            celda.style.marginLeft = "0px";
            celda.style.marginTop = "";
            celda.style.removeProperty("--recorte-foco");
            return;
          }

          // Las orillas de la serie van rectas; los cortes, sólo hacia dentro.
          const inicio = primera ? 0 : diagonal;
          const fin = ultima ? 0 : diagonal;

          /*
           * Apiladas el corte gira 90°: pasa a los bordes superior e inferior,
           * que es donde está la costura entre tarjetas contiguas. En fila esa
           * costura es vertical y el corte va a los lados; puesto en vertical,
           * el corte lateral quedaría como dos cuñas vacías contra las orillas
           * de la pantalla en vez de como una banda.
           *
           * Los dos bordes se inclinan en el mismo sentido, que es lo que deja
           * las costuras paralelas.
           */
          celda.style.clipPath = movil
            ? `polygon(0 ${inicio}px, 100% 0, 100% calc(100% - ${fin}px), 0 100%)`
            : `polygon(${inicio}px 0, 100% 0, calc(100% - ${fin}px) 100%, 0 100%)`;

          /*
           * El margen negativo es lo que produce la separación, y es
           * contraintuitivo: el hueco entre dos diagonales paralelas no es el
           * margen de la caja, es el margen MÁS el desplazamiento de la
           * diagonal. Un `gap` normal dejaría `costura + diagonal` px de aire.
           * Solapando `diagonal - costura` queda la costura justa, igual a lo
           * largo de toda la altura.
           */
          const solape = primera ? "0px" : `${-(diagonal - costura)}px`;
          celda.style.marginLeft = movil ? "" : solape;
          celda.style.marginTop = movil ? solape : "";

          /*
           * El anillo de foco repite la forma del panel, encogida. El
           * desplazamiento horizontal de un lado inclinado es FOCO / cos(ángulo),
           * no FOCO: con el valor recto el anillo saldría más fino en las
           * diagonales que en los lados rectos.
           */
          const h = FOCO / Math.cos(rad);
          celda.style.setProperty(
            "--recorte-foco",
            movil
              ? `polygon(${FOCO}px ${inicio + h}px, calc(100% - ${FOCO}px) ${h}px, ` +
                  `calc(100% - ${FOCO}px) calc(100% - ${fin + h}px), ${FOCO}px calc(100% - ${h}px))`
              : `polygon(${inicio + h}px ${FOCO}px, calc(100% - ${h}px) ${FOCO}px, ` +
                  `calc(100% - ${fin + h}px) calc(100% - ${FOCO}px), ${h}px calc(100% - ${FOCO}px))`,
          );

          if (chapa) {
            /*
             * La celda que abre la fila tiene el borde izquierdo recto, así que
             * su chapa también: inclinada contra un borde recto dejaba una cuña
             * vacía en la esquina superior.
             *
             * Con --chip en 0 el polígono degenera en rectángulo y el padding
             * lateral vuelve a sus 18px, pero se pone `clip-path: none` de todos
             * modos para que quede dicho en el DOM.
             *
             * En escritorio la primera celda de la banda 1 es la del titular,
             * que no lleva chapa: ahí Paseo La Fe conserva su inclinación y el
             * único afectado es el primer panel de la banda 2. En móvil, con las
             * seis en una fila, el afectado es Paseo La Fe.
             */
            if (movil || primera) {
              chapa.style.clipPath = "none";
              chapa.style.setProperty("--chip", "0px");
              chapa.style.setProperty("--chipx", "0px");
            } else {
              // Mismo ángulo, pero sobre el alto de la chapa: con el del panel
              // saldría deformada.
              const propia = Math.tan(rad) * chapa.offsetHeight;
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
      {/*
        El titular existe dos veces, y sólo una está en el DOM a la vez: cada
        breakpoint oculta la otra con `display: none`, que también la saca del
        árbol de accesibilidad, así que el lector anuncia un solo encabezado.

        Hace falta porque las dos posiciones son incompatibles: en escritorio es
        una celda de la primera banda, y en móvil tiene que quedar FUERA del
        carril que se desliza. Un mismo nodo no puede estar dentro y fuera de un
        contenedor con scroll.
      */}
      <h2 className="home-proyectos__titulo-suelto">
        {linea1}
        <span className="home-proyectos__titulo-2">{linea2}</span>
      </h2>

      <div className="home-proyectos__banda js-banda">
        <div className="home-proyectos__celda home-proyectos__titulo js-titulo">
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
