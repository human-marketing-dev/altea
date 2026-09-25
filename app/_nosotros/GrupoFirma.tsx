import { MediaSlot } from "@/app/ui";
import { GRUPO_FIRMA } from "./content";

/**
 * Sección 4 — Altea forma parte de Grupo Firma.
 *
 * MARCADOR DE POSICIÓN. No hay contenido todavía: la estructura está montada
 * —eyebrow, título, dos párrafos e imagen— y lo único que falta es rellenar
 * GRUPO_FIRMA. Mientras eso no ocurra, la sección se anuncia como en
 * preparación en vez de fingir que está terminada.
 *
 * Va tras MOSTRAR_GRUPO_FIRMA para poder apagarla si hay que enseñar la página
 * antes de que llegue el material, igual que las marcas de /comercial.
 */
export function GrupoFirma() {
  return (
    <section className="nos-firma" aria-labelledby="nos-firma-titulo">
      <div className="nos-firma__aviso">
        <span className="nos-firma__aviso-punto" aria-hidden="true" />
        Sección en preparación
      </div>

      <div className="nos-firma__rejilla">
        <div className="nos-firma__body">
          <p className="nos-firma__eyebrow">{GRUPO_FIRMA.eyebrow}</p>
          <h2 id="nos-firma-titulo" className="nos-firma__title">
            {GRUPO_FIRMA.title ?? "Título pendiente"}
          </h2>
          {GRUPO_FIRMA.parrafos.length > 0 ? (
            GRUPO_FIRMA.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 24)} className="nos-firma__texto">
                {parrafo}
              </p>
            ))
          ) : (
            /* Dos barras del largo aproximado que tendrán los párrafos, para que
               se vea el espacio que van a ocupar sin escribir texto falso. */
            <>
              <span className="nos-firma__hueco" aria-hidden="true" />
              <span className="nos-firma__hueco nos-firma__hueco--corto" aria-hidden="true" />
              <p className="sr-only">
                El texto de esta sección está pendiente de Grupo Firma.
              </p>
            </>
          )}
        </div>

        <MediaSlot
          className="nos-firma__media"
          label={GRUPO_FIRMA.imageNote}
          src={GRUPO_FIRMA.image}
          alt=""
          ratio="4 / 3"
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>
    </section>
  );
}
