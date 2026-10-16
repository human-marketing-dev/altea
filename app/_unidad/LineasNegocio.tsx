import Image from "next/image";
import { ListaAtributos } from "./Atributos";
import { CarruselFotos } from "@/app/ui";
import type { ContenidoUnidad, FotoLinea, LineaNegocio } from "./tipos";

/**
 * Las líneas de negocio de una unidad, una sección cada una: texto y foto a dos
 * columnas, con la lista de atributos debajo del texto, en su misma columna.
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
   * EL ANCHO QUE SE PINTA, NO EL DE LA CAJA. La foto es más apaisada que su caja,
   * así que `cover` la escala por el alto y su ancho pintado es el de la caja por
   * la proporción del archivo entre la de la caja. En dos columnas la caja mide
   * ~41vw de ancho y tan alto como el texto: en Teca, justo al pasar a dos
   * columnas (901 px), llega a 0.40 ancho/alto —367 x 915—, así que se calcula
   * contra eso. En una columna es 4/3 y ~90vw. Sin esto Next sirve una versión
   * chica y la estira, que es lo que pixeló la foto de /nosotros.
   */
  const sizesDe = (foto: FotoLinea) => {
    const enDos = Math.max(1, foto.ratio / 0.4);
    const enUna = Math.max(1, foto.ratio / (4 / 3));
    return `(max-width: 900px) ${Math.round(90 * enUna)}vw, ${Math.round(41 * enDos)}vw`;
  };
  const [primera] = linea.fotos;

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
          {/* Con logotipo, el logo ES el título: va dentro del h2 y su `alt` es
              el nombre que se lee —y el que nombra la sección—. */}
          <h2
            className={
              linea.logo
                ? "uni-ln__titulo uni-ln__titulo--logo"
                : "uni-ln__titulo"
            }
            id={tituloId}
          >
            {linea.logo ? (
              <Image
                src={linea.logo.src}
                alt={linea.logo.alt}
                width={linea.logo.ancho}
                height={linea.logo.alto}
                sizes="280px"
                quality={90}
                className="uni-ln__logo"
              />
            ) : (
              linea.titulo
            )}
          </h2>
          {linea.parrafos.map((parrafo) => (
            <p className="uni-ln__p" key={parrafo.slice(0, 24)}>
              {parrafo}
            </p>
          ))}

          {/*
            LA LISTA VA EN LA COLUMNA DEL TEXTO, debajo del párrafo (octubre de
            2026), y no como franja a todo el ancho debajo de la foto: es parte
            de lo que dice la línea, no otra sección.

            El título de la lista es h3, en tamaño y en el esquema: la lista es
            parte de su línea (Viveros Asturias, Teca), que ya lleva el h2. Por
            eso los títulos de cada icono bajan a h4.
          */}
          <div className="uni-ln__lista">
            <h3 className="uni-ln__lista-titulo">{linea.lista.rotulo}</h3>
            <ListaAtributos
              items={linea.lista.items}
              columnas={linea.lista.items.length >= 4 ? 4 : 3}
              nivel="h4"
            />
          </div>
        </div>
        {linea.fotos.length > 1 ? (
          <CarruselFotos
            className="uni-ln__foto"
            fotos={linea.fotos}
            sizes={linea.fotos.map(sizesDe)}
            etiqueta={`Fotos de ${linea.titulo}`}
          />
        ) : (
          <div className="uni-ln__foto">
            <Image
              src={primera.src}
              alt={primera.alt}
              fill
              sizes={sizesDe(primera)}
              className="uni-ln__img"
            />
          </div>
        )}
      </div>
    </section>
  );
}
