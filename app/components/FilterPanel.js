// Kører i browseren, fordi panelet skal åbne/lukke og huske brugerens valg
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { genreNavn } from "@/lib/genre";
import { filterUrl } from "@/lib/filterUrl";
import PrisSkyder, { PRIS_MAX } from "./PrisSkyder";
import styles from "./FilterPanel.module.css";

// "300-600" → [300, 600]. Mangler en grænse, bruges 0 eller PRIS_MAX
function lavPrisSpaend(pris) {
  if (!pris) return [0, PRIS_MAX];
  const [min, max] = pris.split("-").map((tal) => parseInt(tal));
  return [min >= 0 ? min : 0, max >= 0 ? max : PRIS_MAX];
}

// "Filtrer"-knappen og panelet, der folder ud under den
export default function FilterPanel({ kategori, filtre, genrer, byer, antalAktive }) {
  const router = useRouter();
  const [erAaben, setErAaben] = useState(false);

  // Kladde: brugerens valg i panelet. Bruges først, når man klikker "Vis resultater"
  const [genre, setGenre] = useState("");
  const [prisSpaend, setPrisSpaend] = useState([0, PRIS_MAX]);
  const [dato, setDato] = useState("");
  const [by, setBy] = useState("");

  const wrapperRef = useRef(null);
  const knapRef = useRef(null);
  const panelRef = useRef(null);

  // Ved åbning starter kladden med de filtre, der allerede står i URL'en
  function aaben() {
    setGenre(filtre.genre ?? "");
    setPrisSpaend(lavPrisSpaend(filtre.pris));
    setDato(filtre.dato ?? "");
    setBy(filtre.by ?? "");
    setErAaben(true);
  }

  // Lukker og sender fokus tilbage til knappen (vigtigt for tastaturbrugere)
  function luk() {
    setErAaben(false);
    knapRef.current?.focus({ preventScroll: true });
  }

  // Når panelet er åbent: flyt fokus ind i det, og luk ved Escape eller klik udenfor
  useEffect(() => {
    if (!erAaben) return;

    // preventScroll: browseren må ikke scrolle siden, når fokus flyttes
    panelRef.current?.focus({ preventScroll: true });

    function vedTast(e) {
      if (e.key === "Escape") {
        setErAaben(false);
        knapRef.current?.focus({ preventScroll: true });
      }
    }
    function vedKlik(e) {
      if (!wrapperRef.current?.contains(e.target)) setErAaben(false);
    }

    document.addEventListener("keydown", vedTast);
    document.addEventListener("mousedown", vedKlik);
    // Oprydning: fjern lytterne igen, når panelet lukker
    return () => {
      document.removeEventListener("keydown", vedTast);
      document.removeEventListener("mousedown", vedKlik);
    };
  }, [erAaben]);

  function nulstil() {
    setGenre("");
    setPrisSpaend([0, PRIS_MAX]);
    setDato("");
    setBy("");
  }

  // Lægger alle valg i URL'en på én gang. Siden henter så de filtrerede events
  function visResultater() {
    const [min, max] = prisSpaend;
    // Intet prisfilter, hvis hele spændet er valgt. "2.000+" giver "300-" (ingen øvre grænse)
    const pris =
      min > 0 || max < PRIS_MAX ? `${min}-${max < PRIS_MAX ? max : ""}` : undefined;

    router.push(filterUrl(kategori, { genre, pris, dato, by }), { scroll: false });
    setErAaben(false);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        ref={knapRef}
        type="button"
        className={`${styles.filtrer} ${antalAktive > 0 || erAaben ? styles.aktiv : ""}`}
        onClick={erAaben ? luk : aaben}
        aria-expanded={erAaben}
        aria-controls="filter-panel"
      >
        <Image src="/assets/icons/filter.svg" alt="" width={24} height={24} />
        Filtrer
        {antalAktive > 0 && <span className={styles.antal}>{antalAktive}</span>}
      </button>

      {erAaben && (
        <div
          id="filter-panel"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-labelledby="filter-titel"
          tabIndex={-1}
        >
          <div className={styles.top}>
            <h2 id="filter-titel" className={styles.titel}>Filtrér</h2>
            <button type="button" className={styles.luk} onClick={luk} aria-label="Luk filtre">
              <Image src="/assets/icons/luk.svg" alt="" width={20} height={20} />
            </button>
          </div>

          {/* ===== Kategori (genrer) ===== */}
          <div className={styles.sektion} role="group" aria-labelledby="filter-kategori">
            <p id="filter-kategori" className={styles.label}>Kategori</p>
            <div className={styles.genrer}>
              <button
                type="button"
                className={`${styles.genre} ${!genre ? styles.valgt : ""}`}
                aria-pressed={!genre}
                onClick={() => setGenre("")}
              >
                Alle
              </button>
              {genrer.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`${styles.genre} ${genre === g ? styles.valgt : ""}`}
                  aria-pressed={genre === g}
                  onClick={() => setGenre(g)}
                >
                  {genreNavn(g)}
                </button>
              ))}
            </div>
          </div>

          <hr className={styles.streg} />

          {/* ===== Pris ===== */}
          <PrisSkyder vaerdi={prisSpaend} onChange={setPrisSpaend} />

          <hr className={styles.streg} />

          {/* ===== Dato (fra og med) ===== */}
          <div className={styles.sektion}>
            <label htmlFor="filter-dato" className={styles.label}>Dato</label>
            <input
              id="filter-dato"
              type="date"
              className={styles.felt}
              value={dato}
              onChange={(e) => setDato(e.target.value)}
            />
          </div>

          {/* ===== Byer ===== */}
          <div className={styles.sektion}>
            <label htmlFor="filter-by" className={styles.label}>Byer</label>
            <div className={styles.selectBoks}>
              <select
                id="filter-by"
                className={`${styles.felt} ${styles.select}`}
                value={by}
                onChange={(e) => setBy(e.target.value)}
              >
                <option value="">Alle byer</option>
                {byer.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {/* Pilen fra Figma peger op, så den drejes 180° i CSS */}
              <Image src="/assets/icons/pil-op.svg" alt="" width={32} height={32} className={styles.pil} />
            </div>
          </div>

          <div className={styles.bund}>
            <button type="button" className={styles.nulstil} onClick={nulstil}>
              Nulstil
            </button>
            <button type="button" className={styles.vis} onClick={visResultater}>
              Vis resultater
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
