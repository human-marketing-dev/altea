import Image from "next/image";
import { PILARES } from "./content";

/**
 * Los tres pilares, sobre ink: ICONO Y NOMBRE, SIN TEXTO.
 *
 * Cada pilar traía además un párrafo y se quitó — ver la nota de PILARES en
 * content.ts. Lo que queda es un enunciado, y eso cambia lo que la sección es:
 * ya no se lee, se mira. De ahí que sea el único sitio de la página donde el
 * gráfico pesa más que la palabra.
 *
 * LOS ICONOS SON LOS DE ALTEA, en archivo. Sustituyen a tres dibujos propios en
 * SVG en línea que llevaban el coral por `currentColor`; ahora el color viene en
 * el propio archivo y el CSS ya no lo decide. Ver la nota de la carpeta en
 * content.ts para el mapeo.
 *
 * Decorativos, con alt vacío: el significado lo lleva el título que tienen
 * debajo, y describir una retícula atravesada por una diagonal no añade nada a
 * "Innovación disruptiva".
 */
export function Pilares() {
  return (
    <section className="nos-pilares" aria-labelledby="pilares-titulo">
      <h2 className="nos-pilares__titulo" id="pilares-titulo">
        {PILARES.title}
      </h2>
      <ul className="nos-pilares__grid">
        {PILARES.bloques.map((pilar) => (
          <li className="nos-pilar" key={pilar.id}>
            <span className="nos-pilar__icono">
              <Image src={pilar.icono} alt="" width={314} height={315} />
            </span>
            <h3 className="nos-pilar__titulo">{pilar.title}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
