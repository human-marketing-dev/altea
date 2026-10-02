import Image from "next/image";
import { RESPONSABILIDAD } from "./content";

/**
 * Responsabilidad social: copy a la izquierda, galería de seis fotos a lo ancho.
 *
 * Va sobre el gris HUNDIDO: lo bastante distinto del fondo de página para
 * separarse sin meter un tercer tono, y es la sección que cierra en claro después
 * del acordeón.
 *
 * El subtítulo va en coral-dark y no en coral: medido, el coral normal sobre este
 * gris da 2.69 y no llega ni al 3.0 de texto grande; coral-dark da 3.58.
 *
 * LOS PIES DE FOTO EN TÁCTIL VAN SIEMPRE VISIBLES. Si sólo existieran en el hover,
 * en un teléfono no existirían — y entonces seis fotos sin pie son seis fotos sin
 * explicación. El velo se aplica con ellos, porque un texto blanco sobre una foto
 * cualquiera no tiene contraste garantizado. Ver el bloque @media (hover: none).
 */
export function ResponsabilidadSocial() {
  return (
    <section className="nos-rs" aria-labelledby="rs-titulo">
      <div className="nos-rs__cab">
        <h2 className="nos-rs__titulo" id="rs-titulo">
          {RESPONSABILIDAD.title}
        </h2>
        <div className="nos-rs__copy">
          <p className="nos-rs__sub">{RESPONSABILIDAD.subtitulo}</p>
          {RESPONSABILIDAD.descripcion.map((parrafo) => (
            <p key={parrafo.slice(0, 24)}>{parrafo}</p>
          ))}
        </div>
      </div>

      <ul className="nos-rs__fotos">
        {RESPONSABILIDAD.galeria.map((foto) => (
          <li key={foto.id}>
            <figure className="nos-fz">
              {foto.src && (
                <Image
                  src={foto.src}
                  alt={foto.alt ?? ""}
                  fill
                  sizes="(max-width: 700px) 92vw, (max-width: 900px) 46vw, 31vw"
                  className="nos-fz__img"
                />
              )}
              {/* El pie dice qué es la iniciativa; el `alt` describe la foto. No
                  son lo mismo y por eso coexisten. */}
              <figcaption>{foto.nota}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
