import { MediaSlot } from "@/app/ui";
import { RESPONSABILIDAD } from "./content";

/**
 * Sección 7 — el copy en dos columnas arriba, la galería de seis a lo ancho.
 *
 * Los pies de foto salen del campo `nota`, que llevaba escrito desde el
 * principio y no se pintaba nunca: <MediaSlot> sólo muestra `label` cuando
 * falta `src`, y las seis fotos lo tienen. Eran seis cuadrados mudos.
 */
export function ResponsabilidadSocial() {
  return (
    <section id="responsabilidad-social" className="nos-rs">
      <div className="nos-rs__copy">
        <div className="nos-rs__encabezado">
          <p className="nos-rs__eyebrow">
            <span className="nos-rs__marca" aria-hidden="true" />
            {RESPONSABILIDAD.eyebrow}
          </p>
          <h2 className="nos-rs__titulo">{RESPONSABILIDAD.title}</h2>
          {RESPONSABILIDAD.subtitulo && (
            <p className="nos-rs__subtitulo">{RESPONSABILIDAD.subtitulo}</p>
          )}
        </div>
        <div className="nos-rs__parrafos">
          {RESPONSABILIDAD.descripcion.map((parrafo) => (
            <p key={parrafo.slice(0, 24)}>{parrafo}</p>
          ))}
        </div>
      </div>

      <ul className="nos-rs__galeria">
        {RESPONSABILIDAD.galeria.map((foto) => (
          <li key={foto.id}>
            <figure className="nos-rs__foto">
              <MediaSlot
                className="nos-rs__media"
                label={foto.nota}
                src={foto.src}
                alt={foto.alt ?? ""}
                tone="dark"
                /* La proporción la pone el CSS y no la prop `ratio`: ésta
                   escribe un estilo en línea, y aquí el recorte no cambia por
                   breakpoint pero el ANCHO sí, así que conviene tenerlo todo
                   en la hoja. */
                sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <span className="nos-rs__velo" aria-hidden="true" />
              <figcaption className="nos-rs__pie">{foto.nota}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
