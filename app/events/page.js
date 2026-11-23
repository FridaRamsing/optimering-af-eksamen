import Link from "next/link";
import { events } from "@/lib/events";

// OBS: gammel testside med midlertidige navne, så linkene matcher ikke de rigtige event-id'er
export default function EventsPage() {
  return (
    <main>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link href={`/events/${event.id}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
