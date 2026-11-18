"use client"; // Login gemmes i browseren, så likes kan kun hentes her

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import EventCard from "./EventCard";
import styles from "./FavoritListe.module.css";

// De kolonner, EventCard skal bruge
const EVENT_FELTER =
  "id, titel, image_url, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer";

export default function FavoritListe() {
  // "henter" → "ikke-logget-ind" / "fejl" / "klar"
  const [status, setStatus] = useState("henter");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function hentFavoritter() {
      // Er man logget ind?
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setStatus("ikke-logget-ind");
        return;
      }

      // Henter brugerens likes OG det event, hvert like peger på – i ét kald.
      // "event(...)" virker, fordi likes.event_id er en fremmednøgle til event.id.
      // RLS i Supabase sørger for, at man kun får sine egne likes.
      const { data: likes, error } = await supabase
        .from("likes")
        .select(`event(${EVENT_FELTER})`)
        .order("created_at", { ascending: false }); // nyeste like først

      if (error) {
        console.error("Kunne ikke hente favoritter:", error);
        setStatus("fejl");
        return;
      }

      // [{ event: {...} }, ...] → [{...}, ...]  (filter fjerner likes til slettede events)
      setEvents(likes.map((like) => like.event).filter(Boolean));
      setStatus("klar");
    }
    hentFavoritter();
  }, []);

  // Fjerner kortet med det samme, når man klikker hjertet væk
  function fjern(eventId) {
    setEvents((gamle) => gamle.filter((e) => e.id !== eventId));
  }

  if (status === "henter") {
    return <p className={styles.besked}>Henter dine favoritter...</p>;
  }

  if (status === "ikke-logget-ind") {
    return (
      <div className={styles.boks}>
        <h2 className={styles.overskrift}>Log ind for at se dine favoritter</h2>
        <p className={styles.undertekst}>Dine likes gemmes på din profil.</p>
        <Link href="/login" className={styles.knap}>
          Log ind
        </Link>
      </div>
    );
  }

  if (status === "fejl") {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  if (events.length === 0) {
    return (
      <div className={styles.boks}>
        <h2 className={styles.overskrift}>Du har ingen favoritter endnu</h2>
        <p className={styles.undertekst}>
          Tryk på hjertet på et event for at gemme kunstneren her.
        </p>
        <Link href="/" className={styles.knap}>
          Find events
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* "1 favorit" / "3 favoritter" */}
      <p className={styles.antal}>
        {events.length} {events.length === 1 ? "favorit" : "favoritter"}
      </p>

      {/* Samme grid og kort som på kategorisiden */}
      <ul className={styles.grid}>
        {events.map((event) => (
          <li key={event.id}>
            <EventCard event={event} onFjernetFavorit={fjern} />
          </li>
        ))}
      </ul>
    </>
  );
}
