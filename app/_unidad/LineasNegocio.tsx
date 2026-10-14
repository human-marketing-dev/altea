import Image from "next/image";
import { ListaAtributos } from "./Atributos";
import type { ContenidoUnidad, LineaNegocio } from "./tipos";

/**
 * Las líneas de negocio de una unidad, una sección cada una: texto y foto a dos
 * columnas y, debajo, su lista de atributos.
 *
 * Nace para Forestal —Viveros Asturias y Teca— y va por contenido como todo lo
 * demás: sin `lineas` no se monta.
 *
 * LA COMPOSICIÓN ES LA DE "MÁS DE 40 AÑOS…" EN /nosotros, texto a un lado y foto
 * vertical al otro, a propósito: no estrena un patrón. La foto cambia de lado
 * entre una línea y la siguiente, y esa alternancia es el ritmo de la página.
 *
 * La lista de debajo es la misma del bloque de atributos de Industrial
 * (<ListaAtributos>): filete, icono y título, con la entrada escalonada.
 */
export function LineasNegocio({
  lineas,
  color,
}: {
  lineas: NonNullable<ContenidoUnidad["lineas"]>;
  /** El color de la unidad, para los iconos: ver <Atributos>. */
  color?: string;
}) {
  return lineas.map((linea) => (
    <Linea key={linea.id} linea={linea} color={color} />
  ));
}

function Linea({ linea, color }: { linea: LineaNegocio; color?: string }) {
  const tituloId = `linea-${linea.id}`;
  /*
   * EL ANCHO QUE SE PINTA, NO EL DE LA CAJA. La caja es 4/5 y la foto suele ser
   * más apaisada, así que `cover` la escala por el alto: su ancho pintado es el
   * de la caja por 5/4 y por la proporción del archivo. La caja mide ~41vw en
   * dos columnas y ~90vw en una. Sin esto Next sirve una versión chica y la
   * estira, que es lo que pixeló la foto de /nosotros.
   */
  const factor = Math.max(1, (5 / 4) * linea.foto.ratio);
  const sizes = `(max-width: 900px) ${Math.round(90 * factor)}vw, ${Math.round(41 * factor)}vw`;

  return (
    <section
      className="uni-ln"
      data-lado={linea.lado}
      aria-labelledby={tituloId}
      style={color ? { ["--color-unidad" as string]: color } : undefined}
    >
      <div className="uni-ln__grid">
        <div className="uni-ln__txt">
          {linea.rotulo && <p className="uni-ln__rotulo">{linea.rotulo}</p>}
          <h2 className="uni-ln__titulo" id={tituloId}>
            {linea.titulo}
          </h2>
          {linea.parrafos.map((parrafo) => (
            <p className="uni-ln__p" key={parrafo.slice(0, 24)}>
              {parrafo}
            </p>
          ))}
        </div>
        <div className="uni-ln__foto">
          <Image
            src={linea.foto.src}
            alt={linea.foto.alt}
            fill
            sizes={sizes}
            className="uni-ln__img"
          />
        </div>
      </div>

      <div className="uni-ln__lista">
        <p className="uni-ln__rotulo">{linea.lista.rotulo}</p>
        <ListaAtributos
          items={linea.lista.items}
          columnas={linea.lista.items.length >= 4 ? 4 : 3}
        />
      </div>
    </section>
  );
}
