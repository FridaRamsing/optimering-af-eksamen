import { Suspense } from "react"; // Viser "Indlæser..." mens data hentes
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Forbindelsen til databasen (bruger .env.local)
// @/ betyder "fra roden af projektet" (sat op i jsconfig.json)
import Trinlinje from "@/app/components/Trinlinje";
import Betalingsformular from "@/app/components/Betalingsformular";
import Ordreoversigt from "@/app/components/Ordreoversigt";
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js – de skal ikke importeres her.

// Gebyr pr. billet (findes ikke i Supabase). 2 billetter = 50,80 kr. som i Figma.
const GEBYR_PR_BILLET = 25.4;

// Laver "Tir 15. dec 2026 · 19:30 · Sct. Catharinæ Kirke, Hjørring" ud fra eventet
function lavInfo(event) {
  const dato = new Date(event.starts_at);
  // Dansk tid – ellers viser serveren måske UTC (en time forkert)
  const tz = { timeZone: "Europe/Copenhagen" };

  // Hver del for sig, så vi selv styrer punktummerne
  const ugedag = dato.toLocaleDateString("da-DK", { ...tz, weekday: "short" }).replace(".", "");
  const dag = dato.toLocaleDateString("da-DK", { ...tz, day: "numeric" }).replace(".", "");
  const maaned = dato.toLocaleDateString("da-DK", { ...tz, month: "short" }).replace(".", "");
  const aar = dato.toLocaleDateString("da-DK", { ...tz, year: "numeric" });
  const tid = dato
    .toLocaleTimeString("da-DK", { ...tz, hour: "2-digit", minute: "2-digit" })
    .replace(".", ":");

  // Tre bogstaver med stort forbogstav: "tirs" → "Tir"
  const Ugedag = ugedag.charAt(0).toUpperCase() + ugedag.slice(1, 3);

  // → "Tir 15. dec 2026 · 19:30 · Sct. Catharinæ Kirke, Hjørring"
  return `${Ugedag} ${dag}. ${maaned} ${aar} · ${tid} · ${event.spillested}, ${event.by}`;
}

/* ==============================
   INDHOLDET – henter data, derfor inde i <Suspense>
   URL'en bestemmer hvad der købes, fx:
   /betaling?event=12&omraade=Parket&pladser=E-7,E-8
   ============================== */
async function BetalingIndhold({ searchParams }) {
  // searchParams er det efter "?" i URL'en. Det er et Promise, så vi skal bruge await.
  // event: eventId omdøber "event" til "eventId". = "Parket" er standardværdien, hvis den mangler.
  const { event: eventId, omraade = "Parket", pladser = "" } = await searchParams;

  // Ingen event i URL'en → intet at betale for
  if (!eventId) {
    return (
      <p className={styles.besked}>
        Du har ikke valgt nogen billetter. <Link href="/events">Find et event</Link>
      </p>
    );
  }

  // Henter eventet fra Supabase:
  // .from("event")  → tabellen
  // .select(...)    → kun de kolonner, vi skal bruge
  // .eq("id", ...)  → kun rækken med det id, der står i URL'en
  // .single()       → giver ét objekt i stedet for en liste
  const { data: event, error } = await supabase
    .from("event")
    .select("id, titel, spillested, by, starts_at, pris_fra")
    .eq("id", eventId)
    .single();

  // Fejl fra Supabase eller et id, der ikke findes
  if (error || !event) {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  // "E-7,E-8" → [{ raekke: "E", plads: "7" }, { raekke: "E", plads: "8" }]
  const valgtePladser = pladser
    .split(",") // "E-7,E-8" → ["E-7", "E-8"]
    .filter(Boolean) // fjerner tomme tekster, fx hvis pladser er ""
    .map((p) => {
      const [raekke, plads] = p.split("-"); // "E-7" → ["E", "7"]
      return { raekke, plads };
    });

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
        <Betalingsformular total={total} />

        {/* Stregerne på hver side laves med ::before og ::after i CSS */}
        <p className={styles.skille}>eller betal med MobilePay</p>

        {/* MobilePay – knappen gør ikke noget endnu (kun design) */}
        <div className={styles.mobilepay}>
          <Image src="/assets/icons/mobilePaylogo.svg" alt="" width={48} height={48} />
          <h2>MobilePay</h2>
          <button type="button" className={styles.vaelg}>
            Vælg
          </button>
        </div>
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
   Selve siden henter ingen data – den viser rammen (trinlinje + titel) med det samme
   og sender searchParams videre til BetalingIndhold inde i <Suspense>.
   Det kræves, fordi cacheComponents er slået til i next.config.mjs.
   ============================== */
export default function BetalingPage({ searchParams }) {
  return (
    // Fragment (<> </>): trinlinjen og <main> ligger ved siden af hinanden
    <>
      {/* Trin 3 = Betaling */}
      <Trinlinje aktivtTrin={3} />

      <main className={styles.side}>
        <h1 className={styles.titel}>Gennemfør ordren</h1>

        <Suspense fallback={<p className={styles.besked}>Indlæser din ordre...</p>}>
          <BetalingIndhold searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
