"use client"; // Skal køre i browseren, fordi den husker valg og reagerer på klik

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlderSkyder from "./AlderSkyder";
import { koenValg, ALDER_START } from "@/lib/maalgruppe";
import styles from "./GeneratorFormular.module.css";

export default function GeneratorFormular() {
  const router = useRouter();

  // Det brugeren har valgt. Køn starter som null = intet valgt
  const [alder, setAlder] = useState(ALDER_START);
  const [koen, setKoen] = useState(null);
  const [visFejl, setVisFejl] = useState(false);

  function vaelgKoen(vaerdi) {
    setKoen(vaerdi);
    setVisFejl(false); // Fejlen forsvinder, når man vælger
  }

  // Kører, når man trykker "Vis forslag"
  function send(e) {
    e.preventDefault(); // Stopper browseren i at genindlæse siden

    if (!koen) {
      setVisFejl(true);
      return; // Stop her – gå ikke videre
    }

    // Læg valgene i URL'en, fx /eventgenerator?alder=23&koen=kvinde
    router.push(`/eventgenerator?alder=${alder}&koen=${koen}`);
  }

  return (
    <form className={styles.kort} onSubmit={send}>
      <div className={styles.intro}>
        <h1 className={styles.titel}>Hvem er eventet til?</h1>
        <p className={styles.tekst}>
          Få idéer til oplevelser, selvom du ikke ved, hvad du leder efter.
        </p>
      </div>

      <div className={styles.valg}>
        <div className={styles.felt}>
          <label htmlFor="alder" className={styles.label}>Alder: {alder} år</label>
          <AlderSkyder id="alder" vaerdi={alder} onChange={setAlder} />
        </div>

        <div className={styles.felt} role="group" aria-labelledby="koen-label">
          <p id="koen-label" className={styles.label}>Køn</p>

          <div className={styles.knapper}>
            {koenValg.map((k) => (
              <button
                key={k.vaerdi}
                type="button"
                aria-pressed={koen === k.vaerdi}
                onClick={() => vaelgKoen(k.vaerdi)}
                className={`${styles.pille} ${koen === k.vaerdi ? styles.valgt : ""} ${visFejl ? styles.fejlKant : ""}`}
              >
                {k.formular}
              </button>
            ))}
          </div>

          {/* Vises kun, når visFejl er true */}
          {visFejl && (
            <div className={styles.fejl} role="alert">
              <span className={styles.fejlIkon} aria-hidden="true">!</span>
              <div>
                <strong className={styles.fejlTitel}>Du mangler at vælge, hvem eventet er til</strong>
                <p className={styles.fejlTekst}>
                  Vælg Kvinde / Pige eller Mand / Dreng – eller vælg &quot;Alle&quot;.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bund}>
        <p className={styles.tekst}>
          Du kan også filtrere efter kategori, pris, dato og placering bagefter
        </p>

        {/* Knappen er grå uden køn, men kan stadig klikkes, så fejlen kan vises */}
        <button
          type="submit"
          aria-disabled={!koen}
          className={`${styles.knap} ${!koen ? styles.inaktiv : ""}`}
        >
          Vis forslag
        </button>
      </div>
    </form>
  );
}
