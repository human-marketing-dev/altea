import Image from "next/image";

export interface MediaSlotProps {
  /** Qué va aquí cuando exista el material definitivo. Se muestra en el hueco. */
  label: string;
  /** Ruta de la imagen real. Sin ella se dibuja el placeholder. */
  src?: string;
  alt?: string;
  /** `dark` para huecos sobre fondo ink. @default "light" */
  tone?: "light" | "dark";
  /** CSS aspect-ratio, p. ej. "4 / 3". Omitir si el contenedor ya da altura. */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Hueco de imagen pendiente — el equivalente en producción del `<image-slot>`
 * del design system.
 *
 * La marca prohíbe fotografía de stock inventada, así que mientras no llegue el
 * material real esto rinde un bloque etiquetado en vez de una imagen falsa.
 */
export function MediaSlot({
  label,
  src,
  alt,
  tone = "light",
  ratio,
  sizes = "100vw",
  priority,
  className,
}: MediaSlotProps) {
  const classes = [
    "altea-media",
    tone === "dark" ? "altea-media--dark" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes}
          priority={priority}
          className="altea-media__img"
        />
      ) : (
        <span className="altea-media__label">
          <svg
            className="altea-media__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="m4 17 5-5 4 4 3-2 4 4" />
          </svg>
          {label}
        </span>
      )}
    </div>
  );
}
