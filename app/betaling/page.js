"use client";
import { Suspense } from "react"; // Viser "Indlæser..." mens data hentes
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useHent } from "@/lib/useHent";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Forbindelsen til databasen (bruger .env.local)
// @/ betyder "fra roden af projektet" (sat op i jsconfig.json)
import Trinlinje from "@/app/components/Trinlinje";
import Betalingsformular from "@/app/components/Betalingsformular";
import Ordreoversigt from "@/app/components/Ordreoversigt";
import MobilePayBoks from "@/app/components/MobilePayBoks";
import StjerneBaggrund from "@/app/components/StjerneBaggrund"; // Blinkende stjerner bag kasserne
import { DATO_FELTER, laesPladser, medValgtDato, ordreParametre } from "@/lib/ordre"; // Læser ordren fra URL'en
import { lavInfo } from "@/lib/lavInfo"; // "Tir 15. dec 2026 · 19:30 · Spillested, By" – deles med bekræftelsessiden
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js – de skal ikke importeres her.

// Gebyr pr. billet (findes ikke i Supabase). 2 billetter = 50,80 kr. som i Figma.
const GEBYR_PR_BILLET = 25.4;

/* ==============================
   INDHOLDET – henter data, derfor inde i <Suspense>
   URL'en bestemmer hvad der købes, fx:
   /betaling?event=8&omraade=Gulv&pladser=E-7,E-8&dato=1
   ============================== */
function BetalingIndhold() {
  // useSearchParams er det efter "?" i URL'en.
  // event: eventId omdøber "event" til "eventId". = "Gulv" er standardværdien, hvis den mangler.
  const { event: eventId, omraade = "Gulv", pladser = "", dato: datoId } = Object.fromEntries(useSearchParams());

  // Henter eventet fra Supabase:
  // .from("event")  → tabellen
  // .select(...)    → kun de kolonner, vi skal bruge
  // .eq("id", ...)  → kun rækken med det id, der står i URL'en
  // .single()       → giver ét objekt i stedet for en liste
  // DATO_FELTER henter også eventets datoer (event_dato), så vi kan finde den valgte
  const svar = useHent(
    () =>
      eventId
        ? supabase
            .from("event")
            .select(`id, titel, spillested, by, starts_at, pris_fra, ${DATO_FELTER}`)
            .eq("id", eventId)
            .single()
        : { data: null },
    eventId,
  );

  // Ingen event i URL'en → intet at betale for
  if (!eventId) {
    return (
      <p className={styles.besked}>
        Du har ikke valgt nogen billetter. <Link href="/">Find et event</Link>
      </p>
    );
  }

  if (!svar) return <p className={styles.besked}>Indlæser din ordre...</p>;
  const { data: eventData, error } = svar;

  // Fejl fra Supabase eller et id, der ikke findes
  if (error || !eventData) {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  // Eventet med den dato og pris, man valgte på pladssiden
  const event = medValgtDato(eventData, datoId);

  // "E-7,E-8" → [{ raekke: "E", plads: "7" }, { raekke: "E", plads: "8" }]
  const valgtePladser = laesPladser(pladser);

  // Event fundet, men ingen pladser i URL'en
  if (valgtePladser.length === 0) {
    return (
      <p className={styles.besked}>
        Du har ikke valgt nogen pladser. <Link href={`/events/${event.id}`}>Tilbage til eventet</Link>
      </p>
    );
  }

  // Én billet pr. valgt plads – titel, info og pris kommer fra Supabase
  const info = lavInfo(event);
  const billetter = valgtePladser.map((p, i) => ({
    nr: i + 1,
    titel: event.titel,
    info: info,
    omraade: omraade,
    raekke: p.raekke,
    plads: p.plads,
    pris: event.pris_fra,
  }));

  const gebyr = GEBYR_PR_BILLET * billetter.length;
  // reduce lægger alle billetpriserne sammen (starter på 0), og så lægges gebyret til
  const total = billetter.reduce((sum, b) => sum + b.pris, 0) + gebyr;

  return (
    <div className={styles.kolonner}>
      {/* ===== VENSTRE KOLONNE ===== */}
      <div className={styles.venstre}>
        {/* Advarsel – role="alert" får skærmlæsere til at læse den op med det samme */}
        <div className={styles.advarsel} role="alert">
          <Image src="/assets/icons/advarsel-3kant.svg" alt="" width={40} height={40} />
          <p>
            <strong>Bliv på siden, mens betalingen gennemføres.</strong>
            <br />
            Brug ikke tilbage-knappen, og genindlæs ikke siden.
          </p>
        </div>

        {/* Kortformularen – får totalen, så betal-knappen viser det rigtige beløb */}
        {/* videreTil: bekræftelsessiden får samme ordre med i URL'en, så den kan vise billetterne */}
        <Betalingsformular
          total={total}
          eventId={event.id}
          datoId={datoId}
          billetter={billetter}
          videreTil={`/bekraeftelse?${ordreParametre({ eventId: event.id, omraade, pladser, datoId })}`}
          loginTil={`/login?${ordreParametre({ eventId: event.id, omraade, pladser, datoId })}`}
        />

        {/* Stregerne på hver side laves med ::before og ::after i CSS */}
        <p className={styles.skille}>eller betal med MobilePay</p>

        {/* MobilePay – egen komponent, fordi "Vælg" åbner et overlay (kræver useState) */}
        <MobilePayBoks />
      </div>

      {/* ===== HØJRE KOLONNE – ordreoversigten med billetter og priser ===== */}
      <div className={styles.hoejre}>
        <Ordreoversigt billetter={billetter} gebyr={gebyr} total={total} />
      </div>
    </div>
  );
}

/* ==============================
   SIDEN
   Selve siden henter ingen data – den viser rammen (trinlinje + titel) med det samme.
   BetalingIndhold ligger i <Suspense>, fordi useSearchParams kræver det ved statisk build.
   ============================== */
export default function BetalingPage() {
  return (
    // Fragment (<> </>): trinlinjen og <main> ligger ved siden af hinanden
    <>
      {/* Trin 3 = Betaling */}
      <Trinlinje aktivtTrin={3} />

      {/* Ramme i fuld bredde, så stjernerne fylder hele skærmen – ikke kun de 1060px i midten */}
      <div className={styles.stjerneOmraade}>
        {/* Stjernehimlen ligger bag kort- og ordrekasserne (z-index: -1) */}
        <StjerneBaggrund />

        <main className={styles.side}>
          <h1 className={styles.titel}>Gennemfør ordren</h1>

          <Suspense fallback={<p className={styles.besked}>Indlæser din ordre...</p>}>
            <BetalingIndhold />
          </Suspense>
        </main>
      </div>
    </>
  );
}
