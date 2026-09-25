import Image from "next/image";

export interface RelatoApertura {
  /** Acaba en espacio: el hueco tiene que ser un carácter, no un `gap`. */
  antes: string;
  /** La parte en coral-dark. */
  acento: string;
  /** Empieza por el signo de puntuación que siga al acento. */
  despues: string;
}

export interface SeccionRelatoProps {
  /** Versalitas pequeñas con la marca coral delante. Es el <h2> de la sección. */
  eyebrow: string;
  apertura: RelatoApertura;
  /** Van repartidos en las dos columnas del cuerpo. */
  parrafos: readonly string[];
  /** Remate a todo el ancho, fuera de la rejilla. Opcional. */
  cierre?: string;
  id?: string;
}

/**
 * Sección de relato: texto a todo lo ancho, sin fotografía.
 *
 * Existe porque una página que encadena rejillas de dos columnas —un bloque
 * visual a un lado, texto al otro— acaba sonando igual sección tras sección. Al
 * componer ésta como lo que es, un texto, deja de competir con sus vecinas y
 * funciona como la pausa entre ellas.
 *
 * Sin animación a propósito: ese es justo su papel. No añadirle apariciones al
 * scroll.
 *
 * El isotipo de marca de agua se sale por el borde derecho, y ahí está la
 * gracia: una marca centrada y completa se leería como un elemento más de la
 * composición y volveríamos a tener dos columnas con un bloque visual al lado.
 * Cortada por el borde se lee como textura del fondo.
 */
export function SeccionRelato({
  eyebrow,
  apertura,
  parrafos,
  cierre,
  id,
}: SeccionRelatoProps) {
  return (
    <section className="altea-relato" id={id}>
      {/*
        Decorativa del todo: aria-hidden y alt vacío, así que no hay contraste
        que medir sobre ella misma — sí sobre el texto que queda encima, y eso
        está resuelto en la hoja con la opacidad.

        `unoptimized` como en la barra: es un SVG de 800 bytes con un solo path
        y pasarlo por el optimizador de Next no ahorraría nada.
      */}
      <Image
        className="altea-relato__agua"
        src="/brand/logos/altea-icon-dark.svg"
        alt=""
        aria-hidden="true"
        width={318}
        height={324}
        unoptimized
      />

      {/* Sigue siendo el <h2> de la sección: lo que cambia es su tratamiento
          visual, no su nivel semántico. */}
      <h2 className="altea-relato__etiqueta">
        <span className="altea-relato__marca" aria-hidden="true" />
        {eyebrow}
      </h2>

      <p className="altea-relato__apertura">
        {apertura.antes}
        <span className="altea-relato__acento">{apertura.acento}</span>
        {apertura.despues}
      </p>

      <span className="altea-relato__regla" aria-hidden="true" />

      <div className="altea-relato__cuerpo">
        {parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 24)}>{parrafo}</p>
        ))}
      </div>

      {cierre && <p className="altea-relato__cierre">{cierre}</p>}
    </section>
  );
}
