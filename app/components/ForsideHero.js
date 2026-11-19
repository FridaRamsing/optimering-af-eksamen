

import Image from "next/image";
import Link from "next/link";
import styles from "./ForsideHero.module.css";
import HeroAnimation from "./HeroAnimation";

export default function ForsideHero() {
  return (
    <section className={styles.hero}>
      {/* Stillbillede: vises mens Lottie'en hentes (4 MB), og hvis brugeren har slået animationer fra */}
      <Image
        src="/assets/images/forside/hero.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className={styles.billede}
      />
      <HeroAnimation />

      <div className={styles.indhold}>
        <span className={styles.streg} aria-hidden="true" />
        <h1 className={styles.titel}>
          Find din næste <br />
          store oplevelse
        </h1>
        <p className={styles.tekst}>
          Koncerter, sport, teater og familie – alt samlet ét sted.
        </p>
        {/* Hopper ned til første sektion (id="populaere" i page.js) */}
        <Link href="#populaere" className={styles.knap}>
          Find oplevelser
        </Link>
      </div>
    </section>
  );
}
