"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Soegning() {
  const [soegeord, setSoegeord] = useState("");
  const [kunstnere, setKunstnere] = useState([]);
  const [aaben, setAaben] = useState(false);

  async function hentKunstnere(tekst) {
    if (tekst.trim().length < 2) {
      setKunstnere([]);
      return;
    }

    const { data, error } = await supabase
      .from("event")
      .select("kunstner")
      .not("kunstner", "is", null)
      .ilike("kunstner", `%${tekst}%`);

    if (error) {
      console.error("Kunne ikke hente kunstnere:", error);
      return;
    }

    const unikkeNavne = [
      ...new Set((data ?? []).map((raekke) => raekke.kunstner).filter(Boolean)),
    ];

    setKunstnere(unikkeNavne);
  }

  return (
    <div>
      <button
        type="button"
        className={styles.iconLink}
        aria-label="Åbn søgning"
        aria-expanded={aaben}
        onClick={() => setAaben((aaben) => !aaben)}
      >
        <Image src="/assets/icons/søg.svg" alt="" width={32} height={32} />
      </button>

      {aaben && (
        <div className={styles.searchPanel}>
          <input
            value={soegeord}
            onChange={(event) => {
              const tekst = event.target.value;
              setSoegeord(tekst);
              hentKunstnere(tekst);
            }}
            placeholder="Søg efter en kunstner"
          />

          <section className={styles.artistResults}>
            <h2>
              KUNSTNERE <span>{kunstnere.length}</span>
            </h2>
            <ul>
              {kunstnere.map((kunstner) => (
                <li className={styles.artistCard} key={kunstner}>
                <span className={styles.artistPlaceholder} aria-hidden="true" />
                <span className={styles.artistInfo}>
                    <strong>{kunstner}</strong>
                    <small>Kunstner</small>
                </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}