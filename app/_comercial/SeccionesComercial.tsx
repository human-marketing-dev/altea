import { CountUp } from "@/app/ui";
import { CIFRAS_COMERCIAL } from "./content";

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
              {/*
                La unidad se queda FUERA de <CountUp>: su prop `suffix` la
                pintaría sin clase y aquí tiene que ir en coral y a 0.45em. El
                número sí lo cuenta el componente, que además lo renderiza ya
                completo en el servidor — sin JS, o con movimiento reducido, la
                cifra correcta está ahí desde el primer pintado.
              */}
              {cifra.prefijo && (
                <span className="com-cifras__signo" aria-hidden="true">
                  {cifra.prefijo}
                </span>
              )}
              <CountUp to={cifra.valor} />
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
