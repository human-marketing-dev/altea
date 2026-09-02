import { MediaSlot, SectionHeading } from "@/app/ui";
import { RESPONSABILIDAD } from "./content";

/** Sección 7 — galería a la izquierda, copy a la derecha. */
export function ResponsabilidadSocial() {
  return (
    <section id="responsabilidad-social" className="nos-rs">
      <ul className="nos-rs__galeria">
        {RESPONSABILIDAD.galeria.map((foto) => (
          <li key={foto.id}>
            <MediaSlot
              label={foto.nota}
              src={foto.src}
              alt={foto.alt ?? ""}
              tone="dark"
              ratio="1 / 1"
              /* Cuadrado desde una fuente 16:9: el alto manda el recorte y el
                 ancho renderizado sube a ~490px en pantallas grandes. */
              sizes="(max-width: 900px) 45vw, 500px"
              className="nos-rs__foto"
            />
          </li>
        ))}
      </ul>
      <div className="nos-rs__copy">
        <SectionHeading
          tone="light"
          eyebrow={RESPONSABILIDAD.eyebrow}
          title={RESPONSABILIDAD.title}
        />
        {RESPONSABILIDAD.descripcion.map((parrafo) => (
          <p key={parrafo.slice(0, 24)}>{parrafo}</p>
        ))}
      </div>
    </section>
  );
}
