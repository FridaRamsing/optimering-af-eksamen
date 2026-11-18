import styles from "./Header.module.css";
import Image from "next/image";

const popularExperiences = [
  { name: "HOTEL/RESTAURANT", image: "/assets/images/hotel-restaurants.svg" },
  { name: "FORLYSTELSER", image: "/assets/images/circus-speciality-acts.svg" },
  { name: "FESTIVALER", image: "/assets/images/festival.svg" },
  { name: "FRITID", image: "/assets/images/ice-shows.svg" },
  { name: "FAMILIEEVENT", image: "/assets/images/childrens-music.svg" },
];

export default function OplevelseDropdown() {
  return (
    <div className={styles.dropdown}>
      <section className={styles.popularSection}>
        <h2>Populært</h2>
        <div className={styles.popularCards}>
          {popularExperiences.map((genre) => (
            <article className={styles.popularCard} key={genre.name}>
              <Image src={genre.image} alt="" width={292} height={183} />
              <h3>{genre.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.dropdownContent}>
        <section className={styles.genreSection}>
          <h3>FESTIVALER</h3>
          <p>Mad/Drikkefestivaler</p>
          <p>Musikfestivaler</p>
          <p>Rock/Pop festival</p>
          <p>Klassisk musikfestival</p>
          <p>Jazzfestival</p>
          <p>Comedyfestivaler</p>
          <p>Flere festivaler</p>
          <p>Kulturfestival</p>
        </section>

        <section className={styles.genreSection}>
          <h3>KULTUR</h3>
          <p>Rundvisninger/udstillinger</p>
          <p>Udstillinger/Messer</p>
          <p>Galla</p>
        </section>

        <section className={styles.genreSection}>
          <h3>FAMILIE &amp; FRITID</h3>
          <p>Familieevents</p>
          <p>Fritid</p>
          <p>Ferie/Fritid</p>
          <p>Sundhed/Hel­se</p>
          <p>Forlystelser</p>
          <p>Familieshow</p>
        </section>

        <section className={styles.genreSection}>
          <h3>REJSER &amp; OPHOLD</h3>
          <p>Hotel/Restaurant</p>
          <p>Transport</p>
        </section>

        <section className={styles.genreSection}>
          <h3>PRAKTISK</h3>
          <p>Tilmelding</p>
        </section>

        <section className={styles.genreSection}>
          <h3>BYER</h3>
          <p>Aalborg</p>
          <p>Aarhus</p>
          <p>Herning</p>
          <p>København</p>
          <p>Odense</p>
        </section>
      </div>
    </div>
  );
}
