"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Google Analytics 4 (Google tag), propiedad de Altea.
 *
 * Con next/script y `afterInteractive`, que es lo que pide Next para gtag: se
 * pide después de hidratar, así que no retrasa el primer pintado ni el LCP. Las
 * navegaciones dentro del sitio sin recargar las cuenta GA4 solo, con la
 * medición mejorada («cambios de página según el historial del navegador»),
 * que viene activada por omisión en la propiedad: no hay que mandar page_view a
 * mano. Si alguien la apaga en GA, las páginas vistas internas dejan de contar.
 *
 * ⚠ GA pone cookies, y la sección VIII del aviso de privacidad dice que el sitio
 * no las usa: ya no es cierto. Es texto legal de Altea; ver docs/pendientes.md.
 *
 * NO SE CARGA EN EL STUDIO (/studio): sus visitas no son tráfico del sitio. El
 * Studio se abre escribiendo la URL —ninguna página enlaza a él—, así que es
 * una carga completa y aquí se decide. Si algún día se llega desde el sitio sin
 * recargar, gtag ya estaría cargado y contaría esa visita.
 */
const GA_ID = "G-D6JC931K3B";

export function GoogleTag() {
  const ruta = usePathname();
  if (ruta?.startsWith("/studio")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
