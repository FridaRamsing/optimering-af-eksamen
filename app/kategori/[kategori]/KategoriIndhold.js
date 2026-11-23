"use client";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useHent } from "@/lib/useHent";
import { kategoriInfo } from "@/lib/kategorier";
import EventCard from "@/app/components/EventCard";
import KategoriHero from "@/app/components/KategoriHero";
import GenreFilter from "@/app/components/GenreFilter";
import FilterLinje from "@/app/components/FilterLinje";
import KategoriLoading from "@/app/components/KategoriLoading";
import KategoriIngenResultater from "@/app/components/KategoriIngenResultater";
import { kategoriGenrer, genreNavn } from "@/lib/genre";
import styles from "./page.module.css";

// Unikke værdier fra én kolonne, sorteret. Set fjerner dubletter: ["pop", "pop", "rap"] → ["pop", "rap"]
function unikke(raekker, kolonne) {
  return [...new Set(raekker?.map((r) => r[kolonne]).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "da"),
  );
}

export default function KategoriIndhold() {
  const { kategori } = useParams();
  // Filtre fra URL'en, fx ?genre=pop&pris=300-500&dato=2027-01-01&by=Herning
  const { genre, pris, dato, by } = Object.fromEntries(useSearchParams());
  const filtre = { genre, pris, dato, by };

  const svar = useHent(async () => {
    // Hent genre og by for alle events i kategorien – bruges til knapper og dropdown
    const { data: valgData } = await supabase
      .from("event")
      .select("genre, by")
      .eq("kategori", kategori);

    // Hent events – filtrene tilføjes kun, hvis de er valgt
    let query = supabase
      .from("event")
      .select(
        "id, titel, image_url, card_image_url, kategori, genre, spillested, by, starts_at, pris_fra, ekstra_datoer",
      )
      .eq("kategori", kategori);

    if (genre) {
      query = query.eq("genre", genre);
    }

    // "300-500" → minPris 300 og maxPris 500
    if (pris) {
      const [minPris, maxPris] = pris.split("-").map((tal) => parseInt(tal));
      if (minPris >= 0) query = query.gte("pris_fra", minPris);
      if (maxPris >= 0) query = query.lte("pris_fra", maxPris);
    }

    // Events fra og med den valgte dato
    if (dato) {
      query = query.gte("starts_at", dato);
    }

    if (by) {
      query = query.eq("by", by);
    }

    const { data: events, error } = await query.order("starts_at", {
      ascending: true,
    });

    return { valgData, events, error };
  }, JSON.stringify({ kategori, ...filtre }));

  if (!kategoriInfo[kategori]) {
    notFound();
  }

  if (!svar) return <KategoriLoading />;
  const { valgData, events, error } = svar;

  // Den faste liste først, derefter evt. genrer fra Supabase, som ikke står på listen
  const genrer = [
    ...new Set([...kategoriGenrer[kategori], ...unikke(valgData, "genre")]),
  ];
  const byer = unikke(valgData, "by");
  // Som { vaerdi, tekst }, fordi funktioner ikke kan sendes til klientkomponenter
  const muligheder = genrer.map((g) => ({ vaerdi: g, tekst: genreNavn(g) }));

  // Er der valgt mindst ét filter?
  const harFiltre = Boolean(genre || pris || dato || by);

  return (
    <>
      <KategoriHero kategori={kategori} />

      <GenreFilter kategori={kategori} genrer={genrer} filtre={filtre} />

      <div className={styles.indhold}>
        <FilterLinje
          sti={`/kategori/${kategori}`}
          filtre={filtre}
          felt="genre"
          muligheder={muligheder}
          byer={byer}
        />

        {error && <p>Noget gik galt. Prøv igen senere.</p>}

        {/* Filtre valgt, men ingen events → Freias boks med "Ryd alle filtre" */}
        {!error && events.length === 0 && harFiltre && (
          <div className={styles.ingenResultater}>
            <KategoriIngenResultater kategori={kategori} />
          </div>
        )}

        {!error && events.length === 0 && !harFiltre && (
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
