"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Sender brugeren til login efter log ud
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
    // Et almindeligt link (ingen underpunkter) – går til favoritsiden
    navn: "Mine favoritter",
    ikon: "/assets/icons/favorite.svg",
    link: "/favoritter",
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
  const router = useRouter();

  // Logger brugeren ud af Supabase og sender dem til login/opret-siden.
  // replace (i stedet for push): tilbage-knappen fører ikke tilbage til profilen.
  // Bruger-ikonet i headeren skifter selv tilbage til login (den lytter efter log ud).
  async function logUd() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // Klikker man på det åbne punkt, lukkes det – ellers åbnes det nye
  function skiftPunkt(navn) {
    setAaben(aaben === navn ? null : navn);
  }

  return (
    <nav className={styles.menu} aria-label="Profilmenu">
      <ul className={styles.foldUd}>
        {foldUdPunkter.map((punkt) => {
          // Punkter med "link" er almindelige links uden pil og underpunkter
          if (punkt.link) {
            return (
              <li key={punkt.navn}>
                <Link href={punkt.link} className={styles.foldUdKnap}>
                  <span className={styles.ikonTekst}>
                    <Image src={punkt.ikon} alt="" width={32} height={32} />
                    {punkt.navn}
                  </span>
                </Link>
              </li>
            );
          }

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
            {/* Kun "Log ud" gør noget indtil videre – "Spørgsmål?" har ingen funktion endnu */}
            <button
              type="button"
              className={styles.ekstraKnap}
              onClick={punkt.navn === "Log ud" ? logUd : undefined}
            >
              <Image src={punkt.ikon} alt="" width={32} height={32} />
              {punkt.navn}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
