import { Suspense } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { kategoriInfo } from "@/lib/kategorier";
import EventCard from "@/app/components/EventCard";
import KategoriHero from "@/app/components/KategoriHero";
import styles from "./page.module.css";

async function KategoriIndhold({ params }) {
  const { kategori } = await params;

  if (!kategoriInfo[kategori]) {
    notFound();
  }

  const { data: events, error } = await supabase
    .from("event")
    .select(
      "id, titel, image_url, card_image_url, kategori, spillested, by, starts_at, pris_fra, ekstra_datoer",
    )
    .eq("kategori", kategori)
    .order("starts_at", { ascending: true });

  return (
    <>
      <KategoriHero kategori={kategori} />

      <div className={styles.indhold}>
        {error && <p>Noget gik galt. Prøv igen senere.</p>}

        {!error && events.length === 0 && (
          <p>Der er ingen events i denne kategori lige nu.</p>
        )}

        {!error && events.length > 0 && (
          <>
            <p className={styles.antal}>
              {events.length} muligheder for nye minder
            </p>
            <ul className={styles.grid}>
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default function KategoriPage({ params }) {
  return (
    <main>
      <Suspense fallback={<p>Indlæser events…</p>}>
        <KategoriIndhold params={params} />
      </Suspense>
    </main>
  );
}
