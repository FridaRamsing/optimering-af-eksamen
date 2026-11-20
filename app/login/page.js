import { Suspense } from "react";
import { supabase } from "@/lib/supabase"; // Til at hente eventet i købsflowet
import { DATO_FELTER, laesPladser, medValgtDato, ordreParametre } from "@/lib/ordre"; // Læser ordren fra URL'en
import { lavInfo } from "@/lib/lavInfo"; // "Tir 15. dec 2026 · 19:30 · Spillested, By"
import Trinlinje from "@/app/components/Trinlinje";
import LoginKort from "@/app/components/LoginKort";
import KoebLogin from "@/app/components/KoebLogin"; // Login + "Din ordre" side om side
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js.

/* ==============================
   INDHOLDET – læser URL'en, derfor inde i <Suspense> (cacheComponents)

   Siden bruges på to måder:
   1. Fra bruger-ikonet i headeren: /login
      → kun login-kortet, og man sendes til profilsiden (Mine billetter) bagefter
   2. Midt i et køb: /login?event=8&omraade=Gulv&pladser=E-7,E-8&dato=1
      → trinlinjen + login med "Din ordre" ved siden af,
        og man sendes videre til betalingen med samme ordre
   ============================== */
async function LoginIndhold({ searchParams }) {
  const { event: eventId, omraade = "Gulv", pladser = "", dato: datoId } = await searchParams;

  /* ----- 1. Almindeligt login (ikke midt i et køb) ----- */
  if (!eventId) {
    return (
      <main className={styles.side}>
        <LoginKort videreTil="/mine-billetter" />
      </main>
    );
  }

  /* ----- 2. Midt i et køb ----- */
  // Efter login: videre til betalingen med ordren, så den ikke går tabt
  const videreTil = `/betaling?${ordreParametre({ eventId, omraade, pladser, datoId })}`;

  // Henter eventet og dets datoer, så "Din ordre" kan vise titel, dato og pris
  const { data: event } = await supabase
    .from("event")
    .select(`id, titel, spillested, by, starts_at, pris_fra, ${DATO_FELTER}`)
    .eq("id", eventId)
    .maybeSingle();

  // "E-7,E-8" → [{ raekke: "E", plads: "7" }, { raekke: "E", plads: "8" }]
  const billetter = laesPladser(pladser);

  return (
    <>
      {/* Trinlinjen hører kun til købsflowet – trin 2 = Login/opret bruger */}
      <Trinlinje aktivtTrin={2} />

      <main className={`${styles.side} ${styles.koeb}`}>
        <StjerneBaggrund />

        {event ? (
          // medValgtDato: den dato og pris, man valgte på pladssiden
          <KoebLogin
            titel={event.titel}
            info={lavInfo(medValgtDato(event, datoId))}
            pris={medValgtDato(event, datoId).pris_fra}
            billetter={billetter}
            videreTil={videreTil}
          />
        ) : (
          // Kunne eventet ikke hentes, kan man stadig logge ind og komme videre
          <LoginKort videreTil={videreTil} springOverHvisLoggetInd />
        )}
      </main>
    </>
  );
}

/* ==============================
   SIDEN
   ============================== */
export default function LoginPage({ searchParams }) {
  return (
    <Suspense fallback={<main className={styles.side} />}>
      <LoginIndhold searchParams={searchParams} />
    </Suspense>
  );
}
