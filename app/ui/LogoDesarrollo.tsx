import Image from "next/image";
import type { CSSProperties } from "react";
import type { LogoDesarrollo as Logo } from "@/lib/logos-desarrollos";

/**
 * El logotipo de un desarrollo, en lugar de su nombre sobre la foto de la ficha
 * (2 nov 2026). Lo usan <FichaUnidad> y la ficha del carril del home.
 *
 * MISMO PESO VISUAL, NO MISMA ALTURA. Las proporciones van de ~3:1 (Paseo Tec,
 * Amarantha) a ~20:1 (los industriales): a la misma altura un industrial salía
 * cinco veces más ancho que un Paseo, y al mismo ancho los Paseos se volvían
 * enormes. La altura se escala con la raíz de la proporción contra una de
 * referencia de 4:1, así que el ÁREA es la misma para todos —el criterio de la
 * fila de Grupo Firmas en Nosotros—. El alto base lo pone cada ficha con
 * `--alto-logo`; ver .altea-logo-desarrollo en components.css.
 *
 * El `alt` es el nombre del proyecto: va dentro del <h3> de la ficha, así que
 * es también el nombre del encabezado para un lector de pantalla.
 */
const REFERENCIA = 4;

export function LogoDesarrollo({ logo, nombre }: { logo: Logo; nombre: string }) {
  const escala = Math.sqrt(REFERENCIA / (logo.ancho / logo.alto));
  return (
    <Image
      src={logo.src}
      alt={nombre}
      width={logo.ancho}
      height={logo.alto}
      /* Se pinta a ~600 px como mucho (los industriales, a lo ancho). */
      sizes="(max-width: 900px) 80vw, 600px"
      className="altea-logo-desarrollo"
      style={{ "--escala": escala.toFixed(3) } as CSSProperties}
    />
  );
}
