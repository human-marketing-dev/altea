import Image from "next/image";

/**
 * La tarjeta vertical de proyecto: foto, etiqueta opcional, nombre y pie.
 *
 * Es sólo la TARJETA. El movimiento lo pone quien la monta, y hoy son dos
 * cosas distintas: <CarrilTarjetas>, que arrastra la fila con el scroll de la
 * página en el home, y <CarruselTarjetas>, que la deja desplazarse a mano en
 * /comercial. Separarlas es lo que permite que el diseño sea literalmente el
 * mismo sin que un carrusel herede el fijado del otro.
 *
 * La tarjeta NO decide su tamaño: declara la proporción 3/4 y deja que el
 * contenedor fije el alto (el carril, que lo mide contra el hueco libre) o el
 * ancho (el carrusel, con un clamp). Ver .altea-tj en components.css.
 */

/**
 * El `sizes` de las fotos, y NO es el ancho de la caja.
 *
 * ⚠ Esto era la pixelación en el home, y no la resolución de los archivos. La
 * caja es VERTICAL (3/4) y las fotos son HORIZONTALES —de 1.50 a 1.92 de
 * proporción en los dos juegos—. Con `object-fit: cover` la imagen se escala
 * hasta que su ALTO cubre la caja, y entonces su ancho RENDERIZADO es mucho
 * mayor que el de la caja: a 1440 la tarjeta mide 461 px de ancho pero la imagen
 * se pinta a 923-1114 y se recorta a los lados.
 *
 * `sizes` describe el ancho al que se PINTA la imagen, no el de su caja. Con 480
 * px, Next servía w=640 a 1x —que se estiraba hasta 1114, o sea 1.74x— y w=1080
 * a 2x. 1160 cubre el peor caso a 1920, y en móvil la tarjeta manda por ancho:
 * 74vw de caja son 178vw de imagen renderizada con esa misma cuenta.
 */
const SIZES = "(max-width: 900px) 178vw, 1160px";

export interface TarjetaProyectoProps {
  nombre: string;
  /** La línea pequeña bajo el nombre: la unidad en el home, la ciudad en plazas. */
  pie: string;
  foto?: string;
  /**
   * La chapa de arriba a la izquierda. Opcional: en el home no la lleva.
   *
   * En plazas es el FORMATO —Fashion Mall, Strip Mall, Power Center—, que es el
   * dato que la tarjeta no puede dar de otra forma.
   */
  etiqueta?: string;
  /** Otro `sizes` para la foto, si la caja no es la del carril/carrusel. */
  sizes?: string;
  onClick: (boton: HTMLButtonElement) => void;
}

export function TarjetaProyecto({
  nombre,
  pie,
  foto,
  etiqueta,
  sizes = SIZES,
  onClick,
}: TarjetaProyectoProps) {
  return (
    <button
      type="button"
      className="altea-tj js-tarjeta"
      onClick={(evento) => onClick(evento.currentTarget)}
    >
      <span className="altea-tj__foto js-tarjeta-foto">
        {foto && <Image src={foto} alt="" fill sizes={sizes} className="altea-tj__img" />}
      </span>
      {etiqueta && <span className="altea-tj__marca">{etiqueta}</span>}
      <span className="altea-tj__txt">
        <b>{nombre}</b>
        <span>{pie}</span>
      </span>
    </button>
  );
}
