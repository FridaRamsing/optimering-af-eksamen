import styles from "./Header.module.css";
import Image from "next/image";

const popularEntertainment = [
  { name: "TEATER", image: "/assets/images/teater.svg" },
  { name: "MUSICAL", image: "/assets/images/musicals.svg" },
  { name: "FOREDRAG/KURSER", image: "/assets/images/conferences.svg" },
  { name: "STAND-UP", image: "/assets/images/comedy.svg" },
  { name: "CIRKUS", image: "/assets/images/circus-speciality-acts.svg" },
];

export default function UnderholdningDropdown() {
  return (
    <div className={styles.dropdown}>
      <section className={styles.popularSection}>
        <h2>Populært</h2>
        <div className={styles.popularCards}>
          {popularEntertainment.map((genre) => (
            <article className={styles.popularCard} key={genre.name}>
              <Image src={genre.image} alt="" width={292} height={183} />
              <h3>{genre.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.dropdownContent}>
        <section className={styles.genreSection}>
          <h3>TEATER</h3>
          <p>Teater</p>
          <p>Musical</p>
          <p>Opera</p>
          <p>Revy</p>
          <p>Cabaret</p>
          <p>Ballet</p>
          <p>Dans</p>
        </section>

        <section className={styles.genreSection}>
          <h3>COMEDY</h3>
          <p>Stand-up</p>
          <p>Comedy</p>
        </section>

        <section className={styles.genreSection}>
          <h3>SHOWS</h3>
          <p>Show</p>
          <p>Cirkus</p>
          <p>Isshow</p>
          <p>Familieshow</p>
          <p>Multimedie</p>
          <p>Forlystelser</p>
        </section>

        <section className={styles.genreSection}>
          <h3>FILM</h3>
          <p>Film</p>
        </section>

        <section className={styles.genreSection}>
          <h3>BØRN</h3>
          <p>Børneteater</p>
          <p>Musik &amp; teater for børn</p>
          <p>Mere familie</p>
        </section>

        <section className={styles.genreSection}>
          <h3>Læring</h3>
          <p>Foredrag/Kurser</p>
        </section>
      </div>
    </div>
  );
}
