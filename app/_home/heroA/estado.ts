/**
 * El estado que comparten el timeline de GSAP y la escena 3D.
 *
 * Es un objeto mutable y NO estado de React a propósito: lo escribe GSAP a 60
 * fps y lo lee el bucle de render. Pasarlo por useState provocaría un render por
 * frame de todo el hero, y ninguno de esos renders cambiaría una sola etiqueta
 * del DOM.
 */
export type EstadoHero = {
  /** 0 = piezas dispersas y en alambre · 1 = encajadas y en hormigón. */
  ensamble: number;
  /** Rotación Y del conjunto. GIRO_ESCORZO al empezar, 0 cuando está de frente. */
  giro: number;
  /** Rotación X del conjunto. Acompaña al giro. */
  alto: number;
};

/**
 * De lado, no de frente.
 *
 * El ensamble se ve en escorzo porque desde ahí se leen los cantos de las piezas
 * y, por tanto, su grosor. De frente serían siluetas planas moviéndose.
 */
export const GIRO_ESCORZO = -0.98;
export const ALTO_ESCORZO = 0.26;

/** A mitad del ensamble el escorzo ya se ha abierto un poco, pero sigue de lado. */
export const GIRO_MEDIO = -0.74;
export const ALTO_MEDIO = 0.19;

export const estadoInicial = (): EstadoHero => ({
  ensamble: 0,
  giro: GIRO_ESCORZO,
  alto: ALTO_ESCORZO,
});

/** Todo montado y de frente. Es el estado con movimiento reducido y sin JS. */
export const estadoFinal = (): EstadoHero => ({ ensamble: 1, giro: 0, alto: 0 });
