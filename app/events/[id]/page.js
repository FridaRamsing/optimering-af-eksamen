import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import EventIndhold from "./EventIndhold";

// Fortæller Next, hvilke eventsider der skal bygges til GitHub Pages
export async function generateStaticParams() {
  const { data, error } = await supabase.from("event").select("id");

  // Stop buildet, så en side uden events aldrig bliver lagt online
  if (error || !data?.length) {
    throw new Error("Kunne ikke hente events fra Supabase under build");
  }

  return data.map((event) => ({ id: String(event.id) }));
}

export default function EventPage() {
  return (
    <main>
      <Suspense fallback={<p>Indlæser event...</p>}>
        <EventIndhold />
      </Suspense>
    </main>
  );
}
