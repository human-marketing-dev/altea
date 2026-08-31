import Image from "next/image";
import Link from "next/link";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavBarProps {
  /**
   * Upstream takes plain strings with `href="#"`. Here each link carries its
   * own route so the bar works with the App Router.
   */
  links?: NavLink[];
  /** `light` sits on cream (dark logo/text), `dark` on ink. @default "light" */
  tone?: "light" | "dark";
  /** Where the wordmark links to. @default "/" */
  homeHref?: string;
  className?: string;
}

/** Orden y contenido tomados del wireframe de portada. */
export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Comercial", href: "/comercial" },
  { label: "Industrial", href: "/industrial" },
  { label: "Vivienda", href: "/vivienda" },
  { label: "Forestal", href: "/forestal" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Top navigation bar with the wordmark and primary section links.
 */
export function NavBar({
  links = DEFAULT_NAV_LINKS,
  tone = "light",
  homeHref = "/",
  className,
}: NavBarProps) {
  const isLight = tone === "light";
  const classes = [
    "altea-navbar",
    isLight ? null : "altea-navbar--dark",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={classes}>
      <Link href={homeHref} aria-label="Altea — inicio">
        <Image
          className="altea-navbar__logo"
          src={`/brand/logos/altea-logo-${isLight ? "dark" : "light"}.svg`}
          alt="Altea"
          width={1632}
          height={324}
          priority
          unoptimized
        />
      </Link>
      <div className="altea-navbar__links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="altea-navbar__link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
