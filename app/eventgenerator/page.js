import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { koenNavn } from "@/lib/maalgruppe";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import GeneratorFormular from "@/app/components/GeneratorFormular";
import EventCard from "@/app/components/EventCard";
import GeneratorTopbar from "@/app/components/GeneratorTopbar";
import styles from "./page.module.css";

// Selve indholdet. Den er "async", fordi den skal vente på URL'en og på Supabase
async function GeneratorIndhold({ searchParams }) {
  // Læs alder og køn fra URL'en, fx ?alder=25&koen=kvinde
  const { alder, koen } = await searchParams;
  const alderTal = parseInt(alder); // "25" → 25

  // Mangler alder eller køn, eller er de ugyldige → vis formularen
  if (!(alderTal >= 1) || !koenNavn(koen)) {
    return (
      <div className={styles.formularBoks}>
        <GeneratorFormular />
      </div>
    );
  }

  // Hent events, hvor alderen ligger mellem alder_min og alder_max
  let query = supabase
    .from("event")
    .select(
      "id, titel, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer",
    )
    .lte("alder_min", alderTal)
    .gte("alder_max", alderTal);

  // Har man valgt Kvinde eller Mand: vis det køn + events til alle
  if (koen !== "alle") {
    query = query.in("koen", [koen, "alle"]);
  }

  const { data: events, error } = await query.order("starts_at", {
    ascending: true,
  });

  return (
    <>
      {/* key: får topbaren til at starte forfra, når alderen i URL'en skifter */}
      <GeneratorTopbar key={alderTal} alder={alderTal} koen={koen} />

      <div className={styles.indhold}>
        {error && <p>Noget gik galt. Prøv igen senere.</p>}

        {!error && events.length === 0 && (
          <p>Vi fandt ingen forslag ud fra dine valg.</p>
        )}

        {!error && events.length > 0 && (
          <ul className={styles.grid}>
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default function EventgeneratorPage({ searchParams }) {
  return (
    <main className={styles.side}>
      <StjerneBaggrund />
      {/* Påkrævet i dette projekt, når man læser searchParams (se noterne) */}
      <Suspense fallback={null}>
        <GeneratorIndhold searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
