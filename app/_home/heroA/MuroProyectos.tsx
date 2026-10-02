"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { MURO_HERO } from "../content";

/**
 * El muro que se pliega detrás de la A.
 *
 * Las hojas NO van sobre una línea: van sobre un ARCO. Cada una se sitúa por su
 * recorrido, y de ese único número salen a la vez su posición, su profundidad y
 * su giro — por eso el conjunto se dobla hacia atrás en los costados en vez de
 * ser una tira plana que se desplaza.
 *
 * Y van pegadas y fundidas: cada hoja es más ancha que su paso, y ese sobrante
 * es exactamente lo que se difumina contra la vecina. Así el borde de una cae
 * donde la siguiente ya es opaca y la unión desaparece. Sin la máscara vertical
 * quedan los cantos de arriba y abajo a la vista, que es lo que delata que son
 * tarjetas.
 *
 * El posicionado va en JS porque depende del alto del viewport y del radio, que
 * a su vez depende del ancho: son dos medidas que el CSS no puede multiplicar
 * entre sí. Se engancha a gsap.ticker en vez de abrir su propio
 * requestAnimationFrame para que el hero tenga UN solo reloj.
 */

/**
 * Cuánto sobra cada hoja respecto a su paso.
 *
 * 0.52 es lo que hace falta para que el difuminado de una llegue hasta donde la
 * vecina ya es opaca. Bajarlo deja una banda más clara en cada unión.
 */
const SOLAPE = 0.52;

/** Más allá de este ángulo la hoja está tan de perfil que solo estorba. */
const LIMITE = 1.15;

/** Píxeles de avance por frame. Es deriva, no scroll: no depende del recorrido. */
const DERIVA = 0.35;

export function MuroProyectos({
  visible,
  reducido,
}: {
  /**
   * Cuándo montar las <Image>.
   *
   * Son ocho fotos y todas están dentro del viewport desde el principio —el muro
   * arranca en opacity 0, y la opacidad no cuenta para IntersectionObserver—, así
   * que el `loading="lazy"` de next/image no las frena. Si se montaran de entrada
   * competirían por el ancho de banda con el LCP, que es el titular. HeroA las
   * enciende en cuanto el recorrido arranca, mucho antes de que el muro se vea.
   */
  visible: boolean;
  reducido: boolean;
}) {
  const arco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = arco.current;
    if (!nodo) return;

    const hojas = Array.from(nodo.children) as HTMLElement[];
    let paso = 0;
    let largo = 0;
    let radio = 1500;
    let avance = 0;

    const medir = () => {
      const alto = Math.max(300, Math.min(760, window.innerHeight * 0.82));
      paso = alto * 0.66;
      const ancho = paso * (1 + SOLAPE);
      radio = Math.max(1100, window.innerWidth * 1.15);
      largo = paso * hojas.length;
      /* El punto donde la máscara horizontal llega a opaca: es el sobrante
         expresado como porcentaje del ancho de la hoja. */
      const fundido = `${((SOLAPE / (1 + SOLAPE)) * 100).toFixed(2)}%`;
      for (const h of hojas) {
        h.style.width = `${ancho}px`;
        h.style.height = `${alto}px`;
        h.style.left = `${-ancho / 2}px`;
        h.style.top = `${-alto / 2}px`;
        h.style.setProperty("--fundido", fundido);
      }
      colocar();
    };

    function colocar() {
      if (!largo) return;
      hojas.forEach((h, i) => {
        let s = (i * paso - avance) % largo;
        if (s < 0) s += largo;
        if (s > largo / 2) s -= largo; // reparte a los dos lados del centro

        const a = s / radio; // radianes sobre el arco
        const x = Math.sin(a) * radio;
        const z = Math.cos(a) * radio - radio; // el centro del arco queda en z=0
        h.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${((a * 180) / Math.PI).toFixed(2)}deg)`;
        h.style.opacity =
          Math.abs(a) > LIMITE ? "0" : (1 - (Math.abs(a) / LIMITE) * 0.45).toFixed(3);
      });
    }

    medir();
    window.addEventListener("resize", medir);

    if (reducido) {
      return () => window.removeEventListener("resize", medir);
    }

    const correr = () => {
      avance += DERIVA;
      colocar();
    };
    gsap.ticker.add(correr);
    return () => {
      gsap.ticker.remove(correr);
      window.removeEventListener("resize", medir);
    };
  }, [reducido]);

  return (
    <div className="hero-a__muro" aria-hidden="true">
      <div className="hero-a__arco" ref={arco}>
        {MURO_HERO.map((p) => (
          <div className="hero-a__hoja" key={p.nombre}>
            {visible && (
              <Image
                src={p.foto}
                alt=""
                fill
                sizes="760px"
                /* Va en gris, a bajo brillo y bajo un velo: el detalle fino no
                   llega a verse, así que 62 ahorra la mitad del peso de ocho
                   fotos sin que se note en pantalla. */
                quality={62}
                className="hero-a__foto"
              />
            )}
          </div>
        ))}
      </div>
      <div className="hero-a__velo" />
    </div>
  );
}
