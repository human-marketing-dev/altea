import Image from "next/image";
import Link from "next/link";
import type { Unidad } from "@/lib/contacto";

export interface ProximamenteProps {
  unidad: Unidad;
  /** Lockup de la unidad. Forestal aún no tiene: ver app/ui/README.md. */
  lockup?: string;
  /** Frase de la unidad, del deck corporativo. */
  tagline?: string;
}

/**
 * Página en construcción de una unidad de negocio.
 *
 * Existe para que los enlaces del nav y del footer lleguen a algún lado en vez
 * de dar 404 mientras se arma el contenido real.
 */
export function Proximamente({ unidad, lockup, tagline }: ProximamenteProps) {
  return (
    <section className="flex min-h-[62vh] flex-col items-center justify-center gap-6 bg-ink px-(--container-pad) py-(--space-9) text-center">
      {lockup ? (
        <Image
          src={lockup}
          alt={`Altea ${unidad}`}
          width={828}
          height={312}
          unoptimized
          className="h-10 w-auto sm:h-12"
        />
      ) : (
        <p className="m-0 font-display text-h2 font-semibold text-cream">
          Altea {unidad}
        </p>
      )}

      {tagline && (
        <p className="m-0 max-w-[26ch] font-display text-h1 font-semibold leading-tight text-cream">
          {tagline}
        </p>
      )}

      <p className="m-0 text-eyebrow font-semibold uppercase tracking-wide text-coral">
        Próximamente
      </p>

      <p className="m-0 max-w-[46ch] text-body-lg leading-relaxed text-cream/70">
        Estamos preparando esta sección. Mientras tanto, escríbenos y te
        contamos sobre los proyectos de {unidad.toLowerCase()}.
      </p>

      <Link
        href={`/contacto?unidad=${unidad.toLowerCase()}`}
        className="altea-btn altea-btn--primary altea-btn--lg"
      >
        Hablar con un asesor
        <span className="altea-btn__arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  );
}
