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
 * ACLARADO PARA EL HERO EN TONO CLARO
 *
 * El panorama original tenía cielo claro y suelo casi negro, que es lo correcto
 * para una escena sobre fondo oscuro. Sobre --surface-page el problema era el
 * otro: las caras de la pieza que no ven ninguna fuente directa —las que miran
 * hacia abajo y hacia atrás— sólo ven el entorno, y con ese suelo se quedaban
 * negras contra un fondo casi blanco.
 *
 * Todas las paradas suben. Medido como irradiancia sobre la esfera, pesada por
 * sin(theta), que es lo que recibe una superficie difusa:
 *
 *   antes  0.3149        después  0.5629        →  1.79x de luz
 *
 * Por franja: el cenit apenas se mueve (0.876 → 0.938), el horizonte casi se
 * triplica (0.177 → 0.499) y el nadir pasa de 0.009 a 0.180. Es decir, sube lo
 * que estaba negro y se deja quieto lo que ya daba el brillo.
 *
 * El ventanal y la fuente fría NO se tocan: son las formas que se reflejan en los
 * cantos, y de ellas sale la estructura del reflejo. Si se subieran con el resto,
 * dejarían de destacar sobre el cielo y la pieza perdería el brillo largo.
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
  cielo.addColorStop(0, "#f7f8fa");
  cielo.addColorStop(0.42, "#e2e7eb");
  cielo.addColorStop(0.52, "#a9b2b9");
  cielo.addColorStop(1, "#6e777d");
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

  /* Bandas de suelo: dan variación al reflejo de abajo. Suben con el resto —de
     28 a 132 en el primer canal— porque eran las que dejaban negra la cara
     inferior de las zapatas, que es la que más se ve desde esta cámara. */
  for (let i = 0; i < 7; i++) {
    x.fillStyle = `rgba(${132 + i * 7},${136 + i * 7},${140 + i * 8},.5)`;
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
