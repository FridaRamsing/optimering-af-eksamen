"use client"; // Lottie kører i browseren, så komponenten skal være en client component
import { Lottie } from "lottie-react";
import styles from "./KategoriLoading.module.css";

export default function KategoriLoading() {
  return (
    // role="status" fortæller skærmlæsere, at siden er ved at indlæse
    <div className={styles.loading} role="status">
      <Lottie
        src="/assets/lotties/loading-stjerne-cirkel.json"
        autoplay
        loop // Cirklen bliver ved med at køre, indtil siden er klar
        className={styles.animation}
        aria-hidden="true"
      />
      <p className={styles.tekst}>Finder events til dig…</p>
    </div>
  );
}
