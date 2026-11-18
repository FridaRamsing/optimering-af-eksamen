

import Link from "next/link";

export default async function EventPage({ params }) {
  const { id } = await params;

  return (
    <main>
      <h1>Event: {id}</h1>
      {/* Sender event-id'et med, så betalingssiden kan hente eventet fra Supabase */}
      <Link href={`/pladser?event=${id}`}>Køb billet</Link>
    </main>
  );
}
