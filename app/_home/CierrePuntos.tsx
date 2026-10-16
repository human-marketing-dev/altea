"use client";

import { CANALES, enlaceWhatsApp } from "@/lib/contacto";
import { CampoBanderola } from "@/app/ui/CampoBanderola";
import { ruta } from "@/lib/rutas";
import "./cierre-puntos.css";

/**
 * EL CIERRE DEL HOME Y DE /nosotros (octubre de 2026). Sustituye ahí a
 * <CierreContacto>, el cierre con foto; las unidades cierran con
 * <CierreUnidad>. Ver app/page.tsx y app/nosotros/page.tsx. Sus estilos están
 * en cierre-puntos.css, que se importa aquí.
 *
 * EL CIERRE SIN FOTO. A la derecha lo mismo que dice el cierre de hoy —rótulo,
 * titular, los dos botones y el correo—; a la izquierda, en vez de la foto, un
 * campo de puntos. En el DOM el texto va primero —es lo que se lee— y la hoja
 * coloca el campo delante en escritorio; en una columna, el texto queda arriba.
 *
 * EL CAMPO ES UN TERRENO Y LA BANDEROLA LO MARCA. Una retícula fina de puntos en
 * tinta, como el plano de un lote, con el PASO de la trama que revela la foto en
 * el hero de las unidades. Dentro, la banderola de la marca —el remate del
 * isotipo— hecha con los mismos puntos: la mitad derecha en coral y la izquierda
 * en tinta, la construcción de la banderola de los heroes de unidad.
 *
 * LA BANDEROLA LLEVA SU PROPIA RETÍCULA, A UN TERCIO DEL PASO. Con el paso del
 * terreno los cantos del triángulo salían en escalera; con nueve veces más
 * puntos, más chicos, y la orilla en semitono —ver medir()—, la figura se lee
 * con los cantos rectos. Bajo la
 * banderola no se pintan puntos del terreno: los dos se encimarían. El titular
 * habla de "tu proyecto, terreno o necesidad", y el dibujo dice lo mismo: un
 * terreno con un punto marcado.
 *
 * VA EN UN PANEL EN TINTA, y es lo que lo hace destacar: es el cierre, y sobre el
 * gris de página se fundía con el resto. Panel con radio y no banda a sangre,
 * para que el día que sustituya al cierre actual no se funda con el pie, que
 * también es tinta. Sobre tinta la banderola va en sus colores del isotipo,
 * crema y coral, y el terreno en crema tenue.
 *
 * TRES GESTOS, LOS TRES CON PUNTOS:
 *   · al entrar en pantalla, la banderola se enciende desde su vértice, punto a
 *     punto, como la trama del hero;
 *   · con el cursor encima, los puntos de alrededor crecen y se tiñen de coral:
 *     el terreno responde a quien lo señala;
 *   · una vez encendida, cada 4.2 s sale de su vértice una onda por el terreno,
 *     como una señal que marca el lugar. Sólo mientras el campo está a la
 *     vista: fuera de pantalla no se pinta nada.
 * Con movimiento reducido, la banderola sale entera y quieta.
 *
 * Canvas y no SVG: son de 1 500 a 2 500 puntos que se repintan con el cursor, y
 * un nodo por punto en el DOM se lo cobraría.
 */
export function CierrePuntos({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {


  return (
    <section
      className="home-cp"
      aria-labelledby="cierre-puntos-titulo"
    >
      <div className="home-cp__panel">
        <div className="home-cp__txt">
          <p className="home-cp__rotulo">{eyebrow}</p>
          <h2 className="home-cp__titulo" id="cierre-puntos-titulo">
            {title}
          </h2>
          <div className="home-cp__acciones">
            <a
              className="altea-btn altea-btn--primary altea-btn--lg"
              href={enlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contáctanos por WhatsApp
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a
              className="altea-btn altea-btn--outline altea-btn--lg"
              href={ruta("/contacto")}
            >
              Ir a contacto
              <span className="altea-btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <a className="home-cp__correo" href={`mailto:${CANALES.correo}`}>
            {CANALES.correo}
          </a>
        </div>
        {/* Decorativo: el titular ya dice lo que dice el dibujo. */}
        <CampoBanderola className="home-cp__campo" />
      </div>
    </section>
  );
}
