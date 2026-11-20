

"use client"; // Skal køre i browseren, fordi den husker valg og reagerer på klik

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./GeneratorFormular.module.css";

export default function GeneratorFormular() {
  const router = useRouter();

  // Det brugeren har valgt. Køn starter som null = intet valgt
  const [alder, setAlder] = useState(23);
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
      <h1 className={styles.titel}>Hvem er eventet til?</h1>
      <p>Få idéer til oplevelser, selvom du ikke ved, hvad du leder efter.</p>

      <label htmlFor="alder">Alder: {alder} år</label>
      <input
        id="alder"
        type="range"
        min={1}
        max={100}
        value={alder}
        onChange={(e) => setAlder(Number(e.target.value))}
        className={styles.skyder}
      />

      <p>Køn</p>
      <div className={styles.knapper}>
        <button
          type="button"
          onClick={() => vaelgKoen("kvinde")}
          className={`${styles.pille} ${koen === "kvinde" ? styles.valgt : ""}`}
        >
          Kvinde / Pige
        </button>
        <button
          type="button"
          onClick={() => vaelgKoen("mand")}
          className={`${styles.pille} ${koen === "mand" ? styles.valgt : ""}`}
        >
          Mand / Dreng
        </button>
        <button
          type="button"
          onClick={() => vaelgKoen("alle")}
          className={`${styles.pille} ${koen === "alle" ? styles.valgt : ""}`}
        >
          Alle
        </button>
      </div>

      {/* Vises kun, når visFejl er true */}
      {visFejl && (
        <div className={styles.fejl} role="alert">
          <strong>Du mangler at vælge, hvem eventet er til</strong>
          <p>Vælg Kvinde / Pige, Mand / Dreng eller Alle.</p>
        </div>
      )}

      <p>
        Du kan også filtrere efter kategori, pris, dato og placering bagefter
      </p>

      {/* Grå, indtil der er valgt køn */}
      <button
        type="submit"
        className={`${styles.knap} ${!koen ? styles.inaktiv : ""}`}
      >
        Vis forslag
      </button>
    </form>
  );
}
