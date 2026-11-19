import Image from "next/image";
import styles from "./Spillested.module.css";

// Kortet er et eksempelbillede (som i Figma) – kun navn og by skifter med eventet
export default function Spillested({ event }) {
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
          <Image src="/assets/icons/sted.svg" alt="" width={24} height={24} />
          Kort over {event.spillested}
        </span>
      </div>

      <p className={styles.navn}>{event.spillested}</p>
      <p className={styles.by}>{event.by}</p>
    </div>
  );
}
