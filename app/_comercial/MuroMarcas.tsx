import Image from "next/image";
import { MARCAS_COMERCIAL, TITULO_MARCAS } from "./content";

/**
 * El muro de marcas: 32 en ocho columnas.
 *
 * Las celdas se separan por una LÍNEA DE UN PÍXEL, no por un hueco, y la línea no
 * es un borde por celda: es el fondo de la rejilla asomando por un `gap: 1px`. Así
 * no hay bordes dobles entre vecinas y se lee como un muro en vez de como treinta
 * y dos tarjetas sueltas.
 *
 * Los logotipos en gris, subiendo de contraste al señalar. Mismo criterio que en
 * Grupo Firma: el tratamiento va en CSS y no editando los archivos — y el gris
 * sale de la OPACIDAD, porque los archivos ya son negro sobre transparente y
 * grayscale sobre negro no hace nada.
 */

/**
 * CORRECCIÓN ÓPTICA: SE MIDE LA MANCHA, NO EL LIENZO.
 *
 * Esto sustituye a una fórmula lineal sobre la proporción del archivo
 * —`min(1, 0.62 + ratio * 0.08)`— que estaba mal alimentada y mal calibrada. Vale
 * la pena dejar escrito el diagnóstico, porque el síntoma era desconcertante:
 * cinco logotipos se veían "desacomodados" en el muro y eran siempre los mismos
 * —Bolerama, C&A, H&M, IMSS y KFC— sin que nada en el CSS los distinguiera.
 *
 * LO QUE PASABA. Medida la mancha de tinta de los 32 archivos, esos cinco son los
 * cinco de lienzo más cuadrado (0.94 a 1.36, contra una celda de 1.67). Con el
 * alto como variable de control, una marca cuadrada que alcanza el alto común sale
 * ESTRECHA, y en una celda apaisada eso se lee como un hueco medio vacío: su
 * tinta ocupaba el 17-31 % del ancho de la celda mientras los otros 27 llegaban al
 * 81 %. En masa de tinta —ancho por alto de la mancha— estaban en 0.34x la de los
 * demás: un tercio.
 *
 * Y la fórmula vieja los empeoraba, porque ENCIMA los encogía: a un lienzo de 1:1
 * le daba 0.70. La premisa de la que salía —"en una marca compacta el tamaño
 * percibido lo manda el alto"— es cierta, pero se calibró contra los lienzos sin
 * saber cuánto margen transparente traía cada uno, y resulta que traen entre el
 * 11 y el 37 % a los lados y entre el 16 y el 27 % arriba y abajo.
 *
 * LOS DOS ARREGLOS, y los dos vienen de medir el archivo:
 *
 *   1 · La proporción que entra en la corrección es la de la TINTA (`rTinta`), no
 *       la del lienzo. No es un matiz: Banorte declara 5.14:1 y su mancha es
 *       8.11:1; KFC declara 1.29 y su mancha es 1.00 exacto.
 *   2 · El alto que se pide se divide entre `tinta`, la fracción de alto que de
 *       verdad es mancha, así que lo que acaba midiendo lo mismo entre logotipos
 *       es la marca y no el recuadro que la contiene.
 *
 * LA LEY DE POTENCIAS, y por qué 0.20. El exponente mueve el criterio de forma
 * continua entre dos extremos: con 0 se igualan los ALTOS de tinta —que es lo que
 * había, y deja los cinco en 0.34x de masa— y con 0.5 se igualan las ÁREAS.
 *
 * ⚠ Y POR SÍ SOLO NO BASTA: HACE FALTA EL TOPE DE BANDA de comercial.css. Esto se
 * descubrió tarde y por el camino largo, así que conviene dejarlo escrito.
 *
 * Igualar masa sin tope llevaba a los cinco al 62-70 % del alto del hueco, por
 * encima de los 32 logotipos. Y ÉSA es la medida que se ve: los otros 27 viven en
 * una banda horizontal que va del 22 al 53 % de alto, y lo que la rebasa se lee
 * fuera de sitio aunque su masa sea la correcta. Dicho de otro modo, el muro tiene
 * DOS restricciones y hay que satisfacer las dos: la masa explica por qué una
 * marca compacta se veía diminuta, y la banda explica por qué agrandarla sin más
 * no lo arregla — sólo cambia un desajuste por otro.
 *
 * Que cueste verlo en números es parte de la lección: lo que lo resolvió fue
 * RENDERIZAR EL MURO COMO LO PINTA EL NAVEGADOR y mirarlo. Con los dos ajustes
 * puestos, los cinco suben entre 1.26x y 1.63x de masa y ninguno rebasa la banda.
 *
 * Lo que nada de esto puede arreglar es el extremo ancho: un logotipo de 5.6:1 en
 * una celda de 161 px tiene un techo de alto que es pura geometría, y la única
 * palanca sería poner menos columnas.
 */

/** La mediana de la proporción de tinta de los 32. El logotipo que la tenga no se
 *  corrige; los más cuadrados suben y los más alargados bajan. */
const REFERENCIA = 3.6;
/** 0 iguala altos de tinta; 0.5 iguala áreas. Ver el comentario de arriba. */
const EXPONENTE = 0.2;
const factorOptico = (rTinta: number) =>
  Math.pow(REFERENCIA / rTinta, EXPONENTE);

export function MuroMarcas() {
  return (
    <section className="com-marcas" aria-labelledby="marcas-titulo">
      <h2 className="com-marcas__titulo" id="marcas-titulo">
        {TITULO_MARCAS}
      </h2>

      <ul className="com-marcas__rejilla">
        {MARCAS_COMERCIAL.map((marca) => (
          <li className="com-mc" key={marca.nombre}>
            {/* El alt es el nombre: no son decorativos, son la información de la
                sección. */}
            <Image
              src={marca.src}
              alt={marca.nombre}
              width={240}
              height={Math.round(240 / marca.ratio)}
              className="com-mc__logo"
              style={{
                ["--factor" as string]: factorOptico(marca.rTinta),
                ["--tinta" as string]: marca.tinta,
                ["--alza" as string]: marca.alza ?? 0,
                ["--escala" as string]: marca.escala ?? 1,
              }}
              unoptimized
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
