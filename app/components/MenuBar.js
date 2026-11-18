"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./MenuBar.module.css";

/* ==============================
   DATA – menupunkterne
   ============================== */

// Fold-ud-punkterne – hvert punkt har sine egne underpunkter
const foldUdPunkter = [
  {
    navn: "Mine billetter",
    ikon: "/assets/icons/mine-billetter.svg",
    underpunkter: [
      "Kommende arrangementer",
      "Tidligere arrangementer",
      "Medlemsskaber",
    ],
  },
  {
    navn: "Min profil",
    ikon: "/assets/icons/min-profil.svg",
    underpunkter: [
      "Redigér kontaktinformation",
      "Log på og sikkerhed",
      "Information om sælger",
      "Tjek gavekort saldo",
    ],
  },
  {
    navn: "Mine indstillinger",
    ikon: "/assets/icons/indstillinger.svg",
    underpunkter: ["Nyhedsbreve"],
  },
];

// De almindelige punkter nederst
const ekstraPunkter = [
  { navn: "Log ud", ikon: "/assets/icons/log-ud.svg" },
  { navn: "Spørgsmål?", ikon: "/assets/icons/spoergsmaal.svg" },
];

export default function MenuBar({ startAaben }) {
  // Navnet på det punkt, der er foldet ud (null = intet er åbent)
  const [aaben, setAaben] = useState(startAaben);

  // Klikker man på det åbne punkt, lukkes det – ellers åbnes det nye
  function skiftPunkt(navn) {
    setAaben(aaben === navn ? null : navn);
  }

  return (
    <nav className={styles.menu} aria-label="Profilmenu">
      <ul className={styles.foldUd}>
        {foldUdPunkter.map((punkt) => {
          const erAaben = aaben === punkt.navn; // Er DETTE punkt det åbne?

          return (
            <li key={punkt.navn}>
              <button
                type="button"
                className={styles.foldUdKnap}
                onClick={() => skiftPunkt(punkt.navn)}
                aria-expanded={erAaben}
              >
                <span className={styles.ikonTekst}>
                  <Image src={punkt.ikon} alt="" width={32} height={32} />
                  {punkt.navn}
                </span>
                <Image
                  src="/assets/icons/pil-ned.svg"
                  alt=""
                  width={32}
                  height={32}
                  className={`${styles.pil} ${erAaben ? styles.pilOp : ""}`}
                />
              </button>

              {/* Underpunkterne vises kun, når punktet er åbent */}
              {erAaben && (
                <ul className={styles.underpunkter}>
                  {punkt.underpunkter.map((underpunkt) => (
                    <li key={underpunkt}>{underpunkt}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <ul className={styles.ekstra}>
        {ekstraPunkter.map((punkt) => (
          <li key={punkt.navn}>
            <button type="button" className={styles.ekstraKnap}>
              <Image src={punkt.ikon} alt="" width={32} height={32} />
              {punkt.navn}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
