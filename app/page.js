


import { Suspense } from "react";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";
import { byKort, kategoriKort } from "@/lib/forside";
import ForsideHero from "@/app/components/ForsideHero";
import SektionOverskrift from "@/app/components/SektionOverskrift";
import EventCard from "@/app/components/EventCard";
import BilledKort from "@/app/components/BilledKort";
import GaveideBanner from "@/app/components/GaveideBanner";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import styles from "./page.module.css";

// Felterne EventCard skal bruge
const kortFelter =
  "id, titel, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer";

function EventRaekke({ events, error }) {
  if (error) {
    return <p className={styles.fejl}>Vi kunne ikke hente events lige nu.</p>;
  }

  return (
    <ul className={styles.raekke}>
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}

// Ingen popularitet i tabellen → events med flest ekstra datoer regnes som populære
async function PopulaereEvents() {
  const { data, error } = await supabase
    .from("event")
    .select(kortFelter)
    .order("ekstra_datoer", { ascending: false })
    .limit(8);

  return <EventRaekke events={data} error={error} />;
}

async function KommendeEvents() {
  // Vent på et rigtigt besøg, så "nu" er tidspunktet for besøget – ikke for build
  await connection();
  const nu = new Date().toISOString();

  const { data, error } = await supabase
    .from("event")
    .select(kortFelter)
    .gte("starts_at", nu)
    .order("starts_at", { ascending: true })
    .limit(8);

  return <EventRaekke events={data} error={error} />;
}

export default function Forside() {
  return (
    <main className={styles.side}>
      <StjerneBaggrund />
      <ForsideHero />

      <div className={styles.sektioner}>
        <section className={styles.sektion} aria-labelledby="populaere">
          <SektionOverskrift id="populaere">
            Populære søgninger
          </SektionOverskrift>
          <Suspense fallback={<div className={styles.pladsholder} />}>
            <PopulaereEvents />
          </Suspense>
        </section>

        <section className={styles.sektion} aria-labelledby="byer">
          <SektionOverskrift id="byer">Events i din by</SektionOverskrift>
          <ul className={styles.raekke}>
            {byKort.map((kort) => (
              <li key={kort.navn}>
                <BilledKort {...kort} />
              </li>
            ))}
          </ul>
        </section>

        <GaveideBanner />

        <section className={styles.sektion} aria-labelledby="kategorier">
          <SektionOverskrift id="kategorier">
            Udforsk kategorier
          </SektionOverskrift>
          <ul className={styles.raekke}>
            {kategoriKort.map((kort) => (
              <li key={kort.navn}>
                <BilledKort {...kort} />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.sektion} aria-labelledby="kommende">
          <SektionOverskrift id="kommende">Kommende events</SektionOverskrift>
          <Suspense fallback={<div className={styles.pladsholder} />}>
            <KommendeEvents />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
