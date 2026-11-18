import styles from "./Header.module.css";
import Image from "next/image";

const popularSports = [
  { name: "HÅNDBOLD", image: "/assets/images/håndbold.svg" },
  { name: "ISHOCKEY", image: "/assets/images/hockey.svg" },
  { name: "GYMNASTIK/FITNESS", image: "/assets/images/gymnastics-fitness.svg" },
  { name: "ESPORT", image: "/assets/images/esport.svg" },
  { name: "MOTORSPORT", image: "/assets/images/motorsports.svg" },
];

export default function SportDropdown() {
  return (
    <div className={styles.dropdown}>
      <section className={styles.popularSection}>
        <h2>Populært</h2>
        <div className={styles.popularCards}>
          {popularSports.map((sport) => (
            <article className={styles.popularCard} key={sport.name}>
              <Image src={sport.image} alt="" width={292} height={183} />
              <h3>{sport.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.dropdownContent}>
        <section className={styles.genreSection}>
          <h3>SPORTSGRENE</h3>
          <div className={styles.genreColumns}>
            <div className={styles.genreList}>
              <p>Amerikansk fodbold</p>
              <p>Badminton</p>
              <p>Basketball</p>
              <p>Floorball</p>
              <p>Golf</p>
              <p>Håndbold</p>
              <p>Ishockey</p>
            </div>

            <div className={styles.genreList}>
              <p>Skøjtning</p>
              <p>Svømning</p>
              <p>Hestesport</p>
              <p>Kampsport</p>
              <p>Gymnastik/Fitness</p>
              <p>eSport</p>
            </div>
          </div>
        </section>

        <section className={styles.genreSection}>
          <h3>MOTORSPORT</h3>
          <p>Motorsport</p>
          <p>Speedway</p>
        </section>

        <section className={styles.genreSection}>
          <h3>EVENTS</h3>
          <p>Sportsgalla/-show</p>
          <p>Fodboldskoler</p>
        </section>
      </div>
    </div>
  );
}
