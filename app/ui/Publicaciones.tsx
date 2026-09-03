import Image from "next/image";
import {
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
  PUBLICACIONES,
  type Publicacion,
} from "@/lib/publicaciones";

export interface PublicacionesProps {
  title?: string;
  /** Se reciben por prop: cambiar la fuente a la API no toca el componente. */
  publicaciones?: Publicacion[];
  className?: string;
}

/**
 * Últimas publicaciones. Hoy con contenido estático — ver lib/publicaciones.ts
 * para lo que falta para conectarlo a Instagram de verdad.
 */
export function Publicaciones({
  title = "Últimas publicaciones",
  publicaciones = PUBLICACIONES,
  className,
}: PublicacionesProps) {
  return (
    <section
      className={`flex flex-col gap-8 bg-ink px-(--container-pad) py-(--space-9) ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="m-0 font-display text-h1 font-semibold leading-tight text-cream">
          {title}
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-small font-semibold uppercase tracking-wide text-cream/70 underline underline-offset-4 transition-colors hover:text-coral"
        >
          @{INSTAGRAM_USUARIO}
        </a>
      </div>

      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
        {publicaciones.map((post) => (
          <li key={post.id}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
            >
              <span className="relative block aspect-square overflow-hidden bg-surface-card-dark">
                {/*
                  Recuerda la regla: con `object-fit: cover`, `sizes` no es el
                  ancho de la caja sino el ancho al que queda la imagen después
                  de escalarla para cubrirla. Estas fuentes son apaisadas (3:2 y
                  16:9) metidas en un cuadrado, así que manda el alto: en una
                  celda de 328px la imagen se renderiza a ~580 de ancho. Con
                  320px declarados el navegador pedía la mitad.
                */}
                <Image
                  src={post.imagen}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1536px) 700px, (min-width: 1024px) 600px, 80vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-3 block text-small leading-relaxed text-cream/70 transition-colors group-hover:text-cream">
                {post.texto}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
