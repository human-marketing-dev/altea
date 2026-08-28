"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  /** Valor final. */
  to: number;
  prefix?: string;
  suffix?: string;
  /** @default 1600 */
  duration?: number;
  className?: string;
}

/**
 * Cifra que cuenta de 0 al valor final la primera vez que entra en pantalla,
 * como pide el wireframe.
 *
 * Renderiza el valor final en el servidor, así que sin JS —o con
 * `prefers-reduced-motion`— el número correcto siempre está ahí.
 */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        setValue(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("es-MX")}
      {suffix}
    </span>
  );
}
