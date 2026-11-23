"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useHent } from "@/lib/useHent";
import { supabase } from "@/lib/supabase"; // Forbindelsen til databasen
import StjerneBaggrund from "@/app/components/StjerneBaggrund"; // Blinkende stjerner bag salen
import PladsVaelger from "@/app/components/PladsVaelger"; // Salsplanen, pladserne og "Dit valg"
import { lavInfo } from "@/lib/lavInfo"; // "Tir 15. dec 2026 · 19:30 · Spillested, By"
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js.

// "2027-01-15T17:30:00" → "15. jan 2027"
function kortDato(starts_at) {
  return new Date(starts_at)
    .toLocaleDateString("da-DK", {
      timeZone: "Europe/Copenhagen", // dansk tid, ellers kan serveren vise UTC
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "") // fjerner alle punktummer: "15. jan. 2027" → "15 jan 2027"
    .replace(/^(\d+)/, "$1."); // sætter punktum efter dagen igen: "15. jan 2027"
}

/* ==============================
   INDHOLDET – læser URL'en og henter data, derfor inde i <Suspense>
   URL'en kommer fra datovælgeren på eventsiden, fx:
   /pladser?event=8&dato=1
   - event: id i tabellen "event"
   - dato:  id i tabellen "event_dato" (den dato, man har valgt)
   ============================== */
function PladserIndhold() {
  const { event: eventId, dato: datoId } = Object.fromEntries(useSearchParams());

  // Henter eventet OG dets datoer i ét kald.
  // "event_dato(...)" virker, fordi event_dato.event_id peger på event.id
  const svar = useHent(
    () =>
      eventId
        ? supabase
            .from("event")
            .select("id, titel, spillested, by, starts_at, pris_fra, event_dato(id, starts_at, pris, udsolgt)")
            .eq("id", eventId)
            .maybeSingle() // giver null i stedet for en fejl, hvis id'et ikke findes
        : { data: null },
    eventId,
  );

  // Intet event i URL'en → tilbage til forsiden
  if (!eventId) {
    return (
      <p className={styles.besked}>
        Du har ikke valgt et event. <Link href="/">Find et event</Link>
      </p>
    );
  }

  if (!svar) return <p className={styles.besked}>Henter salen...</p>;
  const { data: event, error } = svar;

  if (error || !event) {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  // Den valgte dato – eller eventets egen dato, hvis der ikke er valgt nogen.
  // Number(), fordi alt i URL'en er tekst ("1"), men id'et i databasen er et tal (1)
  const valgtDato = event.event_dato.find((d) => d.id === Number(datoId));
  const starts_at = valgtDato?.starts_at ?? event.starts_at;
  const pris = valgtDato?.pris ?? event.pris_fra; // prisen kan være forskellig fra dato til dato

  return (
    <>
      {/* "ANNE LINNET · 15. JAN 2027 · SCT. CATHARINÆ KIRKE" – store bogstaver laves i CSS */}
      <h1 className={styles.titel}>
        {event.titel} · {kortDato(starts_at)} · {event.spillested}
      </h1>
      <p className={styles.undertekst}>
        Vælg et område på salsplanen for at se og vælge pladser
      </p>

      {/* Alt det, man kan klikke på, ligger i en client-komponent (useState) */}
      {/* titel og info bruges på billetterne i "Dit valg".
          lavInfo får den valgte dato (starts_at) i stedet for eventets egen */}
      <PladsVaelger
        eventId={event.id}
        datoId={valgtDato?.id}
        pris={pris}
        titel={event.titel}
        info={lavInfo({ ...event, starts_at })}
      />
    </>
  );
}

/* ==============================
   SIDEN
   ============================== */
export default function PladserPage() {
  return (
    <main className={styles.side}>
      {/* Stjernehimlen bag salsplanen (z-index: -1) */}
      <StjerneBaggrund />

      <div className={styles.indhold}>
        {/* useSearchParams kræver Suspense ved statisk build */}
        <Suspense fallback={<p className={styles.besked}>Henter salen...</p>}>
          <PladserIndhold />
        </Suspense>
      </div>
    </main>
  );
}
