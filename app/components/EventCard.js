

import Link from "next/link";
import Image from "next/image";
import styles from "./EventCard.module.css";

export default function EventCard({ event }) {
  const dato = new Date(event.starts_at);
  const dag = dato.getDate();
  const maaned = dato
    .toLocaleDateString("da-DK", { month: "short" })
    .replace(".", "");
  const pris = event.pris_fra.toLocaleString("da-DK");

  return (
    <Link href={`/events/${event.id}`} className={styles.card}>
      <div className={styles.billedeBoks}>
        <Image
          src={event.card_image_url}
          alt={event.titel}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
          className={styles.billede}
        />
        <span className={styles.kategori}>{event.kategori}</span>
        <div className={styles.dato}>
          <span className={styles.dag}>{dag}</span>
          <span className={styles.maaned}>{maaned}</span>
        </div>
      </div>

      <div className={styles.info}>
        <h2 className={styles.titel}>{event.titel}</h2>
        <p className={styles.sted}>
          {event.spillested}, {event.by}
        </p>
        <p className={styles.pris}>{pris} DKK</p>
      </div>
    </Link>
  );
}
