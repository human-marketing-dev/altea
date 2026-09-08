"use client";

import { useEffect, useId, useState } from "react";
import { CANALES, enlaceWhatsApp } from "@/lib/contacto";
import { IconoWhatsApp } from "./Iconos";

export interface WhatsAppFabProps {
  /** Mensaje con el que abre la conversación. */
  mensaje?: string;
}

const SALUDO =
  "Hola, somos Altea. ¿En qué te podemos ayudar? Escríbenos y te contestamos por WhatsApp.";


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
