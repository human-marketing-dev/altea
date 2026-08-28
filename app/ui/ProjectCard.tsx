import Image from "next/image";
import Link from "next/link";

export interface ProjectCardProps {
  unit: string;
  title: string;
  location: string;
  stat?: string;
  /**
   * Real photography of the development. Leave undefined until Altea supplies
   * it — the card renders a labelled placeholder rather than a stock photo.
   */
  imageSrc?: string;
  imageAlt?: string;
  /** Makes the whole card a link. */
  href?: string;
  className?: string;
}

/**
 * Real-estate project preview card: image, unit label, title, location and an
 * optional stat line. Grid-friendly.
 */
export function ProjectCard({
  unit,
  title,
  location,
  stat,
  imageSrc,
  imageAlt,
  href,
  className,
}: ProjectCardProps) {
  const classes = ["altea-project-card", className].filter(Boolean).join(" ");

  const content = (
    <>
      <div className="altea-project-card__media">
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt ?? title} fill sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <span className="altea-project-card__placeholder">
            Fotografía pendiente — {title}
          </span>
        )}
      </div>
      <div className="altea-project-card__body">
        <span className="altea-project-card__unit">{unit}</span>
        <div className="altea-project-card__title">{title}</div>
        <div className="altea-project-card__location">{location}</div>
        {stat && <div className="altea-project-card__stat">{stat}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
