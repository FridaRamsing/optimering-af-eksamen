import Image from "next/image";
import styles from "./Spillested.module.css";

// Kortet er et eksempelbillede (som i Figma) – kun navn, by og "Find vej" skifter med eventet
export default function Spillested({ event }) {
  // Google Maps søger selv stedet frem ud fra navn + by
  const kortLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.spillested}, ${event.by}`,
  )}`;

  return (
    <div>
      <div className={styles.kort}>
        <Image
          src="/assets/images/Detaljeside/kort.jpg"
          alt=""
          fill
          sizes="(max-width: 1000px) 100vw, 500px"
          className={styles.kortBillede}
        />
        <span className={styles.kortLabel}>
          <Image src="/assets/icons/sted.svg" alt="" width={32} height={32} />
          Kort over {event.spillested}
        </span>
      </div>

      <div className={styles.adresse}>
        <div>
          <p className={styles.navn}>{event.spillested}</p>
          <p className={styles.by}>{event.by}</p>
        </div>

        <a href={kortLink} target="_blank" rel="noopener noreferrer" className={styles.findVej}>
          Find vej ↗<span className={styles.skjult}> (åbner Google Maps i et nyt vindue)</span>
        </a>
      </div>
    </div>
  );
}
