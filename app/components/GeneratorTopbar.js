"use client"; /* skyderne og knapperne skal reagere på brugeren*/

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AlderSkyder from "./AlderSkyder";
import { koenValg, koenNavn } from "@/lib/maalgruppe";
import { lavUrl } from "@/lib/filterUrl";
import styles from "./GeneratorTopbar.module.css";

// Alder og køn. Egen komponent, fordi de vises i både den store og den lille topbar
function TopbarValg({ id, visAlder, setVisAlder, slipSkyder, koen, vaelgKoen }) {
  return (
    <div className={styles.valg}>
      <div className={styles.alder}>
        <label htmlFor={id}>Alder: {visAlder}</label>
        <div className={styles.skyderBoks}>
          <AlderSkyder id={id} vaerdi={visAlder} onChange={setVisAlder} onSlip={slipSkyder} />
        </div>
      </div>

      {/* role="group" + aria-label: skærmlæsere siger "Køn, gruppe" */}
      <div className={styles.segment} role="group" aria-label="Køn">
        {koenValg.map((k) => (
          <button
            key={k.vaerdi}
            type="button"
            aria-pressed={koen === k.vaerdi}
            onClick={() => vaelgKoen(k.vaerdi)}
            className={`${styles.segmentKnap} ${koen === k.vaerdi ? styles.valgt : ""}`}
          >
            {k.kort}
          </button>
        ))}
      </div>
    </div>
  );
}

// alder, koen og filtre kommer fra URL'en (via page.js). maerker er de blå filter-mærker
export default function GeneratorTopbar({ alder, koen, filtre, maerker }) {
  const router = useRouter();
  const topbarRef = useRef(null);

  // Alderen på skyderen. Ændres med det samme, mens man trækker
  const [visAlder, setVisAlder] = useState(alder);
  const [forrigeAlder, setForrigeAlder] = useState(alder);
  const [erLille, setErLille] = useState(false);

  // Skifter alderen i URL'en (fx med tilbage-knappen), skal skyderen følge med
  if (alder !== forrigeAlder) {
    setForrigeAlder(alder);
    setVisAlder(alder);
  }

  // Vis den lille topbar, når den store er scrollet op over skærmen
  useEffect(() => {
    const observer = new IntersectionObserver(([element]) => {
      setErLille(!element.isIntersecting && element.boundingClientRect.top < 0);
    });
    observer.observe(topbarRef.current);
    return () => observer.disconnect(); // Oprydning, når komponenten forsvinder
  }, []);

  // ...filtre beholder kategori, pris, dato, by og sortering, når alder eller køn skifter
  function hentNyeForslag(nyAlder, nytKoen) {
    router.push(lavUrl("/eventgenerator", { ...filtre, alder: nyAlder, koen: nytKoen }), {
      scroll: false,
    });
  }

  // Kører, når man slipper skyderen (mus/finger) eller slipper en piletast
  function slipSkyder() {
    if (visAlder === alder) return; // Samme alder som før – intet at hente
    hentNyeForslag(visAlder, koen);
  }

  const valgProps = {
    visAlder,
    setVisAlder,
    slipSkyder,
    koen,
    vaelgKoen: (nytKoen) => hentNyeForslag(alder, nytKoen),
  };

  return (
    <>
      {/* inert: den store bar kan ikke få tastaturfokus, mens den er scrollet væk */}
      <section ref={topbarRef} className={styles.topbar} inert={erLille}>
        <div className={styles.tekster}>
          <h1 className={styles.titel}>Populære events</h1>
          {/* Viser det, kortene faktisk er hentet ud fra (URL'en) */}
          <p className={styles.undertitel}>
            {koenNavn(koen)}, {alder} år
          </p>
        </div>
        <TopbarValg id="topbar-alder" {...valgProps} />
      </section>

      {erLille && (
        <section className={styles.lille} aria-label="Dine valg">
          <div className={styles.venstre}>
            <p className={styles.lilleTitel}>Populære events</p>
            <div className={styles.lilleMaerker}>{maerker}</div>
          </div>
          <TopbarValg id="lille-topbar-alder" {...valgProps} />
        </section>
      )}
    </>
  );
}
