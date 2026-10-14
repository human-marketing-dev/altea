"use client";

import { useEffect, useRef } from "react";
import { TarjetaProyecto } from "./TarjetaProyecto";
import type { TarjetaCarril } from "./CarrilTarjetas";

/**
 * Las mismas tarjetas, movidas a mano: un carrusel con desplazamiento nativo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POR QUÉ NO ES EL CARRIL DEL HOME
 *
 * <CarrilTarjetas> fija la sección y la arrastra con el recorrido vertical de la
 * página. En /comercial eso no cabe: EL HERO YA ESTÁ FIJADO, y dos bloques
 * seguidos que secuestran el scroll marean y hacen que la página se sienta
 * atascada — bajas y no avanzas. Con un carrusel, quien quiera ver las ocho
 * entra, y quien no, sigue bajando.
 *
 * El desplazamiento es NATIVO: `overflow-x` con `scroll-snap`. Las flechas, el
 * teclado y el arrastre sólo empujan ese mismo scroll, así que el trackpad, el
 * dedo y la rueda horizontal siguen funcionando sin que haya que programarlos.
 */

export interface CarruselTarjetasProps {
  titulo: string;
  /** El id del <h2>, para el aria-labelledby de la sección. */
  tituloId: string;
  items: TarjetaCarril[];
  /** Qué hacer al pulsar una tarjeta. El botón viene para devolverle el foco. */
  onAbrir: (indice: number, boton: HTMLButtonElement) => void;
  /** Lo que se monta dentro de la sección pero fuera del carrusel: el diálogo. */
  children?: React.ReactNode;
}

