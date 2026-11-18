"use client";

import styles from "./PrisSkyder.module.css";

// Prisspændet i skyderen. Står "til" helt i bund, betyder det "2.000+" (ingen øvre grænse)
export const PRIS_MAX = 2000;
const TRIN = 50;

// 1500 → "1.500"
function kr(tal) {
  return tal.toLocaleString("da-DK");
}

// Skyder med to håndtag. vaerdi = [min, max]. onChange får et nyt [min, max]
export default function PrisSkyder({ vaerdi, onChange }) {
  const [min, max] = vaerdi;
  const alle = min === 0 && max === PRIS_MAX;
  const tilTekst = max === PRIS_MAX ? `${kr(PRIS_MAX)}+ kr.` : `${kr(max)} kr.`;

  return (
    <div className={styles.skyder} role="group" aria-labelledby="pris-label">
      <div className={styles.top}>
        <p id="pris-label" className={styles.label}>Pris</p>
        <p className={styles.status}>
          {alle ? "Alle priser" : `${kr(min)} - ${tilTekst}`}
        </p>
      </div>

      {/* To range-inputs oven i hinanden. Den blå streg viser det valgte spænd */}
      <div className={styles.spor}>
        <div
          className={styles.valgt}
          style={{
            left: `calc(11px + (100% - 22px) * ${min / PRIS_MAX})`,
            width: `calc((100% - 22px) * ${(max - min) / PRIS_MAX})`,
          }}
        />
        <input
          type="range"
          min={0}
          max={PRIS_MAX}
          step={TRIN}
          value={min}
          // "Fra" må ikke komme forbi "til"
          onChange={(e) => onChange([Math.min(Number(e.target.value), max - TRIN), max])}
          aria-label="Pris fra"
          aria-valuetext={`${kr(min)} kr.`}
          className={styles.range}
        />
        <input
          type="range"
          min={0}
          max={PRIS_MAX}
          step={TRIN}
          value={max}
          onChange={(e) => onChange([min, Math.max(Number(e.target.value), min + TRIN)])}
          aria-label="Pris til"
          aria-valuetext={tilTekst}
          className={styles.range}
        />
      </div>

      <div className={styles.felter}>
        <div className={styles.felt}>
          <span className={styles.feltLabel}>Fra</span>
          <span className={styles.feltVaerdi}>{kr(min)} kr.</span>
        </div>
        <span className={styles.streg} aria-hidden="true">–</span>
        <div className={styles.felt}>
          <span className={styles.feltLabel}>Til</span>
          <span className={styles.feltVaerdi}>{tilTekst}</span>
        </div>
      </div>
    </div>
  );
}
