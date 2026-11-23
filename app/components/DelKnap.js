"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./DelKnap.module.css";

// Knap, der deler linket til det event, man står på
export default function DelKnap({ titel, className }) {
  const [kopieret, setKopieret] = useState(false);

  async function del() {
    const url = window.location.href;

    // Telefoner åbner deres egen del-menu – andre browsere kopierer linket i stedet
    if (navigator.share) {
      try {
        await navigator.share({ title: titel, url });
      } catch {
        // Brugeren lukkede del-menuen – det er ikke en fejl
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    // Viser "Link kopieret" i 2 sekunder
    setKopieret(true);
    setTimeout(() => setKopieret(false), 2000);
  }

  return (
    <button
      type="button"
      className={`${styles.knap} ${className ?? ""}`}
      onClick={del}
      aria-label={`Del ${titel}`}
    >
      <Image src="/assets/icons/del.svg" alt="" width={24} height={24} />
      {kopieret && (
        <span className={styles.besked} role="status">
          Link kopieret
        </span>
      )}
    </button>
  );
}
