import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { kategoriInfo } from "@/lib/kategorier";
import { koenNavn, ALDER_MIN, ALDER_MAX } from "@/lib/maalgruppe";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import GeneratorFormular from "@/app/components/GeneratorFormular";
import EventCard from "@/app/components/EventCard";
import GeneratorTopbar from "@/app/components/GeneratorTopbar";
import GeneratorIngenResultater from "@/app/components/GeneratorIngenResultater";
import FilterLinje from "@/app/components/FilterLinje";
import FilterMaerker from "@/app/components/FilterMaerker";
import SorterVaelger from "@/app/components/SorterVaelger";
import styles from "./page.module.css";

const STI = "/eventgenerator";
const SORTERINGER = ["dato", "pris-lav", "pris-hoej"];

// Valgene i filterpanelet: [{ vaerdi: "musik", tekst: "Musik" }, ...]
const kategoriMuligheder = Object.entries(kategoriInfo).map(([vaerdi, info]) => ({
  vaerdi,
  tekst: info.titel,
}));

// Selve indholdet. Den er "async", fordi den skal vente på URL'en og på Supabase
async function GeneratorIndhold({ searchParams }) {
  const { alder, koen, kategori, pris, dato, by, sort } = await searchParams;
  const alderTal = parseInt(alder); // "25" → 25

  // Mangler alder eller køn, eller er de ugyldige → vis formularen
  if (!(alderTal >= ALDER_MIN && alderTal <= ALDER_MAX) || !koenNavn(koen)) {
    return (
      <div className={styles.formularBoks}>
        <GeneratorFormular />
      </div>
    );
  }

  // Ukendte værdier i URL'en ignoreres, fx ?kategori=hest
  const gyldigKategori = kategoriMuligheder.some((m) => m.vaerdi === kategori)
    ? kategori
    : undefined;
  const gyldigSort = SORTERINGER.includes(sort) ? sort : undefined;

  // Alt fra URL'en samlet, så komponenterne kan bygge nye URL'er uden at miste noget
  const filtre = {
    alder: alderTal,
    koen,
    kategori: gyldigKategori,
    pris,
    dato,
    by,
    sort: gyldigSort,
  };

  // Alle byer til dropdownen i filterpanelet. Set fjerner dubletter
  const { data: byData } = await supabase.from("event").select("by");
  const byer = [...new Set(byData?.map((r) => r.by).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "da"),
  );

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

  // Filtrene tilføjes kun, hvis de er valgt
  if (gyldigKategori) query = query.eq("kategori", gyldigKategori);

  // "300-500" → minPris 300 og maxPris 500
  if (pris) {
    const [minPris, maxPris] = pris.split("-").map((tal) => parseInt(tal));
    if (minPris >= 0) query = query.gte("pris_fra", minPris);
    if (maxPris >= 0) query = query.lte("pris_fra", maxPris);
  }

  if (dato) query = query.gte("starts_at", dato);
  if (by) query = query.eq("by", by);

  // Standard er dato: det, der sker snarest, står først
  if (gyldigSort === "pris-lav") query = query.order("pris_fra", { ascending: true });
  else if (gyldigSort === "pris-hoej") query = query.order("pris_fra", { ascending: false });
  else query = query.order("starts_at", { ascending: true });

  const { data: events, error } = await query;
  const harFiltre = Boolean(gyldigKategori || pris || dato || by);

  return (
    <>
      <GeneratorTopbar
        alder={alderTal}
        koen={koen}
        filtre={filtre}
        maerker={
          <FilterMaerker
            sti={STI}
            filtre={filtre}
            felt="kategori"
            muligheder={kategoriMuligheder}
          />
        }
      />

      <div className={styles.indhold}>
        <div className={styles.vaerktoejer}>
          <FilterLinje
            sti={STI}
            filtre={filtre}
            felt="kategori"
            muligheder={kategoriMuligheder}
            byer={byer}
          />
          <SorterVaelger sti={STI} filtre={filtre} />
        </div>

        {error && <p>Noget gik galt. Prøv igen senere.</p>}

        {/* Filtre valgt, men ingen events → Freias boks med "Ryd alle filtre" */}
        {!error && events.length === 0 && harFiltre && (
          <div className={styles.ingenResultater}>
            <GeneratorIngenResultater alder={alderTal} koen={koen} sort={gyldigSort} />
          </div>
        )}

        {/* Ingen filtre at rydde, så her er der ingen knap */}
        {!error && events.length === 0 && !harFiltre && (
          <div className={styles.ingenResultater}>
            <div className={styles.ingenBoks}>
              <h2>Vi fandt ingen forslag ud fra dine valg</h2>
              <p>Prøv at ændre alderen eller vælge &quot;Alle&quot; – så kan vi vise dig flere oplevelser</p>
            </div>
          </div>
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
      {/* Påkrævet i dette projekt, når man læser searchParams */}
      <Suspense fallback={null}>
        <GeneratorIndhold searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
