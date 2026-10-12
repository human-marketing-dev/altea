"use client";

import { useRef, useState } from "react";
import { CarruselTarjetas } from "@/app/ui";
import { FichaComercial } from "./FichaComercial";
import type { Plaza } from "./content";
import { GALERIA_PLAZAS, PLAZAS } from "./content";

/**
 * Las ocho plazas, en carrusel, con la misma tarjeta que los proyectos del home.
 *
 * La tarjeta es <TarjetaProyecto> y el movimiento <CarruselTarjetas>, las dos en
 * ui/. Aquí sólo está lo propio de comercial: qué dice cada tarjeta y qué ficha
 * abre.
 *
 * ⚠ EL MOVIMIENTO NO ES EL DEL HOME, Y ES DELIBERADO. Allá el carril se fija y
 * lo arrastra el scroll de la página; aquí no cabe, porque EL HERO DE
 * /comercial YA ESTÁ FIJADO y dos bloques seguidos que secuestran el scroll
 * marean —bajas y no avanzas—. El carrusel se mueve a mano: entra quien quiera
 * ver las ocho y el resto sigue bajando.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ANTES ERA UN ÍNDICE, Y SE FUE ENTERO
 *
 * Eran filas de texto —nombre, ubicación, formato y visitantes— separadas por
 * línea fina, con una foto que perseguía al cursor con retraso y se inclinaba
 * según la velocidad. Con las tarjetas no hay dónde ponerla: la foto ya está en
 * la tarjeta, a tamaño grande y quieta, así que un visor flotante repetiría la
 * misma imagen dos veces. Se fueron con él .com-ix y .com-visor de la hoja.
 *
 * Lo que sí se pierde y conviene saberlo: el índice enseñaba los cuatro datos de
 * las ocho plazas DE UNA VEZ, y la tarjeta enseña tres —nombre, ciudad y
 * formato— y manda los visitantes y la descripción a la ficha. Es el trato que
 * pide un formato de tarjetas.
 */
export function CarrilPlazas() {
  const [activa, setActiva] = useState<Plaza | null>(null);
  const origen = useRef<HTMLButtonElement | null>(null);

  return (
    <CarruselTarjetas
      titulo={GALERIA_PLAZAS.titulo}
      tituloId="plazas-titulo"
      items={PLAZAS.map((plaza) => ({
        id: plaza.id,
        nombre: plaza.nombre,
        /*
         * La ciudad y no el formato, que es lo que llevaría la línea equivalente
         * del home. Dentro de /comercial las ocho son comerciales, así que el
         * formato distingue poco —cinco de las ocho son Fashion Mall— y lo que de
         * verdad separa una plaza de otra es dónde está.
         */
        pie: plaza.ubicacion,
        /*
         * El formato va de chapa arriba a la izquierda, con su propio velo: es
         * el dato que la tarjeta no puede dar de otra forma, y en el home esa
         * chapa no existe porque allá la unidad ya va de pie. Sale del primer
         * par del <dl> de la ficha, que es el mismo "Formato".
         */
        etiqueta: plaza.datos[0].valor,
        foto: plaza.foto,
      }))}
      onAbrir={(k, boton) => {
        origen.current = boton;
        setActiva(PLAZAS[k] ?? null);
      }}
    >
      <FichaComercial
        contenido={
          activa && {
            nombre: activa.nombre,
            foto: activa.foto,
            fotoRatio: activa.fotoRatio,
            alt: activa.alt,
            /* Formato · Ubicación · Visitantes, en ese orden: el formato es lo
               que clasifica la plaza y por eso abre. Los dos pares de `datos`
               son Formato y Visitantes, así que la ubicación se intercala. */
            datos: [
              activa.datos[0],
              { etiqueta: "Ubicación", valor: activa.ubicacion },
              activa.datos[1],
            ],
            descripcion: activa.descripcion,
          }
        }
        onCerrar={() => {
          setActiva(null);
          origen.current?.focus();
        }}
        etiquetaVacia="Ficha de la plaza"
      />
    </CarruselTarjetas>
  );
}
