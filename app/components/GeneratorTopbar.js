"use client"; /* skyderne og knapperne skal reagere på brugeren*/

import { useState } from "react";
import { useRouter } from "next/navigation";
import { koenValg, koenNavn } from "@/lib/maalgruppe";
import styles from "./GeneratorTopbar.module.css";

// alder og koen kommer fra URL'en (via page.js)
export default function GeneratorTopbar({ alder, koen }) {
  const router = useRouter();

  // Alderen på skyderen. Ændres med det samme, mens man trækker
  const [visAlder, setVisAlder] = useState(alder);

  // Opdatér URL'en, så siden henter nye kort
  function hentNyeForslag(nyAlder, nytKoen) {
    router.push(`/eventgenerator?alder=${nyAlder}&koen=${nytKoen}`, { scroll: false });
  }

  // Kører, når man slipper skyderen (mus/finger) eller slipper en piletast
  function slipSkyder() {
    if (visAlder === alder) return; // Samme alder som før – intet at hente
    hentNyeForslag(visAlder, koen);
  }

  return (
    <section className={styles.topbar}>
      <div>
        <h1 className={styles.titel}>Populære events</h1>
        {/* Viser det, kortene faktisk er hentet ud fra (URL'en) */}
        <p className={styles.undertitel}>
          {koenNavn(koen)}, {alder} år
        </p>
      </div>

      <div className={styles.valg}>
        <div className={styles.alder}>
          <label htmlFor="topbar-alder">Alder: {visAlder}</label>
          <input
            id="topbar-alder"
            type="range"
            min={1}
            max={100}
            value={visAlder}
            onChange={(e) => setVisAlder(Number(e.target.value))}
            onPointerUp={slipSkyder}
            onKeyUp={slipSkyder}
            className={styles.skyder}
          />
        </div>

        {/* role="group" + aria-label: skærmlæsere siger "Køn, gruppe" */}
        <div className={styles.segment} role="group" aria-label="Køn">
          {koenValg.map((k) => (
            <button
              key={k.vaerdi}
              type="button"
              aria-pressed={koen === k.vaerdi}
              onClick={() => hentNyeForslag(alder, k.vaerdi)}
              className={`${styles.segmentKnap} ${koen === k.vaerdi ? styles.valgt : ""}`}
            >
              {k.kort}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
