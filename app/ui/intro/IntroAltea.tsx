'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CloudLayers, { NubesBarrido } from './CloudLayers';
import { BAJADA, BAJADA_CIRCULOS, CONTORNOS, ENCAJE, SILUETA } from './logo-paths';
import styles from './IntroAltea.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHOTO = '/hero/edificio-altea-home.webp';

/** La secuencia se recorre una vez por visita. */
const SESION = 'altea:intro-vista';

/* Reparto del timeline. Duración interna 10; el barrido cierra en 10.1. */
const T = {
  heroOut: 1.5,
  cityRise: 1.8,
  veil: 4.9,
  draw: 5.7,
  cityOut: 7.5,
  parallax: 7.6,
  cityFade: 7.92,
  tagline: 8.1,
  outro: 8.4,
  under: 9.25,
};

/* Recorrido del edificio. svgOrigin y no transformOrigin: dentro de un SVG el
   origen va en coordenadas del viewBox. */
const ORIGEN_CIUDAD = '600 720';

export default function IntroAltea() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const draws = q<SVGPathElement>('.js-draw');
      const city = q('#city')[0];
      const nubes = q('.js-clouds')[0];
      const nubesInner = q('.js-clouds-inner')[0];
      const veil = q('#veil')[0];
      const outro = q('.js-outro')[0];

      /*
       * GSAP no protesta si un target no existe: la tween se crea y no anima
       * nada. Un selector mal escrito se ve igual que una animación mal
       * calibrada, así que en desarrollo se comprueba que todos resuelvan.
       */
      if (process.env.NODE_ENV !== 'production') {
        const conteo: Record<string, number> = {
          '.js-draw': draws.length,
          '#city': q('#city').length,
          '#cityLayer': q('#cityLayer').length,
          '#cityAll': q('#cityAll').length,
          '#gCityFade': q('#gCityFade').length,
          '#veil': q('#veil').length,
          '#tagline': q('#tagline').length,
          '.js-sky': q('.js-sky').length,
          '.js-hero': q('.js-hero').length,
          '.js-clouds': q('.js-clouds').length,
          '.js-clouds-inner': q('.js-clouds-inner').length,
          '.js-outro': q('.js-outro').length,
        };
        const vacios = Object.entries(conteo).filter(([, n]) => n === 0);
        if (vacios.length) {
          console.error('[intro] selectores sin resolver:', vacios.map(([k]) => k).join(', '), conteo);
        } else {
          console.info('[intro] selectores ok', conteo);
        }
      }

      /* Cada trazo se prepara con su propio largo: dasharray y dashoffset
         iguales a getTotalLength() lo dejan oculto, y animar el offset a 0 lo
         dibuja. pathLength daría resultados inconsistentes entre navegadores, y
         DrawSVGPlugin es de pago. */
      draws.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}px`;
        p.style.strokeDashoffset = `${len}px`;
      });

      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* Deriva de ambiente, independiente del scroll: sin esto las nubes quedan
         congeladas en cuanto el usuario deja de moverse. Una duración distinta
         por eje para que los ciclos nunca coincidan y no se note el bucle. */
      if (!reducido) {
        gsap.to(nubesInner, { xPercent: 7.5, duration: 19, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(nubesInner, { yPercent: -3.2, duration: 26, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(nubesInner, { scale: 1.1, duration: 34, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }

      /*
       * sessionStorage sólo existe en el cliente. Leerlo durante el render hacía
       * que el servidor pintara una cosa y el cliente otra, y React abortaba la
       * hidratación. Aquí no hay riesgo: useGSAP corre después de montar y el
       * estado estático se aplica con un atributo que lee el CSS.
       */
      /*
       * En desarrollo la bandera no se lee ni se escribe. Con sessionStorage
       * sobreviviendo a los recargos de la pestaña, una sola pasada convertía
       * cada recarga posterior en una sesión sin intro; nos costó dos rondas de
       * diagnóstico creer que el problema estaba en otro lado.
       */
      const enProduccion = process.env.NODE_ENV === 'production';
      const marcarVista = () => {
        if (enProduccion) sessionStorage.setItem(SESION, '1');
      };
      const yaVista = enProduccion && sessionStorage.getItem(SESION) === '1';

      /* Escape para desarrollo: sessionStorage sobrevive a los recargos de la
         pestaña, así que sin esto sólo se ve la secuencia una vez por pestaña
         nueva. Con ?intro=1 se ignora la bandera. */
      const forzada = new URLSearchParams(window.location.search).get('intro') === '1';

      if (reducido || (yaVista && !forzada)) {
        /*
         * Sin recorrido, la escena se queda en su PRIMER cuadro y no en el
         * último. El último es la pantalla ya barrida: sin título, sin
         * descripción y sin CTA, o sea una pantalla en blanco de cortesía. El
         * primero es el hero completo, que es lo que sirve como apertura.
         */
        root.current?.setAttribute('data-static', '');
        gsap.set(city, { scale: 0.82, y: 108, svgOrigin: ORIGEN_CIUDAD });
        /* El CSS ya lo deja fuera de cuadro; esto lo repite para que la caché
           interna de GSAP coincida con lo pintado si alguien anima el barrido
           más adelante desde otro lado. */
        gsap.set(outro, { yPercent: 71, y: 0 });
        document.body.dataset.introDone = 'true';
        return;
      }

      /* Determinista: si se vuelve al home desde otra página, el <body> puede
         traer la bandera puesta de la visita anterior. */
      delete document.body.dataset.introDone;

      let recorrida = false;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          /*
           * La bandera se escribe cuando el usuario RECORRIÓ la secuencia, no
           * cuando el scroll simplemente está más abajo de ella.
           *
           * `onLeave` no sirve para eso: al recargar con la página ya
           * desplazada, ScrollTrigger encuentra el trigger pasado y lo dispara
           * durante el refresh, así que la marcaba como vista sin que se hubiera
           * visto nada. Marcarla al montar era peor todavía: StrictMode invoca
           * el efecto dos veces en desarrollo y la segunda pasada ya la leía
           * como vista.
           *
           * `recorrida` es lo que distingue los dos casos: sólo se pone en true
           * si en algún momento el progreso estuvo por debajo del final, o sea
           * si hubo secuencia de verdad.
           */
          onUpdate: (self) => {
            if (self.progress < 0.999) {
              recorrida = true;
            } else if (recorrida) {
              marcarVista();
            }
          },
        },
      });

      /* 1.5 — el bloque del hero cede el paso.
         force3D en false: promoverlo a capa 3D redondea el texto a píxel de
         textura y el título se ve sucio mientras se desvanece. */
      tl.to(q('.js-hero'), { opacity: 0, y: -34, duration: 1.5, ease: 'power2.in', force3D: false }, T.heroOut);

      /* 1.8 → 7.5 — el edificio sube y crece. */
      tl.fromTo(
        city,
        { scale: 0.82, y: 108, svgOrigin: ORIGEN_CIUDAD },
        { scale: 1.02, y: -152, svgOrigin: ORIGEN_CIUDAD, duration: 5.7 },
        T.cityRise,
      );

      /* 4.9 — entra la capa del logotipo. */
      tl.to(veil, { opacity: 1, duration: 0.8, ease: 'power2.out' }, T.veil);

      /* 5.7 — se traza el logotipo, letra por letra. Con stagger 0.06 el último
         cierra en 7.62, así que a las 7.5 —cuando la foto pasa a las letras— el
         trazo está prácticamente completo. */
      tl.to(draws, { strokeDashoffset: 0, duration: 1.5, stagger: 0.06 }, T.draw);

      /*
       * 7.5 — la foto desaparece de todo menos de las letras.
       *
       * #cityInLogo va en fillOpacity 1 desde el principio: mientras #cityAll
       * siga en 1 no se nota, y así el paso a las letras es un solo movimiento
       * en lugar de dos cruzándose.
       */
      tl.to(q('#cityAll'), { fillOpacity: 0, duration: 0.4 }, T.cityOut);

      /* 7.6 — parallax dentro de las letras. */
      tl.to(city, { y: -172, scale: 1.04, duration: 1.6, svgOrigin: ORIGEN_CIUDAD }, T.parallax);

      /*
       * 7.92 — se aparta el desvanecido de la base.
       *
       * Va DESPUÉS de 7.5 a propósito. Al revés queda medio segundo con la foto
       * todavía en escena y sin desvanecido, y su canto inferior aparece.
       */
      tl.to(q('#gCityFade'), { attr: { y1: 1150, y2: 1340 }, duration: 0.3 }, T.cityFade);

      /* 8.1 — entra la bajada del logotipo. */
      tl.to(q('#tagline'), { opacity: 1, duration: 0.7, ease: 'power2.out' }, T.tagline);

      /* 8.4 → 10.1 — el barrido sube y entrega la siguiente sección. */
      /*
       * `y: 0` explícito en los dos extremos, no por gusto: el CSS deja el
       * barrido en translateY(71%) y GSAP no puede leer un porcentaje desde la
       * matriz calculada —lo decodifica como px—. Sin esto, ese px se queda en
       * la caché de transformaciones y se suma al yPercent, y el recorrido sale
       * del doble de largo.
       */
      tl.fromTo(outro, { yPercent: 71, y: 0 }, { yPercent: -71, y: 0, duration: 1.7 }, T.outro);

      /* 9.25 — bajo el barrido se apaga todo lo demás. */
      tl.to([q('.js-sky'), q('#cityLayer'), veil, nubes], { opacity: 0, duration: 0.6 }, T.under);

      /* Avisa al header cuando la intro cerró; reversible con el scrub. */
      const flag = { v: 0 };
      tl.to(
        flag,
        {
          v: 1,
          duration: 0.6,
          onUpdate: () => {
            if (flag.v > 0.5) document.body.dataset.introDone = 'true';
            else delete document.body.dataset.introDone;
          },
        },
        T.under,
      );
    },
    { scope: root },
  );

  const saltar = () => {
    const nodo = root.current;
    if (!nodo) return;
    // Saltarla cuenta como haberla visto (en producción; en local, nunca).
    if (process.env.NODE_ENV === 'production') sessionStorage.setItem(SESION, '1');
    window.scrollTo({ top: nodo.offsetTop + nodo.offsetHeight, behavior: 'smooth' });
  };

  return (
    <div ref={root} className={styles.wrap}>
      {/* Sin JS no hay recorrido que consumir: 470vh serían casi cinco
          pantallas de la misma imagen pegada. */}
      <noscript>
        <style>{`.${styles.wrap}{height:100svh}`}</style>
      </noscript>
      <div className={styles.stage}>

        {/* 1 · el cielo */}
        <div className={`${styles.sky} js-sky`} />

        {/* 2 · las nubes de ambiente, DETRÁS del edificio */}
        <CloudLayers />

        {/* 3 · la foto de las torres */}
        <svg
          id="cityLayer"
          className={`${styles.layer} ${styles.cityLayer}`}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Disuelve la base de la foto. userSpaceOnUse lo ancla a las
                coordenadas de la foto, así que VIAJA CON ELLA: por más que suba,
                su canto inferior nunca aparece. */}
            <linearGradient id="gCityFade" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="772">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.45" stopColor="#dcdcdc" />
              <stop offset="0.78" stopColor="#5e5e5e" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask id="mCityFade" maskUnits="userSpaceOnUse" x="-800" y="-600" width="2800" height="2200">
              <rect x="-800" y="-600" width="2800" height="2200" fill="url(#gCityFade)" />
            </mask>

            {/* Difumina los costados: en esta foto el recorte corta contenido a
                izquierda y derecha. Es lo que permite usarla sin sangrar a todo
                lo ancho. */}
            <linearGradient id="gCitySides" gradientUnits="userSpaceOnUse" x1="-70" y1="0" x2="1270" y2="0">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.07" stopColor="#fff" />
              <stop offset="0.93" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask id="mCitySides" maskUnits="userSpaceOnUse" x="-800" y="-600" width="2800" height="2200">
              <rect x="-800" y="-600" width="2800" height="2200" fill="url(#gCitySides)" />
            </mask>

            {/* Confina la foto al logotipo: al bajar la opacidad del rect, lo
                único que queda visible es lo que cae dentro de las letras. */}
            <mask id="mCityReveal" maskUnits="userSpaceOnUse" x="-800" y="-600" width="2800" height="2200">
              <rect id="cityAll" x="-800" y="-600" width="2800" height="2200" fill="#fff" />
              <g transform={ENCAJE}>
                <path id="cityInLogo" d={SILUETA} fill="#fff" fillRule="evenodd" fillOpacity={1} />
              </g>
            </mask>
          </defs>

          <g id="cityShift" mask="url(#mCityReveal)">
            <g id="city" mask="url(#mCityFade)">
              <g mask="url(#mCitySides)">
                {/* xMidYMin ancla arriba y recorta por abajo: conserva las torres
                    y saca de cuadro la calle. */}
                <image
                  href={PHOTO}
                  x="-70"
                  y="250"
                  width="1340"
                  height="560"
                  preserveAspectRatio="xMidYMin slice"
                />
              </g>
            </g>
          </g>
        </svg>

        {/* 4 · contenido del hero */}
        <div className={`${styles.hero} js-hero`}>
          <h1 className={styles.title}>Crear. Desarrollar. Activar.</h1>
          <p className={styles.copy}>
            Proyectos <span className={styles.accent}>comerciales, industriales, de vivienda y forestales</span> sobre
            reserva territorial propia, en 21 estados de México.
          </p>
          <a className={styles.cta} href="#unidades">Conoce los proyectos</a>
        </div>

        {/* 5 · el logotipo */}
        <svg
          id="veil"
          className={`${styles.layer} ${styles.veil}`}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <defs>
            <filter id="markShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="7" floodColor="#0d2230" floodOpacity="0.42" />
            </filter>
          </defs>

          <g filter="url(#markShadow)" transform={ENCAJE}>
            <g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
              {CONTORNOS.map((d, i) => (
                <path key={i} className="js-draw" d={d} />
              ))}
            </g>
          </g>

          {/* La bajada no se dibuja con dashoffset: son formas diminutas sin
              expandir y el trazo se ve como estática. Entra con fade. */}
          <g
            id="tagline"
            opacity="0"
            filter="url(#markShadow)"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeMiterlimit="10"
            transform={ENCAJE}
          >
            {BAJADA.map((d, i) => (
              <path key={i} d={d} />
            ))}
            {BAJADA_CIRCULOS.map((c, i) => (
              <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
            ))}
          </g>
        </svg>

        {/* Las capas del logotipo son decorativas para el lector de pantalla; el
            nombre de la marca tiene que existir igual como texto real. */}
        <p className={styles.srOnly}>Altea</p>

        {/* 6 · el barrido de salida */}
        <div className={`${styles.outro} js-outro`} aria-hidden="true">
          <div className={styles.sheet} />
          <NubesBarrido />
        </div>

        <button type="button" className={styles.skip} onClick={saltar}>
          Saltar intro
        </button>

      </div>
    </div>
  );
}
