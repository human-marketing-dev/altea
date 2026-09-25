import { MediaSlot } from "./MediaSlot";

export interface HeroUnidadFoto {
  /** Sin ella, <MediaSlot> pinta el hueco etiquetado en vez de inventar stock. */
  src?: string;
  alt: string;
  label: string;
}

export interface HeroUnidadProps {
  /** La ceja del badge: el nombre de la unidad — "Comercial", "Vivienda"… */
  ceja: string;
  titulo: string;
  descripcion: string;
  /**
   * UNA sola imagen. Antes era un carrusel de proyectos; se cambió por una foto
   * fija de la unidad, así que no hay pie por proyecto ni controles.
   */
  foto: HeroUnidadFoto;
}

/**
 * Hero de una unidad de negocio — texto a la izquierda, tarjeta con foto
 * flotando a la derecha, sobre el beige de marca.
 *
 * Vive aquí y no en la carpeta de una página porque las cuatro unidades
 * —Comercial, Industrial, Vivienda, Forestal— llevan el mismo hero con distinto
 * contenido. Mismo criterio que <Proximamente>: la sección es compartida, el
 * texto lo pone cada página desde su propio content.ts.
 *
 * No lleva "use client": la entrada es CSS puro —el keyframe `entrar` de
 * motion.css, disparado al cargar— y no hay nada más que necesite el cliente.
 */
export function HeroUnidad({
  ceja,
  titulo,
  descripcion,
  foto,
}: HeroUnidadProps) {
  return (
    <section className="altea-hero-unidad">
      <div className="altea-hero-unidad__rejilla">
        <div className="altea-hero-unidad__texto">
          <p className="altea-hero-unidad__badge">
            <span className="altea-hero-unidad__marca" aria-hidden="true" />
            {ceja}
          </p>
          <h1 className="altea-hero-unidad__titulo">{titulo}</h1>
          <p className="altea-hero-unidad__desc">{descripcion}</p>
        </div>

        <div className="altea-hero-unidad__tarjeta">
          <MediaSlot
            className="altea-hero-unidad__media"
            label={foto.label}
            src={foto.src}
            alt={foto.alt}
            sizes="(max-width: 900px) 100vw, 620px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
