"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DatoVaelger.module.css";

// "2026-12-15T19:30:00" → "15. december"
function dag(dato) {
  return new Date(dato.starts_at).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
  });
}

// "2026-12-15T19:30:00" → "19:30" (dansk format giver "19.30")
function tid(dato) {
  return new Date(dato.starts_at)
    .toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })
    .replace(".", ":");
}

export default function DatoVaelger({ eventId, datoer }) {
  const router = useRouter();
  // Første dato, der ikke er udsolgt, er valgt fra start
  const [valgtId, setValgtId] = useState(
    () => datoer.find((dato) => !dato.udsolgt)?.id ?? null,
  );
  const [visFejl, setVisFejl] = useState(false);

  function vaelg(id) {
    setValgtId(id);
    setVisFejl(false); // Fejlen forsvinder, så snart man vælger
  }

  // Uden valgt dato vises en fejl. Ellers går man videre til pladsvalget
  function koeb() {
    if (!valgtId) {
      setVisFejl(true);
      return;
    }
    router.push(`/pladser?event=${eventId}&dato=${valgtId}`);
  }

  return (
    <div>
      {visFejl && (
        <div className={styles.fejl} role="alert">
          <strong>Du mangler at vælge en dato</strong>
          <p>Vælg den dato, du vil købe billetter til, i listen herunder.</p>
        </div>
      )}

      <fieldset className={styles.liste}>
        <legend className={styles.skjult}>Vælg en dato</legend>

        {/* Én række pr. dato. Udsolgte datoer kan ikke vælges */}
        {datoer.map((dato) => (
          <label
            key={dato.id}
            className={`${styles.raekke} ${valgtId === dato.id ? styles.valgt : ""} ${
              dato.udsolgt ? styles.udsolgt : ""
            }`}
          >
            <input
              type="radio"
              // Unikt navn, så radioknapper fra et tidligere besøgt event ikke påvirker dette
              name={`dato-${eventId}`}
              className={styles.radio}
              checked={valgtId === dato.id}
              disabled={dato.udsolgt}
              onChange={() => vaelg(dato.id)}
            />
            <span className={styles.dag}>{dag(dato)}</span>
            <span>{tid(dato)}</span>

            {/* Udsolgt: venteliste i stedet for pris */}
            {dato.udsolgt ? (
              <>
                <span className={styles.udsolgtTekst}>Udsolgt</span>
                <button type="button" className={styles.venteliste}>
                  Venteliste →
                </button>
              </>
            ) : (
              <span className={styles.pris}>{dato.pris.toLocaleString("da-DK")} DKK</span>
            )}
          </label>
        ))}
      </fieldset>

      <div className={styles.knapRaekke}>
        {/* aria-disabled i stedet for disabled, så klikket kan vise fejlbeskeden */}
        <button
          type="button"
          onClick={koeb}
          aria-disabled={!valgtId}
          className={`${styles.koebKnap} ${!valgtId ? styles.inaktiv : ""}`}
        >
          {valgtId ? "Køb billetter →" : "Vælg en dato først"}
        </button>
      </div>
    </div>
  );
}
