"use client";
import { Lottie } from "lottie-react";
import styles from "./KoebLoading.module.css";

export default function KoebLoading({ onFaerdig }) {
  return (
    <div className={styles.loading} role="status">
      <h2 className={styles.overskrift}>Vi behandler dit køb</h2>

      <Lottie
        src="/assets/lotties/loading-stjerne-streg.json"
        autoplay
        loop={false}
        className={styles.animation}
        aria-hidden="true"
        subscriptions={{ complete: onFaerdig }} // Kører onFaerdig, når animationen er færdig
      />

      <p className={styles.undertekst}>
        Luk ikke siden. Det tager kun et øjeblik.
      </p>
    </div>
  );
}
