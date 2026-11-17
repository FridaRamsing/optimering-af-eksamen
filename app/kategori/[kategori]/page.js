
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

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
  <ul>
    {events.map((event) =>(
      <li key={event.id}>{event.titel}</li>
    ))}
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
