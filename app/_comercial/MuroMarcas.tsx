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
 * CORRECCIÓN ÓPTICA DEL ALTO SEGÚN LA PROPORCIÓN.
 *
 * La misma de Grupo Firma, y por la misma razón: con un alto común, un logotipo
 * casi cuadrado pesa mucho más en el ojo que un wordmark largo, porque en una
 * marca compacta el tamaño percibido lo manda el alto y no el área.
 *
 * Aquí el abanico es aún mayor —de 0.94 a 5.60 contra una celda de 1.67— y el
 * efecto se notaba más. Medido sobre los 32 archivos, la razón entre el logotipo
 * de más tinta y el de menos baja de 3.38x a 2.52x.
 *
 * Lo que la corrección NO puede arreglar es el extremo ancho: un logotipo de
 * 5.6:1 en una celda de 161 px tiene un techo de alto que es pura geometría, y
 * ahí la única palanca sería poner menos columnas. Así que lo que hace es bajar
 * los compactos, no subir los anchos.
 */
const BASE = 0.62;
const PENDIENTE = 0.08;
const factorOptico = (ratio: number) => Math.min(1, BASE + ratio * PENDIENTE);
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
              style={{ ["--factor" as string]: factorOptico(marca.ratio) }}
              unoptimized
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
