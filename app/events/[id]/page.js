

import Link from "next/link";

export default async function EventPage({ params }) {
  const { id } = await params;

  return (
    <main>
      <h1>Event: {id}</h1>
      <Link href="/pladser">Køb billet</Link>
    </main>
  );
}
