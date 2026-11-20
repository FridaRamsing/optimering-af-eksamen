import Image from "next/image";
import styles from "./Spotlys.module.css";

// Rampelys som i Figma: billedet er mørkt, og to "huller" viser det lyse billede.
// Hullerne glider rundt og vokser, til hele billedet er tændt. Kører én gang (al animation i CSS)
export default function Spotlys({ billede }) {
  return (
    <div className={styles.spots} aria-hidden="true">
      <div className={styles.moerke} />

      <div className={`${styles.belyst} ${styles.venstre}`}>
        <Image src={billede} alt="" fill sizes="100vw" className={styles.billede} />
      </div>

      <div className={`${styles.belyst} ${styles.hoejre}`}>
        <Image src={billede} alt="" fill sizes="100vw" className={styles.billede} />
      </div>
    </div>
  );
}
