"use client";

import { useEffect, useId, useState } from "react";
import { CANALES, enlaceWhatsApp } from "@/lib/contacto";

export interface WhatsAppFabProps {
  /** Mensaje con el que abre la conversación. */
  mensaje?: string;
}

const SALUDO =
  "Hola, somos Altea. ¿En qué te podemos ayudar? Escríbenos y te contestamos por WhatsApp.";

function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.69 8.21-8.23 8.21Z" />
    </svg>
  );
}

/**
 * Botón flotante de WhatsApp con panel intermedio.
 *
 * El primer clic abre un chat pequeño con un saludo y un campo; al enviar, abre
 * WhatsApp con ese texto ya escrito. Así el visitante ve a quién le escribe
 * antes de salir del sitio, y llega el primer mensaje redactado.
 *
 * ⚠ El número todavía es provisional — ver lib/contacto.ts.
 */
export function WhatsAppFab({ mensaje }: WhatsAppFabProps) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const id = useId();

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const destino = enlaceWhatsApp(texto.trim() || mensaje);

  return (
    <div className="altea-wa">
      {abierto && (
        <div className="altea-wa__panel" role="dialog" aria-labelledby={`${id}-titulo`}>
          <div className="altea-wa__cabecera">
            <IconoWhatsApp className="altea-wa__avatar" />
            <div>
              <p id={`${id}-titulo`} className="altea-wa__nombre">
                Altea
              </p>
              <p className="altea-wa__estado">Normalmente responde en unos minutos</p>
            </div>
            <button
              type="button"
              className="altea-wa__cerrar"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div className="altea-wa__cuerpo">
            <p className="altea-wa__burbuja">{SALUDO}</p>
          </div>

          <form
            className="altea-wa__form"
            onSubmit={(evento) => {
              evento.preventDefault();
              window.open(destino, "_blank", "noopener,noreferrer");
              setAbierto(false);
            }}
          >
            <label className="sr-only" htmlFor={`${id}-mensaje`}>
              Tu mensaje
            </label>
            <input
              id={`${id}-mensaje`}
              className="altea-wa__input"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Escribe tu mensaje…"
              autoComplete="off"
            />
            <button type="submit" className="altea-wa__enviar">
              Abrir WhatsApp
              <IconoWhatsApp className="altea-wa__enviar-icono" />
            </button>
          </form>

          <p className="altea-wa__pie">
            Se abrirá WhatsApp con {CANALES.telefono}
          </p>
        </div>
      )}

      <button
        type="button"
        className="altea-wa__boton"
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar chat de WhatsApp" : "Escríbenos por WhatsApp"}
        onClick={() => setAbierto((valor) => !valor)}
      >
        {abierto ? (
          <span className="altea-wa__aspa" aria-hidden="true">
            ×
          </span>
        ) : (
          <IconoWhatsApp className="altea-wa__icono" />
        )}
      </button>
    </div>
  );
}
