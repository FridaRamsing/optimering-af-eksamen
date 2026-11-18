import { Suspense } from "react";
import Link from "next/link";

// Sender det valgte event videre til betalingen.
// MIDLERTIDIGT: pladserne er faste (E-7 og E-8), indtil pladsvalget er lavet.
// Når brugeren kan vælge selv, skal "pladser" bygges ud fra deres valg.
async function GaaTilBetaling({ searchParams }) {
  // Henter event-id'et fra URL'en (/pladser?event=12)
  const { event } = await searchParams;

  // Kommer man hertil uden et event, sendes man tilbage til listen
  if (!event) {
    return <Link href="/events">Vælg et event først</Link>;
  }

  // Bygger URL'en til betalingen – event, område og pladser sendes med
  return (
    <Link href={`/betaling?event=${event}&omraade=Parket&pladser=E-7,E-8`}>
      Gå til betaling
    </Link>
  );
}

export default function PladserPage({ searchParams }) {
  return (
    <main>
      <h1>Vælg Pladser</h1>
      {/* searchParams læses inde i Suspense pga. cacheComponents i next.config */}
      <Suspense fallback={<p>Indlæser...</p>}>
        <GaaTilBetaling searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
