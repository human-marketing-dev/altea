import Image from "next/image";
import { MARCAS, type Marca } from "@/lib/marcas";

export interface MarcasProps {
  /** @default "Marcas que operan en nuestros desarrollos" */
  title?: string;
  marcas?: Marca[];
  className?: string;
}

function Pista({ marcas, duplicada }: { marcas: Marca[]; duplicada?: boolean }) {
  return (
    <ul className="altea-marcas__pista" aria-hidden={duplicada || undefined}>
      {marcas.map((marca) => (
        <li key={marca.nombre} className="altea-marcas__item">
          {/*
            `fill` sobre una caja de tamaño fijo, no width/height por imagen:
            los 16 logos van de 5.6:1 (Bodega Aurrera) a 1.29:1 (KFC), así que
            cualquier proporción codificada deforma o encoge a la mayoría.
            La caja uniforme los deja ópticamente parejos.
          */}
          <Image
            src={marca.src}
            alt={duplicada ? "" : marca.nombre}
            fill
            sizes="150px"
            className="altea-marcas__logo"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Muro de marcas en marquesina continua.
 *
 * Prueba de terceros: son inquilinos y ocupantes, no logos propios — un logo de
 * Altea no le demuestra nada a quien duda de Altea.
 *
 * La cinta lleva la lista dos veces y se desplaza hasta -50%, que es donde la
 * segunda copia queda exactamente donde arrancó la primera: por eso el ciclo no
 * tiene salto. La copia va `aria-hidden` para no repetir los nombres al lector
 * de pantalla.
 */
export function Marcas({
  title = "Marcas que operan en nuestros desarrollos",
  marcas = MARCAS,
  className,
}: MarcasProps) {
  return (
    <section className={`altea-marcas ${className ?? ""}`}>
      <h2 className="altea-marcas__titulo">{title}</h2>
      <div className="altea-marcas__viewport">
        <div className="altea-marcas__cinta">
          <Pista marcas={marcas} />
          <Pista marcas={marcas} duplicada />
        </div>
      </div>
    </section>
  );
}
