"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavLink {
  label: string;
  href: string;
  /** Se pinta como botón coral en vez de enlace. */
  destacado?: boolean;
}

export interface NavBarProps {
  links?: NavLink[];
  /** `light` sits on cream (dark logo/text), `dark` on ink. @default "light" */
  tone?: "light" | "dark";
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
  { label: "Contacto", href: "/contacto", destacado: true },
];

/**
 * Barra superior. Sticky, con el wordmark y los enlaces principales.
 *
 * Por debajo de 900px los siete enlaces no caben, así que se pliegan en un
 * panel que abre con el botón de menú.
 */
export function NavBar({
  links = DEFAULT_NAV_LINKS,
  tone = "light",
  homeHref = "/",
  className,
}: NavBarProps) {
  const isLight = tone === "light";
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const classes = [
    "altea-navbar",
    isLight ? null : "altea-navbar--dark",
    abierto ? "altea-navbar--abierto" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={classes}>
      <Link href={homeHref} aria-label="Altea — inicio" className="altea-navbar__marca">
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

      <button
        type="button"
        className="altea-navbar__toggle"
        aria-expanded={abierto}
        aria-controls="altea-nav-menu"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
        <span className="altea-navbar__toggle-barra" aria-hidden="true" />
      </button>

      <div id="altea-nav-menu" className="altea-navbar__links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.destacado
                ? "altea-navbar__link altea-navbar__link--destacado"
                : "altea-navbar__link"
            }
            aria-current={ruta === link.href ? "page" : undefined}
            /* Cerrar al navegar: más directo que reaccionar al cambio de ruta
               dentro de un efecto, que dispara un render en cascada. */
            onClick={() => setAbierto(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
