import {
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  type WebGLRenderer,
} from "three";

/**
 * El hormigón, fotografiado.
 *
 * Cuatro mapas de una superficie real —grava fina de ambientCG, Gravel 043, con
 * la oclusión derivada del mapa de color—, en public/images/hero/.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * SUSTITUYE A UN HORMIGÓN PROCEDIMENTAL, y el motivo no es la calidad del código
 *
 * Lo que había era un generador por octavas con juntas de cimbra, separadores,
 * escurrimientos y poros: 264 líneas, 57-75 ms de CPU al montar y cero bytes de
 * descarga. Funcionaba. Pero un procedimental SE LEE COMO DIBUJADO por bueno que
 * sea, porque su grano es regular: tiene la estadística del ruido y no la de un
 * árido, que son piedras de tamaños distintos con sombra propia y huecos entre
 * ellas. Eso no se arregla añadiéndole octavas.
 *
 * El trato es 324 KB de descarga contra 60 ms de CPU y un material que no cuela.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LOS CUATRO MAPAS, Y POR QUÉ NO MIDEN LO MISMO
 *
 *   color     512   el albedo. Es el único que es COLOR.
 *   normal    384   el relieve. Es de frecuencia más baja que el árido, así que
 *                   no necesita tanto detalle como el color.
 *   rugosidad 512   dónde resbala la luz y dónde no.
 *   oclusión  512   cuánta luz de entorno llega al fondo de cada hueco. Es la
 *                   que de verdad saca la textura, así que es la única que no
 *                   se encoge: ver ACABADO en Escena3D.
 *
 * Los originales son JPEG de 1024/768/1024/512 y pesan 1108 KB entre los cuatro.
 * El recorte está MEDIDO, no estimado: renderizando la pieza a 1800x1120 —el
 * caso peor, pantalla ancha con dpr 2— contra el juego original, la diferencia
 * media es de 1.16 niveles sobre 255 y sólo el 0.58 % de los píxeles se mueve
 * más de 16. A tamaño real no se distingue ninguno de los dos.
 *
 * Y una medida que sale al revés de lo que uno espera: bajar el color a 512 se
 * ALEJA MENOS del original que dejarlo en 768. A estos tamaños de pantalla la
 * GPU ya está muestreando un nivel de mipmap cercano a 512, así que el archivo
 * de 512 se parece más a lo que de verdad se pinta que uno intermedio, que
 * obliga a una cadena de mipmaps distinta.
 *
 * ⚠ EL sRGB VA SOLO EN EL DE COLOR. Los otros tres son DATOS, no color: un
 * número que dice cuánto se inclina la superficie, cuánto dispersa o cuánto
 * ocluye. Etiquetarlos como sRGB les aplica la curva de la pantalla y los
 * deforma —el relieve sale blando y la rugosidad, contrastada—, y es de los
 * errores que no dan ningún aviso: el material simplemente se ve mal y no sabes
 * por qué.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * EL CANAL DE LAS UV DEL aoMap: EN THREE MODERNA YA NO HAY TRAMPA
 *
 * En la three del prototipo (r128) el `aoMap` era el único mapa de
 * MeshStandardMaterial que no leía el atributo `uv`: leía `uv2`, el segundo
 * juego, y había que duplicarlo a mano. Sin esa línea la oclusión se montaba sin
 * dar ningún error y no se veía nada.
 *
 * Desde r151 cada textura lleva `channel`, que vale 0 por defecto y se traduce
 * literalmente al nombre del atributo: 0 → `uv`, 1 → `uv1` (el antiguo `uv2`).
 * Comprobado en el código de esta versión, WebGLPrograms.getChannel. O sea que
 * dejando `channel` en 0 el aoMap lee las MISMAS UV que el resto y no hace falta
 * ni segundo atributo ni `aoMap.channel = 1`: la traducción directa del
 * prototipo funcionaría, pero sube un atributo de más por geometría para acabar
 * en el mismo sitio.
 */

const RUTA = "/images/hero/";

export type Mapas = {
  color: Texture;
  normal: Texture;
  rugosidad: Texture;
  oclusion: Texture;
  liberar: () => void;
};

/**
 * Carga los cuatro mapas.
 *
 * `repintar` se llama cuando llega cada uno: la escena se arma con lo que haya y
 * se vuelve a pintar según van cayendo, así que la pieza se ve desde el primer
 * fotograma en vez de esperar al megabyte entero. Sin esto el hero arranca en
 * blanco durante lo que tarde la red.
 */
export function texturaHormigon(renderer: WebGLRenderer, repintar: () => void): Mapas {
  const cargador = new TextureLoader();
  const anisotropia = renderer.capabilities.getMaxAnisotropy();

  const carga = (archivo: string, esColor: boolean): Texture => {
    const t = cargador.load(`${RUTA}${archivo}`, repintar);
    /* El grano se repite por unidad de pieza, no se estira: las UV de la
       proyección de caja se salen de [0,1] a propósito. */
    t.wrapS = t.wrapT = RepeatWrapping;
    /* Las piezas se ven muy en escorzo durante todo el ensamble, que es justo
       donde un mapa sin anisotropía se emborrona. */
    t.anisotropy = anisotropia;
    if (esColor) t.colorSpace = SRGBColorSpace;
    return t;
  };

  const mapas = {
    color: carga("concreto-color.webp", true),
    normal: carga("concreto-normal.webp", false),
    rugosidad: carga("concreto-rug.webp", false),
    oclusion: carga("concreto-ao.webp", false),
  };

  return {
    ...mapas,
    liberar: () => {
      for (const t of Object.values(mapas)) t.dispose();
    },
  };
}
