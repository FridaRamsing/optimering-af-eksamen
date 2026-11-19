"use client"; // Login gemmes i browseren, så brugerens billetter kan kun hentes her

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BilletKort from "./BilletKort";
import styles from "./MineBilletterListe.module.css";

// De kolonner fra event, BilletKort skal bruge
const EVENT_FELTER = "id, titel, spillested, by, starts_at, pris_fra, image_url, card_image_url";

/* ==============================
   MINE BILLETTER – listen med de billetter, brugeren har købt
   Bygget på samme måde som FavoritListe (likes)
   ============================== */
export default function MineBilletterListe() {
  // "henter" → "ikke-logget-ind" / "fejl" / "klar"
  const [status, setStatus] = useState("henter");
  const [billetter, setBilletter] = useState([]);

  useEffect(() => {
    async function hentBilletter() {
      // Er man logget ind?
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setStatus("ikke-logget-ind");
        return;
      }

      // Henter brugerens billetter OG det event, hver billet hører til – i ét kald.
      // "event(...)" virker, fordi billetter.event_id er en fremmednøgle til event.id.
      // RLS i Supabase sørger for, at man kun får sine egne billetter.
      const { data: raekker, error } = await supabase
        .from("billetter")
        .select(`id, omraade, raekke, plads, pris, event(${EVENT_FELTER})`);

      if (error) {
        console.error("Kunne ikke hente billetter:", error);
        setStatus("fejl");
        return;
      }

      // Kun kommende arrangementer (siden viser "Kommende arrangementer"),
      // sorteret så det næste arrangement kommer først
      const nu = new Date();
      const kommende = raekker
        .filter((b) => b.event && new Date(b.event.starts_at) >= nu) // fjerner også billetter til slettede events
        .sort((a, b) => new Date(a.event.starts_at) - new Date(b.event.starts_at));

      setBilletter(kommende);
      setStatus("klar");
    }
    hentBilletter();
  }, []);

  if (status === "henter") {
    return <p className={styles.besked}>Henter dine billetter...</p>;
  }

  if (status === "ikke-logget-ind") {
    return (
      <div className={styles.boks}>
        <h3 className={styles.overskrift}>Log ind for at se dine billetter</h3>
        <p className={styles.undertekst}>Dine billetter gemmes på din profil, når du køber dem.</p>
        <Link href="/login" className={styles.knap}>
          Log ind
        </Link>
      </div>
    );
  }

  if (status === "fejl") {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  if (billetter.length === 0) {
    return (
      <div className={styles.boks}>
        <h3 className={styles.overskrift}>Du har ingen kommende arrangementer</h3>
        <p className={styles.undertekst}>Når du køber billetter, kan du finde dem her.</p>
        <Link href="/" className={styles.knap}>
          Find events
        </Link>
      </div>
    );
  }

  return (
    // <ul>: billetterne er en liste – skærmlæsere siger, hvor mange der er
    <ul className={styles.liste}>
      {billetter.map((b) => (
        <li key={b.id}>
          {/* h3, fordi billetterne ligger under <h2>Næste arrangement</h2> */}
          <BilletKort event={b.event} billet={b} overskrift="h3" />
        </li>
      ))}
    </ul>
  );
}
