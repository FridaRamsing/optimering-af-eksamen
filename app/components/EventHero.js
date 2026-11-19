

import Image from "next/image";
import FavoritKnap from "./FavoritKnap";
import TilbageKnap from "./TilbageKnap";
import DelKnap from "./DelKnap";
import styles from "./EventHero.module.css";

export default function EventHero({ event, datoTekst }) {
  const pris = event.pris_fra.toLocaleString("da-DK");

  return (
    <section className={styles.hero}>
      <div className={styles.baggrund}>
        <Image
          src={event.hero_image_url}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.baggrundBillede}
        />
        <TilbageKnap />
      </div>

      <div className={styles.indhold}>
        <div className={styles.portraet}>
          <Image
            src={event.detalje_image_url}
            alt={event.kunstner}
            fill
            sizes="(max-width: 800px) 160px, 320px"
            className={styles.portraetBillede}
          />
        </div>

        <div className={styles.tekst}>
          <div>
            <p className={styles.kategori}>{event.kategori}</p>
            <h1 className={styles.titel}>{event.titel}</h1>
            <p className={styles.info}>
              {datoTekst} · {event.spillested}, {event.by}
            </p>
          </div>

          <div className={styles.prisBoks}>
            <p className={styles.prisLabel}>Billetter fra</p>
            <p className={styles.pris}>{pris} DKK</p>
            <div className={styles.knapper}>
              <FavoritKnap eventId={event.id} titel={event.titel} className={styles.heroKnap} />
              <DelKnap titel={event.titel} className={styles.heroKnap} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
