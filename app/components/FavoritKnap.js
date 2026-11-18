
/*frida*/

// Kører i browseren, fordi knappen skal kunne klikkes og huske sin tilstand
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./FavoritKnap.module.css";

export default function FavoritKnap({ titel }) {
  // Om hjertet er valgt. Nulstilles ved genindlæsning (gemmes ikke endnu)
  const [erFavorit, setErFavorit] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.knap} ${erFavorit ? styles.valgt : ""}`}
      onClick={() => setErFavorit(!erFavorit)}
      aria-pressed={erFavorit}
      aria-label={`Gem ${titel} som favorit`}
    >
      {/* To hjerter oven i hinanden. CSS viser det fyldte ved hover eller når valgt */}
      <Image src="/assets/icons/favorite.svg" alt="" width={24} height={24} className={styles.tom} />
      <Image src="/assets/icons/favorite-hover.svg" alt="" width={24} height={24} className={styles.fyldt} />
    </button>
  );
}
