import Image from "next/image";
import { RESPONSABILIDAD, type FotoGaleria } from "./content";

/**
 * Responsabilidad social: el título solo, arriba, y dos bloques en ZIGZAG
 * (29 oct 2026), el mismo lenguaje que las líneas de negocio de Forestal:
 *
 *   Responsabilidad social                                   ← <h2>
 *   [ comunidades: <h3> y texto ]  [ seis fotos, 2 × 3      ]
 *   [ cuatro fotos: la vertical  ]  [ entornos verdes: <h3>  ]
 *   [ a la izquierda, 3 apiladas ]  [ y texto                ]
 *
 * LAS DOS GALERÍAS MIDEN LO MISMO. Las dos son una rejilla de dos columnas por
 * tres renglones de celdas 16:9: la de comunidades las llena con sus seis
 * fotos; la de entornos verdes junta la columna izquierda en una sola celda
 * alta para la foto vertical —así casi no se recorta— y apila las tres 4:3 a
 * la derecha. Ver .nos-rs__fotos--verdes.
 *
 * En el marcado el texto va SIEMPRE antes que sus fotos, también en el segundo
 * bloque, donde se ve a la derecha: el orden de lectura no cambia con el lado.
 *
 * Va sobre el gris HUNDIDO: lo bastante distinto del fondo de página para
 * separarse sin meter un tercer tono, y es la sección que cierra en claro después
 * del acordeón.
 *
 * Los dos subtítulos van en coral-dark y no en coral: medido, el coral normal
 * sobre este gris da 2.69 y no llega ni al 3.0 de texto grande; coral-dark da
 * 3.58.
 *
 * LOS PIES DE FOTO EN TÁCTIL VAN SIEMPRE VISIBLES. Si sólo existieran en el hover,
 * en un teléfono no existirían — y entonces seis fotos sin pie son seis fotos sin
 * explicación. El velo se aplica con ellos, porque un texto blanco sobre una foto
 * cualquiera no tiene contraste garantizado. Ver el bloque @media (hover: none).
 * Las de entornos verdes no tienen pie, y sin pie no hay velo.
 */
export function ResponsabilidadSocial() {
  const { verdes } = RESPONSABILIDAD;
  return (
    <section className="nos-rs" aria-labelledby="rs-titulo">
      <h2 className="nos-rs__titulo" id="rs-titulo">
        {RESPONSABILIDAD.title}
      </h2>

      <div className="nos-rs__bloque">
        <div className="nos-rs__copy">
          <h3 className="nos-rs__sub">{RESPONSABILIDAD.subtitulo}</h3>
          {RESPONSABILIDAD.descripcion.map((parrafo) => (
            <p key={parrafo.slice(0, 24)}>{parrafo}</p>
          ))}
        </div>
        <ul className="nos-rs__fotos">
          {RESPONSABILIDAD.galeria.map((foto) => (
            <li key={foto.id}>
              <Foto foto={foto} sizes="(max-width: 900px) 46vw, 27vw" />
            </li>
          ))}
        </ul>
      </div>

      <div className="nos-rs__bloque nos-rs__bloque--inverso">
        <div className="nos-rs__copy">
          <h3 className="nos-rs__sub">{verdes.titulo}</h3>
          {verdes.descripcion.map((parrafo) => (
            <p key={parrafo.slice(0, 24)}>{parrafo}</p>
          ))}
        </div>
        <ul className="nos-rs__fotos nos-rs__fotos--verdes">
          {verdes.galeria.map((foto, i) => (
            <li key={foto.id}>
              {/* La vertical va en la celda alta: con `cover` se pinta a su
                  alto, unas 1.3 veces el ancho de la columna. */}
              <Foto
                foto={foto}
                sizes={
                  i === 0
                    ? "(max-width: 900px) 46vw, 34vw"
                    : "(max-width: 900px) 46vw, 27vw"
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Foto({ foto, sizes }: { foto: FotoGaleria; sizes: string }) {
  return (
    <figure className="nos-fz">
      {foto.src && (
        <Image
          src={foto.src}
          alt={foto.alt ?? ""}
          fill
          sizes={sizes}
          className="nos-fz__img"
        />
      )}
      {/* El pie dice qué es la iniciativa; el `alt` describe la foto. No
          son lo mismo y por eso coexisten. */}
      {foto.nota && <figcaption>{foto.nota}</figcaption>}
    </figure>
  );
}