export function CarruselTarjetas({
  titulo,
  tituloId,
  items,
  onAbrir,
  children,
}: CarruselTarjetasProps) {
  const pista = useRef<HTMLUListElement>(null);
  const contador = useRef<HTMLSpanElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const ant = useRef<HTMLButtonElement>(null);
  const sig = useRef<HTMLButtonElement>(null);
  /**
   * ⚠ EL CLIC QUE VIENE DETRÁS DE UN ARRASTRE NO DEBE ABRIR LA FICHA.
   *
   * Al soltar el ratón el navegador dispara un `click` normal sobre la tarjeta
   * donde se soltó; sin esta marca, arrastrar el carrusel abre una ficha. Se
   * pone al arrastrar y la consume el manejador del clic.
   */
  const arrastrado = useRef(false);
  /**
   * CON DOS O MENOS NO HAY CARRUSEL: hay una rejilla de tantas columnas como
   * tarjetas. Dos tarjetas de carrusel dejan media sección vacía a la derecha
   * y unas flechas que no llevan a ningún sitio. Hoy es Vivienda (Amarantha y
   * Reserva Mezquital). Sin flechas, sin contador, sin barra y sin parallax:
   * no hay recorrido que contar.
   */
  const fija = items.length <= 2;

  useEffect(() => {
    const carril = pista.current;
    if (!carril || fija) return;
    /* Copiados a variables locales: los `ref.current` del cierre de limpieza ya
       podrían apuntar a otro nodo cuando se ejecute. */
    const btAnt = ant.current;
    const btSig = sig.current;
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /**
     * El paso se MIDE, no se supone.
     *
     * Es la distancia entre el borde izquierdo de una tarjeta y el de la
     * siguiente. Calcularlo del ancho más el hueco se desincroniza en cuanto uno
     * de los dos `clamp` cambia de tramo, y entonces la flecha deja de caer en
     * una tarjeta.
     */
    const paso = () => {
      const tarjetas = carril.children;
      const a = tarjetas[0]?.getBoundingClientRect();
      if (!a) return 0;
      const b = tarjetas[1]?.getBoundingClientRect();
      return (b ? b.left - a.left : 0) || a.width;
    };

    const pintar = () => {
      /*
       * EL PARALLAX, calculado de la posición de cada tarjeta en la VENTANA.
       *
       * La foto corre al revés que el carril: es lo que evita que un carrusel de
       * tarjetas se vea como una tira de postales, y por eso la capa de la foto
       * sobresale un 12 % por lado —sin ese sobrante, al desplazarla se
       * descubrirían los bordes—. Aquí no lo manda ScrollTrigger como en el
       * home, porque lo que se mueve es el carril y no la página.
       */
      if (!reducido) {
        const vw = window.innerWidth;
        for (const tarjeta of Array.from(carril.children)) {
          const foto = tarjeta.querySelector<HTMLElement>(".js-tarjeta-foto");
          if (!foto) continue;
          const r = tarjeta.getBoundingClientRect();
          const centro = (r.left + r.width / 2 - vw / 2) / vw;
          const acotado = Math.max(-1, Math.min(1, centro));
          foto.style.transform = `translateX(${(acotado * 8).toFixed(2)}%)`;
        }
      }

      const max = carril.scrollWidth - carril.clientWidth;
      const avance = max > 0 ? carril.scrollLeft / max : 0;
      if (barra.current)
        barra.current.style.width = `${(avance * 100).toFixed(2)}%`;

      const anchoPaso = paso();
      const k = anchoPaso
        ? Math.min(items.length, Math.round(carril.scrollLeft / anchoPaso) + 1)
        : 1;
      const texto = String(k).padStart(2, "0");
      /* Al DOM y no por setState: `scroll` corre a 60 fps y esto son ocho
         valores en todo el recorrido. */
      if (contador.current && contador.current.textContent !== texto) {
        contador.current.textContent = texto;
      }

      if (btAnt) btAnt.disabled = carril.scrollLeft <= 2;
      if (btSig) btSig.disabled = carril.scrollLeft >= max - 2;
    };

    carril.addEventListener("scroll", pintar, { passive: true });
    window.addEventListener("resize", pintar);
    pintar();

    const mover = (d: number) =>
      carril.scrollBy({
        left: d * paso(),
        behavior: reducido ? "auto" : "smooth",
      });

    const alPulsarSig = () => mover(1);
    const alPulsarAnt = () => mover(-1);
    btSig?.addEventListener("click", alPulsarSig);
    btAnt?.addEventListener("click", alPulsarAnt);

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        mover(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        mover(-1);
      }
    };
    carril.addEventListener("keydown", alTeclear);

    /*
     * ARRASTRE CON EL RATÓN. En táctil y en trackpad el desplazamiento nativo ya
     * funciona; esto es para quien arrastra con el ratón, que es lo que la gente
     * intenta hacer con un carrusel de tarjetas.
     */
    let agarre: { x: number; inicio: number; movido: boolean } | null = null;

    const alBajar = (e: PointerEvent) => {
      /*
       * ⚠ LA MARCA SE LIMPIA AQUÍ, al empezar cada interacción, y no sólo al
       * consumirla en el clic. Si se deja puesta esperando al clic que la
       * consuma, basta con que un arrastre NO acabe en clic sobre una tarjeta
       * para que sobreviva y se coma el SIGUIENTE clic bueno. El síntoma es
       * desconcertante: la ficha deja de abrirse una vez y a la siguiente
       * vuelve a funcionar.
       */
      arrastrado.current = false;
      if (e.pointerType !== "mouse") return;
      agarre = { x: e.clientX, inicio: carril.scrollLeft, movido: false };
      /* ⚠ La captura NO se pide aquí: ver alMover. */
    };
    const alMover = (e: PointerEvent) => {
      if (!agarre) return;
      const d = e.clientX - agarre.x;
      if (!agarre.movido && Math.abs(d) > 4) {
        agarre.movido = true;
        /*
         * ⚠ LA CAPTURA SE PIDE AL EMPEZAR EL ARRASTRE, NO EN `pointerdown`, Y
         * ESTO ES LO QUE IMPEDÍA ABRIR LA FICHA.
         *
         * Con la captura tomada en `pointerdown`, el `pointerup` de un CLIC
         * NORMAL se redirige al carril, y entonces el navegador calcula el
         * `click` sobre el ancestro común de los dos destinos —el carril— en vez
         * de sobre el botón. Comprobado con clics reales por CDP: `pointerdown`
         * llegaba a .altea-tj y `pointerup` y `click` a
         * .altea-carrusel__pista, así que el onClick del botón no corría NUNCA y
         * la ficha no se abría ni una vez.
         *
         * Pedida aquí, un clic sin arrastre no la toca y llega al botón; y el
         * arrastre sigue teniéndola, que es lo que mantiene el scroll si el
         * puntero se sale del carril.
         */
        carril.setPointerCapture(e.pointerId);
        /*
         * ⚠ EL IMÁN SE APAGA MIENTRAS SE ARRASTRA. Con `scroll-snap` activo,
         * cada movimiento del puntero pelea contra el imán: el arrastre se
         * siente pegajoso y da tirones. Se devuelve al soltar, y entonces el
         * imán coloca la tarjeta en su sitio, que es cuando sí se quiere.
         */
        carril.classList.add("altea-carrusel--arrastrando");
      }
      if (agarre.movido) carril.scrollLeft = agarre.inicio - d;
    };
    const alSoltar = () => {
      if (!agarre) return;
      carril.classList.remove("altea-carrusel--arrastrando");
      if (agarre.movido) arrastrado.current = true;
      agarre = null;
    };
    carril.addEventListener("pointerdown", alBajar);
    carril.addEventListener("pointermove", alMover);
    carril.addEventListener("pointerup", alSoltar);
    carril.addEventListener("pointercancel", alSoltar);

    return () => {
      carril.removeEventListener("scroll", pintar);
      window.removeEventListener("resize", pintar);
      btSig?.removeEventListener("click", alPulsarSig);
      btAnt?.removeEventListener("click", alPulsarAnt);
      carril.removeEventListener("keydown", alTeclear);
      carril.removeEventListener("pointerdown", alBajar);
      carril.removeEventListener("pointermove", alMover);
      carril.removeEventListener("pointerup", alSoltar);
      carril.removeEventListener("pointercancel", alSoltar);
    };
  }, [items, fija]);

  const total = String(items.length).padStart(2, "0");

  return (
    <section
      className="altea-carrusel"
      data-fija={fija ? "" : undefined}
      aria-labelledby={tituloId}
    >
      <div className="altea-carrusel__cab">
        <h2 className="altea-carrusel__titulo" id={tituloId}>
          {titulo}
        </h2>

        {!fija && (
          <div className="altea-carrusel__mando">
            {/* aria-hidden: es un indicador de posición dentro de un recorrido
              visual, y leído en voz alta no dice nada que la lista no diga. */}
            <p className="altea-carrusel__n" aria-hidden="true">
              <span ref={contador}>01</span> — {total}
            </p>
            <div className="altea-carrusel__fl">
              <button
                type="button"
                className="altea-carrusel__bt"
                ref={ant}
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                type="button"
                className="altea-carrusel__bt"
                ref={sig}
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* tabIndex para que las flechas del teclado lleguen al carril. Sigue
          siendo una lista: no se le pone otro rol encima. */}
      <ul
        className="altea-carrusel__pista"
        ref={pista}
        tabIndex={fija ? undefined : 0}
        aria-label={titulo}
        style={fija ? { ["--cols" as string]: items.length } : undefined}
      >
        {items.map((item, k) => (
          <li key={item.id}>
            <TarjetaProyecto
              nombre={item.nombre}
              pie={item.pie}
              foto={item.foto}
              etiqueta={item.etiqueta}
              onClick={(boton) => {
                if (arrastrado.current) {
                  arrastrado.current = false;
                  return;
                }
                onAbrir(k, boton);
              }}
            />
          </li>
        ))}
      </ul>

      {!fija && (
        <div className="altea-carrusel__barra" aria-hidden="true">
          <span ref={barra} />
        </div>
      )}

      {children}
    </section>
  );
}
