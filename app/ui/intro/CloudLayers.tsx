/* Las nubes son ruido fractal dibujado por el navegador, no imágenes.
   Cada capa: una pasada de sombra en gris azulado y encima la pasada blanca.
   NUNCA animes baseFrequency ni seed: el filtro se recalcula cada frame
   y el navegador se cae a 15fps. Solo transform y opacity.

   Cada capa son dos elementos, no uno: el <div> exterior es el que mueve el
   timeline del scroll (scale, opacity, yPercent) y el <svg> interior lleva la
   deriva continua. Si compartieran elemento, las dos animaciones escribirían
   el mismo transform y se pisarían. */

import styles from './IntroAltea.module.css';

export default function CloudLayers() {
  return (
    <div className={styles.clouds}>

      {/* 1 · nubes en los lados, centro despejado, mas bruma baja */}
      <div className={`${styles.cloud} js-cloud`}>
        <svg className={styles.cloudInner} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="fxEdges" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0090" numOctaves="6" seed="11" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.995  0 0 0 0 0.98  1 0 0 0 0" />
              <feComponentTransfer><feFuncA type="linear" slope="3.5" intercept="-1.16" /></feComponentTransfer>
            </filter>
            <filter id="fxEdgesSh" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0090" numOctaves="6" seed="11" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.52  0 0 0 0 0.60  0 0 0 0 0.68  1 0 0 0 0" />
              <feComponentTransfer><feFuncA type="linear" slope="3.5" intercept="-1.16" /></feComponentTransfer>
            </filter>

            <linearGradient id="gEdges" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.30" stopColor="#3a3a3a" />
              <stop offset="0.50" stopColor="#000" />
              <stop offset="0.70" stopColor="#3a3a3a" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="mEdges"><rect width="100%" height="100%" fill="url(#gEdges)" /></mask>

            {/* bruma baja: es la que hace que los edificios parezcan flotar */}
            <linearGradient id="gLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.46" stopColor="#000" />
              <stop offset="0.64" stopColor="#4a4a4a" />
              <stop offset="0.80" stopColor="#bdbdbd" />
              <stop offset="1" stopColor="#e6e6e6" />
            </linearGradient>
            <mask id="mLow"><rect width="100%" height="100%" fill="url(#gLow)" /></mask>
          </defs>

          <rect width="100%" height="100%" filter="url(#fxEdgesSh)" mask="url(#mEdges)" opacity="0.55" />
          <rect width="100%" height="100%" filter="url(#fxEdges)" mask="url(#mEdges)" />
          <rect width="100%" height="100%" filter="url(#fxEdges)" mask="url(#mLow)" opacity="0.9" />
        </svg>
      </div>

      {/* 2 · banco denso que sube desde abajo */}
      <div className={`${styles.cloud} js-cloud`}>
        <svg className={styles.cloudInner} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="fxBank" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.0125" numOctaves="6" seed="27" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.99  0 0 0 0 0.985  0 0 0 0 0.97  1 0 0 0 0" />
              <feComponentTransfer><feFuncA type="linear" slope="4.1" intercept="-1.02" /></feComponentTransfer>
            </filter>
            <filter id="fxBankSh" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.0125" numOctaves="6" seed="27" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.48  0 0 0 0 0.57  0 0 0 0 0.66  1 0 0 0 0" />
              <feComponentTransfer><feFuncA type="linear" slope="4.1" intercept="-1.02" /></feComponentTransfer>
            </filter>

            <linearGradient id="gBank" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.06" stopColor="#000" />
              <stop offset="0.34" stopColor="#6e6e6e" />
              <stop offset="0.68" stopColor="#d8d8d8" />
              <stop offset="0.84" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="mBank"><rect width="100%" height="100%" fill="url(#gBank)" /></mask>

            {/* base con degradado, NO un rect de color plano:
                un relleno plano deja un canto duro cruzando la pantalla */}
            <linearGradient id="gBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdfcfa" stopOpacity="0" />
              <stop offset="0.45" stopColor="#fdfcfa" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fdfcfa" stopOpacity="1" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" filter="url(#fxBankSh)" mask="url(#mBank)" opacity="0.5" transform="translate(0 10)" />
          <rect width="100%" height="100%" filter="url(#fxBank)" mask="url(#mBank)" />
          <rect y="54%" width="100%" height="46%" fill="url(#gBase)" />
        </svg>
      </div>

      {/* 3 · cobertura total */}
      <div className={`${styles.cloud} js-cloud`}>
        <svg className={styles.cloudInner} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="fxFull" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0030 0.0062" numOctaves="7" seed="43" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.998  0 0 0 0 0.99  1 0 0 0 0.42" />
              <feComponentTransfer><feFuncA type="linear" slope="2.7" intercept="-0.34" /></feComponentTransfer>
            </filter>
            <filter id="fxFullSh" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0030 0.0062" numOctaves="7" seed="43" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.58  0 0 0 0 0.65  0 0 0 0 0.72  1 0 0 0 0.42" />
              <feComponentTransfer><feFuncA type="linear" slope="2.7" intercept="-0.34" /></feComponentTransfer>
            </filter>
          </defs>

          <rect width="100%" height="100%" filter="url(#fxFullSh)" opacity="0.42" transform="translate(0 16)" />
          <rect width="100%" height="100%" filter="url(#fxFull)" />
        </svg>
      </div>

    </div>
  );
}
