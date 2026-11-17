
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/app/components/EventCard";
import styles from "./page.module.css"

async function KategoriIndhold({params}) {
  const {kategori} = await params;

  const { data: events, error } = await supabase
  .from("event")
  .select("id, titel, image_url, kategori, spillested, by, starts_at, pris_fra")
  .eq("kategori", kategori)
  .order("starts_at", { ascending: true });

  if (error) {
    return <p>Noget gik galt. Prøv igen senere.</p>;
  }

  if (events.length === 0) {
    return <p> Der er ingen events i denne kategori lige nu</p>;
  }

 return (
  <>
  <h1>{kategori}</h1>
  <p>{events.length} muligheder for nye minder</p>
  <ul className={styles.grid}>
    {events.map((event) => (
      <li key={event.id}>
        <EventCard event={event} />
      </li>
    )
    )}
  </ul>


  </>
 ); 
}

export default function KategoriPage ({params}) {
  return (
    <main>
      <Suspense fallback={<p>Indlæser events...</p>}>
      <KategoriIndhold params={params} />
      </Suspense>
    </main>
  );
}
