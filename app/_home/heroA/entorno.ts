import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  PMREMGenerator,
  type Texture,
  type WebGLRenderer,
} from "three";

/**
 * El entorno: lo que de verdad da el realismo.
 *
 * Más que la textura. Un cubo de seis gradientes planos no basta —el material
 * necesita VER formas para que sus reflejos tengan estructura—, así que aquí se
 * pinta un panorama equirectangular con un ventanal, una fuente fría y bandas de
 * suelo, y se pasa por PMREMGenerator.
 *
 * Ese último paso es el que no se puede saltar: PMREM genera los niveles
 * borrosos que consume una superficie rugosa. Sin él, una rugosidad de 0.78
 * devuelve reflejos planos y la pieza se ve a videojuego.
 *
 * Y sale gratis en bundle: medido contra three 0.186.1, importar
 * PMREMGenerator añade 10 bytes, porque WebGLRenderer ya lo arrastra.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ⚠ ESTUVO ACLARADO 1.79x, Y ERA UN PARCHE SOBRE OTRO PROBLEMA
 *
 * Las paradas de este panorama llegaron a subirse enteras —cielo más claro y
 * suelo de 28 a 132 en el primer canal, 1.79x de irradiancia— porque las caras
 * que no ven ninguna fuente directa se quedaban casi negras contra el cream de
 * la página. El síntoma era real; la causa no era ésta.
 *
 * La causa era que las luces entraban sin el factor π que les falta al traducir
 * el prototipo de three r128 a la versión actual. Ver LEGADO en Escena3D: la luz
 * directa valía 3.14 veces menos de lo que debía mientras que el entorno, que
 * nunca llevó ese factor, valía lo mismo. Subir el entorno para compensar es
 * subir justo lo que ya sobraba.
 *
 * Medido sobre la pieza, con el factor π ya puesto, en el mismo encuadre y la
 * misma orientación que el prototipo:
 *
 *                                   luma mediana   p90/p10   calidez r−b
 *   prototipo r128                       79.4        3.29        +10.0
 *   este entorno, aclarado 1.79x        115.1        2.20         +9.0
 *   este entorno, como está ahora        91.7        2.93         +8.9
 *
 * p90/p10 es cuánto modela la luz: cuánto se diferencia una cara iluminada de
 * una en sombra. Aclarar el entorno lo baja de 2.93 a 2.20, o sea que la pieza
 * se aplana — que es exactamente de lo que el entorno aclarado quería salvarla.
 * Y las caras oscuras no vuelven a negro: el decil más bajo queda en 54 de 255
 * sobre un fondo de 224.
 *
 * Y una nota que ahorra el viaje de ida y vuelta: EL PROTOTIPO YA ESTABA EN TONO
 * CLARO (`body data-fondo="claro"`, sobre #F5F5F3) con este mismo panorama. No
 * es un entorno pensado para fondo oscuro que haya que traducir.
 */

const ANCHO = 1024;
const ALTO = 512;

export function entorno(renderer: WebGLRenderer): { textura: Texture; liberar: () => void } {
  const lienzo = document.createElement("canvas");
  lienzo.width = ANCHO;
  lienzo.height = ALTO;
  const x = lienzo.getContext("2d");
  if (!x) throw new Error("sin contexto 2d");

  const cielo = x.createLinearGradient(0, 0, 0, ALTO);
  cielo.addColorStop(0, "#eef1f4");
  cielo.addColorStop(0.42, "#b9c3cb");
  cielo.addColorStop(0.52, "#59636b");
  cielo.addColorStop(1, "#14181b");
  x.fillStyle = cielo;
  x.fillRect(0, 0, ANCHO, ALTO);

  /* Un ventanal grande a un lado: es la forma que se reflejará en los cantos y
     la que da el brillo largo. */
  const ventanal = x.createLinearGradient(0, ALTO * 0.12, 0, ALTO * 0.5);
  ventanal.addColorStop(0, "rgba(255,253,247,1)");
  ventanal.addColorStop(1, "rgba(255,250,238,.15)");
  x.fillStyle = ventanal;
  x.fillRect(ANCHO * 0.13, ALTO * 0.12, ANCHO * 0.2, ALTO * 0.34);

  /* Y una fuente menor al otro lado, más fría: sin ella los dos cantos de una
     misma pieza reflejan lo mismo y se nota simétrico. */
  const fria = x.createLinearGradient(0, ALTO * 0.2, 0, ALTO * 0.46);
  fria.addColorStop(0, "rgba(206,224,238,.85)");
  fria.addColorStop(1, "rgba(206,224,238,.05)");
  x.fillStyle = fria;
  x.fillRect(ANCHO * 0.62, ALTO * 0.2, ANCHO * 0.12, ALTO * 0.26);

  /* Bandas de suelo: dan variación al reflejo de abajo. Son oscuras a propósito
     —un suelo real bajo una pieza no devuelve casi nada— y son las que marcan el
     canto inferior de las zapatas, que es el que más se ve desde esta cámara. */
  for (let i = 0; i < 7; i++) {
    x.fillStyle = `rgba(${28 + i * 7},${31 + i * 7},${34 + i * 8},.5)`;
    x.fillRect(0, ALTO * 0.54 + i * (ALTO * 0.066), ANCHO, ALTO * 0.04);
  }

  const plano = new CanvasTexture(lienzo);
  plano.mapping = EquirectangularReflectionMapping;

  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const objetivo = pmrem.fromEquirectangular(plano);
  plano.dispose();
  pmrem.dispose();

  return { textura: objetivo.texture, liberar: () => objetivo.dispose() };
}
