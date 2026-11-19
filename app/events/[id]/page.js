

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import EventHero from "@/app/components/EventHero";
import EventInfoBar from "@/app/components/EventInfoBar";
import SektionOverskrift from "@/app/components/SektionOverskrift";
import DatoVaelger from "@/app/components/DatoVaelger";
import styles from "./page.module.css";
import EventInfoPanel from "@/app/components/EventInfoPanel";
import Spillested from "@/app/components/Spillested";
import EventCard from "@/app/components/EventCard";

// Samme felter som forsiden bruger til EventCard
const kortFelter =
  "id, titel, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer";

// "2026-12-14T19:30:00" → "14. dec."
function kortDato(dato) {
  return new Date(dato.starts_at).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
}

// Andre events – samme kategori vises først
async function AndreEvents({ event }) {
  const { data, error } = await supabase
    .from("event")
    .select(kortFelter)
    .neq("id", event.id)
    .limit(12);

  if (error || data.length === 0) return null;

  const andre = data
    .sort((a, b) => (b.kategori === event.kategori) - (a.kategori === event.kategori))
    .slice(0, 4);

  return (
    <section aria-labelledby="andre-events" className={styles.andre}>
      <SektionOverskrift id="andre-events">Fans har også kigget på</SektionOverskrift>
      <ul className={styles.kortListe}>
        {andre.map((andet) => (
          <li key={andet.id}>
            <EventCard event={andet} />
          </li>
        ))}
      </ul>
    </section>
  );
}

async function EventIndhold({ params }) {
  const { id } = await params;

  const { data: event, error } = await supabase
    .from("event")
    .select("*, event_dato(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return <p>Noget gik galt. Prøv igen senere.</p>;
  }

  if (!event) {
    notFound();
  }

  const datoer = [...event.event_dato].sort(
    (a, b) => new Date(a.starts_at) - new Date(b.starts_at),
  );

  const foerste = datoer[0];
  const sidste = datoer[datoer.length - 1];
  const aar = new Date(sidste.starts_at).getFullYear();

  // Én dato: "19. dec. 2026" – flere: "14. dec. – 20. dec. 2026"
  const datoTekst =
    datoer.length === 1
      ? `${kortDato(foerste)} ${aar}`
      : `${kortDato(foerste)} – ${kortDato(sidste)} ${aar}`;

  return (
    <>
      <EventHero event={event} datoTekst={datoTekst} />
      <EventInfoBar event={event} foersteDato={foerste} />

      <div className={styles.kolonner}>
        <div>
          <section aria-labelledby="om-eventet">
            <SektionOverskrift id="om-eventet">Om eventet</SektionOverskrift>
            <p className={styles.tekst}>{event.beskrivelse}</p>
            <EventInfoPanel event={event} datoTekst={datoTekst} />
          </section>

          <section aria-labelledby="spillested" className={styles.spillested}>
            <SektionOverskrift id="spillested">Spillested</SektionOverskrift>
            <Spillested event={event} />
          </section>
        </div>

        <section id="datoer" aria-labelledby="datoer-titel">
          <SektionOverskrift id="datoer-titel">Datoer</SektionOverskrift>
          <DatoVaelger eventId={event.id} datoer={datoer} />
        </section>
      </div>

      <AndreEvents event={event} />
    </>
  );
}

export default function EventPage({ params }) {
  return (
    <main>
      <Suspense fallback={<p>Indlæser event...</p>}>
        <EventIndhold params={params} />
      </Suspense>
    </main>
  );
}
