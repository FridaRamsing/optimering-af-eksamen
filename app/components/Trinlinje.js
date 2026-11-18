"use client"; // Timeren ændrer sig hvert sekund, så komponenten skal køre i browseren

import { useState, useEffect } from "react";
import styles from "./Trinlinje.module.css";

// De 4 trin i købsflowet – rækkefølgen bestemmer nummeret
const trin = ["Billetter", "Login/opret bruger", "Betaling", "Bekræftelse"];

// aktivtTrin: hvilket trin brugeren er på (1-4). Fx 3 på betalingssiden.
export default function Trinlinje({ aktivtTrin }) {
  // Antal sekunder tilbage – starter på 15 minutter
  const [sekunder, setSekunder] = useState(15 * 60);

  // Trækker 1 sekund fra hvert sekund, indtil vi når 0.
  // useEffect med [] kører kun én gang, når komponenten vises første gang.
  // setSekunder((s) => ...) bruger den nyeste værdi, så timeren ikke går i stå.
  useEffect(() => {
    const interval = setInterval(() => {
      setSekunder((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    // Oprydning: stopper timeren, når man forlader siden
    return () => clearInterval(interval);
  }, []);

  // Laver sekunderne om til minutter:sekunder, fx 899 → 14:59
  const minutter = Math.floor(sekunder / 60); // hele minutter (rundes ned)
  const rest = String(sekunder % 60).padStart(2, "0"); // resten; "9" bliver til "09"

  return (
    <div className={styles.bar}>
      {/* <ol> = nummereret liste, fordi trinnene kommer i en bestemt rækkefølge */}
      <ol className={styles.trin}>
        {trin.map((navn, i) => {
          const nr = i + 1; // i starter på 0, men trinnene hedder 1-4
          // Vælger udseende ud fra, om trinnet er færdigt, aktivt eller ikke nået endnu
          let status = styles.kommende;
          if (nr < aktivtTrin) status = styles.faerdig;
          if (nr === aktivtTrin) status = styles.aktiv;

          return (
            <li key={navn} className={`${styles.punkt} ${status}`}>
              {/* Stregen før trinnet – farven styres af status-klassen i CSS */}
              <span className={styles.streg} />
              {/* Færdige trin viser ✓, ellers vises nummeret */}
              <span className={styles.cirkel}>{nr < aktivtTrin ? "✓" : nr}</span>
              <span className={styles.navn}>{navn}</span>
            </li>
          );
        })}
      </ol>

      {/* Nedtællingen. aria-live="off" sørger for, at skærmlæsere ikke læser
          det nye tal op hvert eneste sekund */}
      <p className={styles.timer} aria-live="off">
        {minutter}:{rest}
      </p>
    </div>
  );
}
