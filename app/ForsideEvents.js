"use client";
import { supabase } from "@/lib/supabase";
import { useHent } from "@/lib/useHent";
import EventCard from "@/app/components/EventCard";
import styles from "./page.module.css";

// Felterne EventCard skal bruge
const kortFelter =
  "id, titel, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer";

// Fælles visning: pladsholder under hentning, fejlbesked eller eventkort
function EventRaekke({ svar }) {
  if (!svar) return <div className={styles.pladsholder} />;

  if (svar.error) {
    return <p className={styles.fejl}>Vi kunne ikke hente events lige nu.</p>;
  }

  return (
    <ul className={styles.raekke}>
      {svar.data.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}

// Ingen popularitet i tabellen → events med flest ekstra datoer regnes som populære
export function PopulaereEvents() {
  const svar = useHent(
    () =>
      supabase
        .from("event")
        .select(kortFelter)
        .order("ekstra_datoer", { ascending: false })
        .limit(8),
    "populaere",
  );

  return <EventRaekke svar={svar} />;
}

export function KommendeEvents() {
  // Hentes i browseren, så "nu" er tidspunktet for besøget – ikke for build
  const svar = useHent(
    () =>
      supabase
        .from("event")
        .select(kortFelter)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(8),
    "kommende",
  );

  return <EventRaekke svar={svar} />;
}
