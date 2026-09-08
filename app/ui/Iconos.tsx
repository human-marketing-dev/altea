/**
 * Los dos iconos que usa el sitio, en línea.
 *
 * No hay set de iconos en el proyecto —los otros SVG son piezas sueltas dentro
 * de su componente— y no vale la pena traer una librería por dos glifos. Viven
 * aquí y no duplicados en cada consumidor porque los usan el footer y el bloque
 * de captación, y dos copias del mismo trazo acaban divergiendo.
 *
 * Los que acompañan a un texto visible son decorativos: `aria-hidden`, y lo que
 * se lee es el texto de al lado. Los de redes NO lo son —son el contenido del
 * enlace— y por eso van aparte, sin `aria-hidden`: el nombre de la red lo pone
 * quien los monta.
 *
 * El color sale de `currentColor` y el tamaño del contenedor, así que los dos
 * los decide quien los monta.
 */

/**
 * El de WhatsApp acepta `className` porque el botón flotante lo pinta a tres
 * tamaños distintos; en el footer lo dimensiona su contenedor.
 */
export function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.69 8.21-8.23 8.21Z" />
    </svg>
  );
}
export const ICONOS = {
  correo: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2 4.5 6 4.2 6-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  telefono: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.6 2.3 3.4 2A1.4 1.4 0 0 0 2 3.6C2 9 7 14 12.4 14A1.4 1.4 0 0 0 14 12.6l-.3-2.2a1 1 0 0 0-1.2-.85l-1.9.4-2.5-2.5.4-1.9a1 1 0 0 0-.85-1.2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  whatsapp: <IconoWhatsApp />,
  ubicacion: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.4 5-8a5 5 0 0 0-10 0c0 3.6 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
} as const;

export type NombreIcono = keyof typeof ICONOS;

/**
 * Iconos de red social. Separados de ICONOS a propósito: éstos NO llevan
 * `aria-hidden` porque son el contenido del enlace, no un adorno junto a un
 * texto. El nombre de la red lo aporta quien los monta.
 */
export const ICONOS_RED = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  ),
} as const;

export type NombreRed = keyof typeof ICONOS_RED;
