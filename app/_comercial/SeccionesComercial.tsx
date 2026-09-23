import { MediaSlot } from "@/app/ui";
import {
  BANDA_COMERCIAL,
  CIFRAS_COMERCIAL,
  DESCRIPCION_COMERCIAL,
} from "./content";

/** 2 · Banda de imagen a sangre. Un respiro entre dos bloques de contenido. */
export function BandaComercial() {
  return (
    <section className="com-banda" aria-hidden="true">
      <div className="com-banda__foto">
        <MediaSlot
          label={BANDA_COMERCIAL.label}
          src={BANDA_COMERCIAL.foto}
          alt={BANDA_COMERCIAL.alt}
          sizes="100vw"
        />
      </div>
    </section>
  );
}

/** 3 · Cifras de la unidad, sobre ink. */
export function CifrasComercial() {
  return (
    <section className="com-cifras">
      <dl className="com-cifras__rejilla">
        {CIFRAS_COMERCIAL.map((cifra) => (
          <div key={cifra.etiqueta} className="com-cifras__item">
            {/*
              El aria-label va en el contenedor con la cifra ENTERA. Sin él, el
              "+" o el "%" en su propio <span> se anuncian sueltos y el lector
              lee "500" y "más" como dos cosas distintas.
            */}
            <dd className="com-cifras__valor" aria-label={cifra.lectura}>
              <span aria-hidden="true">{cifra.valor}</span>
              {cifra.signo && (
                <span className="com-cifras__signo" aria-hidden="true">
                  {cifra.signo}
                </span>
              )}
            </dd>
            <dt className="com-cifras__etiqueta">{cifra.etiqueta}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** 4 · Descripción de la unidad. Sin imagen: la banda de arriba ya la tiene. */
export function DescripcionComercial() {
  return (
    <section className="com-desc">
      <h2 className="com-desc__titulo">{DESCRIPCION_COMERCIAL.titulo}</h2>
      <div className="com-desc__cuerpo">
        {DESCRIPCION_COMERCIAL.parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 24)}>{parrafo}</p>
        ))}
      </div>
    </section>
  );
}
