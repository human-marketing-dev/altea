'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CloudLayers from './CloudLayers';
import styles from './IntroAltea.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Escena y logotipo comparten viewBox 1200x800 y preserveAspectRatio.
   Es lo que garantiza que la foto caiga exacta dentro de las letras. */
/* Misma imagen que altea-hero-imagen-prueba-edificios.png (idéntica byte a
   byte) pero en webp: 165 KB contra 1.9 MB. */
const PHOTO = '/hero/altea-hero-image-edificio-prueba.webp';

/* Reparto del timeline. DRAW_* son las perillas de ritmo. */
const T = {
  heroOut: 1.5,
  bank: 1.6,
  photoSettle: 2.2,
  cover: 3.4,
  cloudsOpen: 4.4,
  drawStart: 5.0,
  drawDur: 1.6,
  drawStagger: 0.12,
  photoIntoLogo: 7.3,
  tagline: 8.1,
  exit: 8.9,
  total: 10,
};

export default function IntroAltea() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const draws = q<SVGPathElement>('.js-draw');
      const city = q('#js-city')[0];
      const layers = q('.js-cloud');

      draws.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}px`;
        p.style.strokeDashoffset = `${len}px`;
      });

      gsap.set(city, { scale: 1.13, svgOrigin: '600 720' });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draws.forEach((p) => (p.style.strokeDashoffset = '0px'));
        gsap.set(city, { scale: 1, y: -186 });
        gsap.set(q('#js-cityAll'), { fillOpacity: 0 });
        gsap.set(q('#js-cityInLogo'), { fillOpacity: 1 });
        gsap.set(q('.js-hero'), { opacity: 0 });
        gsap.set(q('#js-tagline'), { opacity: 1 });
        document.body.dataset.introDone = 'true';
        return;
      }

      /* Deriva continua, independiente del scroll: sin esto las capas quedan
         congeladas en cuanto el usuario deja de moverse. Ciclos largos y
         desfasados —26/33/41 s, y cada eje con su propia duración— para que no
         vuelvan a coincidir nunca y no se note el bucle. Solo transforms sobre
         el <svg> interior: los filtros no se recalculan. */
      const drift = [
        { x:  3.2, y: -1.6, s: 1.05, t: 26 },
        { x: -2.4, y: -1.1, s: 1.04, t: 33 },
        { x:  1.8, y:  1.4, s: 1.06, t: 41 },
      ];
      layers.forEach((wrapEl, i) => {
        const inner = wrapEl.querySelector('svg');
        const p = drift[i];
        gsap.to(inner, { xPercent: p.x, duration: p.t,        ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(inner, { yPercent: p.y, duration: p.t * 1.37, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(inner, { scale:    p.s, duration: p.t * 1.8,  ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      /* nubes: la de los lados ya está puesta, solo respira */
      gsap.set(layers[0], { opacity: 1, scale: 1.16 });
      tl.to(layers[0], { scale: 1, duration: 2.6, ease: 'power1.inOut' }, 0);

      gsap.set(layers[1], { opacity: 0, scale: 1.14, yPercent: 46 });
      tl.to(layers[1], { opacity: 1, scale: 1, yPercent: 0, duration: 2.2, ease: 'power2.out' }, T.bank);

      gsap.set(layers[2], { opacity: 0, scale: 1.34, yPercent: 12 });
      tl.to(layers[2], { opacity: 1, scale: 1, yPercent: 0, duration: 1.9, ease: 'power2.inOut' }, T.cover);

      /* el hero cede el paso */
      tl.to(q('.js-hero'), { opacity: 0, y: -34, duration: 1.5, ease: 'power2.in' }, T.heroOut);

      /* la foto se asienta mientras las nubes la tapan */
      tl.to(city, { scale: 1, duration: 2.6, ease: 'power2.inOut', svgOrigin: '600 720' }, T.photoSettle);

      /* las nubes se abren y dejan el cielo limpio; queda una bruma tenue */
      tl.to(q('#js-veil'), { opacity: 1, duration: 1.0, ease: 'power1.out' }, T.cloudsOpen + 0.2)
        .to(layers[0], { opacity: 0.30, duration: 1.4, ease: 'power1.inOut' }, T.cloudsOpen + 0.2)
        .to(layers[1], { opacity: 0.22, duration: 1.4, ease: 'power1.inOut' }, T.cloudsOpen + 0.2)
        .to(layers[2], { opacity: 0.34, duration: 1.4, ease: 'power1.inOut' }, T.cloudsOpen + 0.2);

      /* la foto abandona la escena y se reencuadra para las letras */
      tl.to(q('#js-cityAll'), { fillOpacity: 0, duration: 1.2, ease: 'power2.inOut' }, T.cloudsOpen)
        .to(city, { y: -186, duration: 1.2, ease: 'power2.inOut', svgOrigin: '600 720' }, T.cloudsOpen)
        .to(q('#js-cityFade'), { attr: { y1: 1150, y2: 1340 }, duration: 1.2, ease: 'power2.inOut' }, T.cloudsOpen);

      /* el trazo, letra por letra */
      tl.to(draws, { strokeDashoffset: 0, duration: T.drawDur, stagger: T.drawStagger }, T.drawStart);

      /* la foto entra a las letras, ya cerrado el trazo */
      tl.to(q('#js-cityInLogo'), { fillOpacity: 1, duration: 0.8, ease: 'power2.out' }, T.photoIntoLogo);

      /* parallax dentro de las letras */
      tl.to(city, { y: -244, scale: 1.04, duration: 3.0, svgOrigin: '600 720' }, T.drawStart + 0.6);

      tl.to(q('#js-tagline'), { opacity: 1, duration: 0.7, ease: 'power2.out' }, T.tagline);

      /* salida: las dos capas escalan juntas o la foto se sale del logo */
      tl.to([q('#js-veil'), q('.js-sky'), q('#js-cityLayer')], { opacity: 0, duration: 1.1, ease: 'power2.in' }, T.exit)
        .to(layers, { opacity: 0, duration: 0.9 }, T.exit)
        .to([q('#js-cityLayer'), q('#js-veil')], { scale: 1.10, duration: 1.1, ease: 'power2.in', transformOrigin: '50% 50%' }, T.exit)
        .set({}, {}, T.total);

      /* avisa al header cuando la intro cerró; reversible con el scrub */
      const flag = { v: 0 };
      tl.to(flag, {
        v: 1, duration: 0.6,
        onUpdate: () => {
          if (flag.v > 0.5) document.body.dataset.introDone = 'true';
          else delete document.body.dataset.introDone;
        },
      }, T.exit);
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.wrap}>
      <div className={styles.stage}>

        <div className={`${styles.sky} js-sky`} />

        {/* ── capa de la foto ────────────────────────────── */}
        <svg
          id="js-cityLayer"
          className={styles.layer}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* la base se disuelve en las nubes en vez de cortarse.
                452-604 se completa dentro del area visible incluso en pantallas ultra anchas */}
            <linearGradient id="js-cityFade" gradientUnits="userSpaceOnUse" x1="0" y1="452" x2="0" y2="604">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.42" stopColor="#e2e2e2" />
              <stop offset="0.74" stopColor="#6a6a6a" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask id="js-mCityFade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="800">
              <rect width="1200" height="800" fill="url(#js-cityFade)" />
            </mask>

            {/* al final la foto solo sobrevive dentro del logotipo */}
            <mask id="js-mCityReveal" maskUnits="userSpaceOnUse" x="-800" y="-600" width="2800" height="2200">
              <rect id="js-cityAll" x="-800" y="-600" width="2800" height="2200" fill="#fff" />
              <g transform="translate(150.03 268.44) scale(0.586)">
                <path id="js-cityInLogo" fillOpacity="0" fill="#fff" fillRule="evenodd" d="M1536.62,113.43h-125.65S1472.72.39,1472.72.39l63.9,113.04Z M1057.39,181.23h-157.3s-.22,75.86-.22,75.86l203.69-.03.03,50.91-259.53.06V6.16s259.56-.01,259.56-.01l-.05,51.42h-203.51s-.11,73.63-.11,73.63l157.37-.06.06,50.1Z M1339.69,253.09l-144.83.03-27.87,55.08-59.2-.27,90.75-178.8L1264.73,0l137.18,252.15,30.08,55.75-62.84.24-29.46-55.04Z M1324.65,210.62l-116.55.09,57.06-113.61,25.85,48.84,33.65,64.68Z M704.64,307.95l-57.34.05V57.54s-122.5.04-122.5.04l-.11-51.41,301.45-.03.04,51.42h-121.54s0,250.39,0,250.39Z M594.61,257.1l.03,50.91h-261.18s-.12-301.88-.12-301.88l54.84.1.04,250.84,206.4.03Z M237.2,253.11l-144.67-.03-29.72,54.88-62.8.05,87.58-160.34L166.55.19l26.26,50.24,81.02,155.49,52.96,101.97-60.8.21-28.78-54.99Z M223,210.63l-116.24.11,59.37-112.9,51.34,99.91,5.53,12.88Z" />
              </g>
            </mask>
          </defs>

          <g mask="url(#js-mCityReveal)">
            <g id="js-city" mask="url(#js-mCityFade)">
              <image href={PHOTO} x="-60" y="117" width="1320" height="743" preserveAspectRatio="xMidYMid meet" />
            </g>
          </g>
        </svg>

        <CloudLayers />

        {/* ── contenido del hero ─────────────────────────── */}
        <div className={`${styles.hero} js-hero`}>
          <h1 className={styles.title}>Crear. Desarrollar. Activar.</h1>
          <p className={styles.copy}>
            Proyectos <span className={styles.accent}>comerciales, industriales, de vivienda y forestales</span> sobre
            reserva territorial propia, en 21 estados de México.
          </p>
          <button type="button" className={styles.cta}>Conoce los proyectos</button>
        </div>

        {/* ── logotipo ───────────────────────────────────── */}
        <svg
          id="js-veil"
          className={styles.layer}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <defs>
            <filter id="js-markShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="7" floodColor="#0d2230" floodOpacity="0.42" />
            </filter>
          </defs>

          <g filter="url(#js-markShadow)" transform="translate(150.03 268.44) scale(0.586)">
            <g fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            <path className="js-draw" d="M1536.62,113.43h-125.65S1472.72.39,1472.72.39l63.9,113.04Z" />
            <path className="js-draw" d="M1057.39,181.23h-157.3s-.22,75.86-.22,75.86l203.69-.03.03,50.91-259.53.06V6.16s259.56-.01,259.56-.01l-.05,51.42h-203.51s-.11,73.63-.11,73.63l157.37-.06.06,50.1Z" />
            <path className="js-draw" d="M1339.69,253.09l-144.83.03-27.87,55.08-59.2-.27,90.75-178.8L1264.73,0l137.18,252.15,30.08,55.75-62.84.24-29.46-55.04Z" />
            <path className="js-draw" d="M1324.65,210.62l-116.55.09,57.06-113.61,25.85,48.84,33.65,64.68Z" />
            <path className="js-draw" d="M704.64,307.95l-57.34.05V57.54s-122.5.04-122.5.04l-.11-51.41,301.45-.03.04,51.42h-121.54s0,250.39,0,250.39Z" />
            <path className="js-draw" d="M594.61,257.1l.03,50.91h-261.18s-.12-301.88-.12-301.88l54.84.1.04,250.84,206.4.03Z" />
            <path className="js-draw" d="M237.2,253.11l-144.67-.03-29.72,54.88-62.8.05,87.58-160.34L166.55.19l26.26,50.24,81.02,155.49,52.96,101.97-60.8.21-28.78-54.99Z" />
            <path className="js-draw" d="M223,210.63l-116.24.11,59.37-112.9,51.34,99.91,5.53,12.88Z" />
            </g>
          </g>

          <g id="js-tagline" opacity="0" filter="url(#js-markShadow)" fill="none" stroke="#fff"
             strokeWidth="2" strokeMiterlimit="10" transform="translate(150.03 268.44) scale(0.586)">
            <path d="M86.24,422.51v-.14c0-14.1,10.63-25.65,25.86-25.65,9.35,0,14.95,3.12,19.56,7.65l-6.94,8.01c-3.83-3.47-7.72-5.6-12.68-5.6-8.36,0-14.39,6.94-14.39,15.45v.14c0,8.5,5.88,15.59,14.39,15.59,5.67,0,9.14-2.27,13.04-5.81l6.94,7.02c-5.1,5.46-10.77,8.86-20.34,8.86-14.6,0-25.44-11.27-25.44-25.51Z" />
            <path d="M140.72,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM162.69,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <path d="M191.95,397.57h37.42v9.71h-26.57v10.06h23.38v9.71h-23.38v10.42h26.93v9.71h-37.77v-49.6Z" />
            <path d="M256.43,397.22h10.06l21.26,49.96h-11.41l-4.54-11.13h-20.97l-4.54,11.13h-11.12l21.26-49.96ZM267.91,426.41l-6.59-16.09-6.59,16.09h13.18Z" />
            <path d="M295.4,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM317.37,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <path d="M391.87,397.57h19.35c15.59,0,26.36,10.7,26.36,24.66v.14c0,13.96-10.77,24.8-26.36,24.8h-19.35v-49.6ZM402.78,407.42v29.9h8.43c8.93,0,14.95-6.02,14.95-14.81v-.14c0-8.79-6.02-14.95-14.95-14.95h-8.43Z" />
            <path d="M447.27,397.57h37.42v9.71h-26.57v10.06h23.38v9.71h-23.38v10.42h26.93v9.71h-37.77v-49.6Z" />
            <path d="M491.34,439.95l6.45-7.72c4.46,3.68,9.14,6.02,14.81,6.02,4.46,0,7.16-1.77,7.16-4.68v-.14c0-2.76-1.7-4.18-9.99-6.31-9.99-2.55-16.44-5.31-16.44-15.16v-.14c0-9,7.23-14.95,17.36-14.95,7.23,0,13.39,2.27,18.42,6.31l-5.67,8.22c-4.39-3.05-8.72-4.89-12.9-4.89s-6.38,1.91-6.38,4.32v.14c0,3.26,2.13,4.32,10.7,6.52,10.06,2.62,15.73,6.24,15.73,14.88v.14c0,9.85-7.51,15.38-18.21,15.38-7.51,0-15.09-2.62-21.05-7.94Z" />
            <path d="M556.04,397.22h10.06l21.26,49.96h-11.41l-4.54-11.13h-20.97l-4.54,11.13h-11.12l21.26-49.96ZM567.52,426.41l-6.59-16.09-6.59,16.09h13.18Z" />
            <path d="M595.01,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM616.97,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <path d="M646.23,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM668.2,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <path d="M695.26,422.51v-.14c0-14.1,11.12-25.65,26.43-25.65s26.29,11.41,26.29,25.51v.14c0,14.1-11.12,25.65-26.43,25.65s-26.29-11.41-26.29-25.51ZM736.58,422.51v-.14c0-8.5-6.24-15.59-15.02-15.59s-14.88,6.94-14.88,15.45v.14c0,8.5,6.24,15.59,15.02,15.59s14.88-6.94,14.88-15.45Z" />
            <path d="M757.69,397.57h10.91v39.68h24.73v9.92h-35.64v-49.6Z" />
            <path d="M801.54,397.57h10.91v39.68h24.73v9.92h-35.64v-49.6Z" />
            <path d="M862.41,397.22h10.06l21.26,49.96h-11.41l-4.54-11.13h-20.97l-4.54,11.13h-11.12l21.26-49.96ZM873.89,426.41l-6.59-16.09-6.59,16.09h13.18Z" />
            <path d="M901.38,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM923.35,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <path d="M1015.96,397.22h10.06l21.26,49.96h-11.41l-4.54-11.13h-20.97l-4.54,11.13h-11.12l21.26-49.96ZM1027.44,426.41l-6.59-16.09-6.59,16.09h13.18Z" />
            <path d="M1049.54,422.51v-.14c0-14.1,10.63-25.65,25.86-25.65,9.35,0,14.95,3.12,19.56,7.65l-6.94,8.01c-3.83-3.47-7.72-5.6-12.68-5.6-8.36,0-14.39,6.94-14.39,15.45v.14c0,8.5,5.88,15.59,14.39,15.59,5.67,0,9.14-2.27,13.04-5.81l6.94,7.02c-5.1,5.46-10.77,8.86-20.34,8.86-14.6,0-25.44-11.27-25.44-25.51Z" />
            <path d="M1115.58,407.63h-15.09v-10.06h41.1v10.06h-15.09v39.54h-10.91v-39.54Z" />
            <path d="M1150.44,397.57h10.91v49.6h-10.91v-49.6Z" />
            <path d="M1169.5,397.57h12.05l12.97,34.94,12.97-34.94h11.76l-20.05,49.96h-9.64l-20.05-49.96Z" />
            <path d="M1236.81,397.22h10.06l21.26,49.96h-11.41l-4.54-11.13h-20.97l-4.54,11.13h-11.13l21.26-49.96ZM1248.29,426.41l-6.59-16.09-6.59,16.09h13.18Z" />
            <path d="M1275.78,397.57h22.68c6.31,0,11.2,1.77,14.46,5.03,2.76,2.76,4.25,6.66,4.25,11.34v.14c0,8.01-4.32,13.04-10.63,15.38l12.12,17.72h-12.76l-10.63-15.87h-8.57v15.87h-10.91v-49.6ZM1297.75,421.66c5.31,0,8.36-2.83,8.36-7.02v-.14c0-4.68-3.26-7.09-8.57-7.09h-10.84v14.24h11.05Z" />
            <circle cx="366.21" cy="424.86" r="6.8" />
            <circle cx="973" cy="417.11" r="6.8" />
          </g>
        </svg>

      </div>
    </div>
  );
}
