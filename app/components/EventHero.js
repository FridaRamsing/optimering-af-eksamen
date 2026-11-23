

import Image from "next/image";
import FavoritKnap from "./FavoritKnap";
import TilbageKnap from "./TilbageKnap";
import DelKnap from "./DelKnap";
import styles from "./EventHero.module.css";
import Spotlys from "./Spotlys";

export default function EventHero({ event, datoTekst }) {
  // 1200 → "1.200"
  const pris = event.pris_fra.toLocaleString("da-DK");

  return (
    <section className={styles.hero}>
      {/* Baggrunden: hero-billedet med spotlys-animationen ovenpå */}
      <div className={styles.baggrund}>
        <Image
          src={event.hero_image_url}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.baggrundBillede}
        />
        <Spotlys billede={event.hero_image_url} />
        <TilbageKnap />
      </div>

      <div className={styles.indhold}>
        {/* Portrætbilledet af kunstneren */}
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
            {/* heroKnap giver favorit- og del-knappen samme udseende her */}
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
