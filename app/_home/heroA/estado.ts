/**
 * El estado que comparten el timeline de GSAP, la escena 3D y el campo de puntos.
 *
 * Es un objeto mutable y NO estado de React a propósito: lo escribe GSAP a 60
 * fps y lo leen dos bucles de render. Pasarlo por useState provocaría un render
 * por frame de todo el hero, y ninguno de esos renders cambiaría una sola
 * etiqueta del DOM.
 */
export type EstadoHero = {
  /** 0 = piezas dispersas y en alambre · 1 = encajadas y en hormigón. */
  ensamble: number;
  /** Rotación Y del conjunto. GIRO_ESCORZO al empezar, 0 cuando está de frente. */
  giro: number;
  /** Rotación X del conjunto. Acompaña al giro. */
  alto: number;
  /**
   * Altura de la luz clave, 0 a 1.
   *
   * 0 la deja en su posición de trabajo —baja y lateral, la que modela el
   * hormigón mientras se ensambla— y 1 casi cenital, con la sombra recogida bajo
   * la pieza. Sube con el enderezado, no con el ensamble: ver HeroA.
   */
  cenit: number;
  /**
   * Avance del frente de onda del campo de puntos, 0 a 1.
   *
   * Es el progreso CRUDO del recorrido, no un tramo del timeline: el campo se
   * construye a lo largo de todo el scroll, de dentro hacia afuera.
   */
  campo: number;
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
  cenit: 0,
  campo: 0,
});

/** Todo montado, de frente y con el campo entero. Es el estado con movimiento
 *  reducido y sin JS. */
export const estadoFinal = (): EstadoHero => ({
  ensamble: 1,
  giro: 0,
  alto: 0,
  cenit: 1,
  campo: 1,
});
