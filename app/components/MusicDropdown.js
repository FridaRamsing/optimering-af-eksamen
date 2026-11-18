import styles from "./Header.module.css";
import Image from "next/image";

const popularGenres = [
    { name: "ROCK/POP", image: "/assets/images/rock-pop.svg" },
    { name: "HARD ROCK/METAL", image: "/assets/images/hard-rock-metal.svg" },
    { name: "HIP-HOP/RAP/R&B", image: "/assets/images/hip-hop-rap.svg" },
    { name: "VERDENSMUSIK", image: "/assets/images/verdensmusik.svg" },
    { name: "DANCE/ELECTRONIC", image: "/assets/images/dance.svg" },
];

export default function MusicDropdown() {
    return (
      <div className={styles.dropdown}> 
        <section className={styles.popularSection}>
          <h2>Populært</h2>
          <div className={styles.popularCards}>
            {popularGenres.map((genre) => (
              <article className={styles.popularCard} key={genre.name}>
                <Image src={genre.image} alt="" width={292} height={183} />
                <h3>{genre.name}</h3>
            </article>
            ))}
          </div>
        </section>

<div className={styles.dropdownContent}>
        <section className={styles.genreSection}>
          <h3>MUSIKGENRER</h3>
          <div className={styles.genreColumns}>
            <div className={styles.genreList}>
              <p>Rock/Pop</p>
              <p>Indie rock</p>
              <p>Hard Rock/Metal</p>
              <p>Hip-hop/Rap/R&B</p>
              <p>Soul</p>
              <p>Dance/Electronic</p>
              <p>Schlager musik</p>
              <p>Sanger/Contemporary</p>
            </div>

            <div className={styles.genreList}>
              <p>Country/Viser/Folk</p>
              <p>Latin musik</p>
              <p>Verdensmusik</p>
              <p>Klassisk musik</p>
              <p>Jazz/Blues</p>
              <p>Korsang</p>
              <p>Gospel</p>
            </div>
          </div>
        </section>

        <section className={styles.genreSection}>
            <h3>KONCERTER</h3>
            <p>Julekoncert</p>
        </section>

        <section className={styles.genreSection}>
            <h3>FESTIVALER</h3>
              <p>Rock/Pop festival</p>
              <p>Klassisk musikfestival</p>
              <p>Jazzfestival</p> 
              <p>Musikfestivaler</p>
        </section>

        <section className={styles.genreSection}>
            <h3>BØRN</h3>
            <p>Børnemusik</p>
        </section>
      </div>
      </div>
    );
}