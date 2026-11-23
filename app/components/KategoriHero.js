

import Image from "next/image";
import Link from "next/link";
import { kategoriInfo } from "@/lib/kategorier";
import styles from "./KategoriHero.module.css";

export default function KategoriHero({ kategori }) {
  // Finder titel, tekst og billede til den aktuelle kategori
  const info = kategoriInfo[kategori];

  return (
    <section className={styles.hero}>
      {/* Billedet vises kun, hvis kategorien har et */}
      {info.billede && (
        <Image
          src={info.billede}
          alt=""
          fill
          preload
          sizes="100vw"
          className={styles.billede}
        />
      )}

      <div className={styles.indhold}>
        {/* Brødkrumme: aria-current fortæller skærmlæsere, hvilken side man er på */}
        <nav aria-label="Brødkrumme" className={styles.brodkrumme}>
          <Link href="/">Forside</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{info.titel}</span>
        </nav>

        <h1 className={styles.titel}>{info.titel}</h1>
        <p className={styles.tekst}>{info.tekst}</p>
      </div>
    </section>
  );
}
