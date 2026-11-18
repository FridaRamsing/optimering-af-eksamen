
/*frida*/

import Link from "next/link";
import Image from "next/image";
import FavoritKnap from "./FavoritKnap";
import styles from "./EventCard.module.css";

export default function EventCard({ event }) {
  const dato = new Date(event.starts_at);
  const dag = dato.getDate();
  // "dec." → "dec"
  const maaned = dato
    .toLocaleDateString("da-DK", { month: "short" })
    .replace(".", "");
  // 1450 → "1.450"
  const pris = event.pris_fra.toLocaleString("da-DK");
  // Fx "+ 1 dato" eller "+ 10 datoer"
  const flereDatoerTekst =
    event.ekstra_datoer === 1 ? "+ 1 dato" : `+ ${event.ekstra_datoer} datoer`;

  return (
    <article className={styles.card}>
      <div className={styles.billedeBoks}>
        <Image
          src={event.card_image_url}
          alt=""
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
          className={styles.billede}
        />
        <span className={styles.kategori}>{event.kategori}</span>
        <FavoritKnap titel={event.titel} />

        {/* Datoboks + evt. ekstra kort bagved og "+ X datoer" */}
        <div className={styles.datoStak}>
          {event.ekstra_datoer > 0 && <span className={styles.datoBag} aria-hidden="true" />}

          <div className={styles.dato}>
            <span className={styles.fra}>Fra</span>
            <span className={styles.dag}>{dag}</span>
            <span className={styles.maaned}>{maaned}</span>
          </div>

          {event.ekstra_datoer > 0 && (
            <span className={styles.flereDatoer}>{flereDatoerTekst}</span>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <h2 className={styles.titel}>
          {/* Linket sidder på titlen, men CSS (.link::after) gør hele kortet klikbart */}
          <Link href={`/events/${event.id}`} className={styles.link}>
            {event.titel}
          </Link>
        </h2>
        <p className={styles.sted}>
          {event.spillested}, {event.by}
        </p>
        <p className={styles.pris}>{pris} DKK</p>
      </div>
    </article>
  );
}
