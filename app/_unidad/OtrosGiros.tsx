"use client";

import { useRef, useState } from "react";
import { CarruselTarjetas } from "@/app/ui";
import { FichaUnidad } from "./FichaUnidad";
import type { ContenidoUnidad, Giro } from "./tipos";

/**
 * Otros giros: hoteles, hospital y educación.
 *
 * LA MISMA TARJETA Y LA MISMA FICHA QUE LAS PLAZAS (29 oct 2026): <TarjetaProyecto>
 * de <CarruselTarjetas>, y al pulsar, <FichaUnidad> con la foto, el dato y la
 * descripción.
 *
 * Antes eran tres láminas en banda que se abrían al pasar el cursor —la señalada
 * crecía y las otras cedían, todo en CSS con `:has()`— y enseñaban la
 * descripción encima de la foto. Se fueron con ellas .uni-giros y .uni-gr de la
 * hoja. El `numero` ("01") y el `eyebrow` siguen en el contenido y ya no se
 * pintan: la tarjeta de plazas no tiene sitio para ninguno de los dos.
 */
export function OtrosGiros({ giros }: Pick<ContenidoUnidad, "giros">) {
  const GIROS = giros.bloques;
  const [activo, setActivo] = useState<Giro | null>(null);
  /* Quién abrió la ficha, para devolverle el foco al cerrar. */
  const origen = useRef<HTMLButtonElement | null>(null);

  const items = GIROS.map((giro) => ({
    id: giro.id,
    nombre: giro.title,
    /* El primer dato —el proyecto o las marcas—, como la ciudad en plazas. */
    pie: giro.datos?.[0]?.valor ?? "",
    foto: giro.image,
    fotoRatio: giro.fotoRatio,
  }));
  const abrir = (k: number, boton: HTMLButtonElement) => {
    origen.current = boton;
    setActivo(GIROS[k] ?? null);
  };

  /*
   * EN ESCRITORIO, REJILLA; EN MÓVIL, CARRUSEL (29 oct 2026). Las tres del mismo
   * tamaño, sin flechas: es la rejilla fija de <CarruselTarjetas>, la de Vivienda.
   * En móvil la rejilla se apilaría en tres tarjetas a lo alto, así que va el
   * carrusel. Se montan los dos y la hoja enseña uno según el ancho, como en
   * ProximosProyectos (ver .uni-giros__movil en unidad.css); la ficha es una
   * sola, fuera de los dos.
   */
  return (
    <>
      <div className="uni-giros__rejilla">
        <CarruselTarjetas
          titulo={giros.titulo}
          tituloId="giros-titulo"
          nota={giros.nota}
          rejillaHasta={GIROS.length}
          items={items}
          onAbrir={abrir}
        />
      </div>
      <div className="uni-giros__movil">
        <CarruselTarjetas
          titulo={giros.titulo}
          tituloId="giros-titulo-movil"
          nota={giros.nota}
          rejillaHasta={0}
          items={items}
          onAbrir={abrir}
        />
      </div>
      <FichaUnidad
        contenido={
          activo && {
            nombre: activo.title,
            foto: activo.image,
            fotoRatio: activo.fotoRatio,
            alt: activo.alt,
            datos: activo.datos ?? [],
            descripcion: activo.description,
          }
        }
        onCerrar={() => {
          setActivo(null);
          origen.current?.focus();
        }}
        etiquetaVacia="Ficha del giro"
      />
    </>
  );
}
