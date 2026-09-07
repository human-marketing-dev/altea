import Image from "next/image";
import styles from "./IntroAltea.module.css";

/**
 * Las nubes de la intro.
 *
 * Un solo archivo repetido cuatro veces, dos de ellas espejadas en X para que
 * no se lea la repetición. El alfa de nube-altea-hero.webp está limpio en los
 * cuatro bordes —verificado—, que es lo que permite usarla flotando dentro del
 * cuadro; si tocara alguna orilla, ahí quedaría un canto recto cruzando la
 * pantalla en cuanto la capa se mueve.
 */
const NUBE = "/hero/nube-altea-hero.webp";
const NUBE_W = 1024;
const NUBE_H = 435;

/** Nada en el tercio central: ahí viven el edificio y el logotipo. */
const AMBIENTE = [
  { left: "-6%", top: "6%", width: "34%", espejo: false },
  { left: "1%", top: "44%", width: "27%", espejo: true },
  { right: "-8%", top: "12%", width: "36%", espejo: true },
  { right: "-1%", top: "50%", width: "29%", espejo: false },
] as const;

/** Las del barrido sí cruzan el cuadro, pero sin sobresalir de la caja: con
 *  mask-repeat en no-repeat, lo que quede fuera desaparece. */
const BARRIDO = [
  { left: "-4%", top: "30%", width: "40%", espejo: false },
  { left: "26%", top: "38%", width: "38%", espejo: true },
  { right: "-2%", top: "33%", width: "42%", espejo: false },
  { left: "12%", top: "48%", width: "34%", espejo: true },
] as const;

type Colocacion = {
  left?: string;
  right?: string;
  top: string;
  width: string;
  espejo: boolean;
};

function Nubes({ lista }: { lista: readonly Colocacion[] }) {
  return (
    <>
      {lista.map((n, i) => (
        <Image
          key={i}
          className={styles.nube}
          src={NUBE}
          alt=""
          aria-hidden
          width={NUBE_W}
          height={NUBE_H}
          sizes="40vw"
          priority={i < 2}
          style={{
            left: n.left,
            right: n.right,
            top: n.top,
            width: n.width,
            transform: n.espejo ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </>
  );
}

/**
 * Capa de ambiente. Va DETRÁS del edificio y nunca debe taparlo.
 *
 * Son dos elementos y no uno: el contenedor lo mueve el timeline del scroll y
 * el interior lleva la deriva continua. Sobre el mismo elemento, las dos
 * animaciones escribirían el mismo transform y se pelearían.
 */
export default function CloudLayers() {
  return (
    <div className={`${styles.clouds} js-clouds`} aria-hidden="true">
      <div className={`${styles.cloudsInner} js-clouds-inner`}>
        <Nubes lista={AMBIENTE} />
      </div>
    </div>
  );
}

/** Las cuatro nubes que van encima de la hoja del barrido. */
export function NubesBarrido() {
  return <Nubes lista={BARRIDO} />;
}
