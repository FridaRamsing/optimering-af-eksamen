import Link from "next/link";
import { genreNavn } from "@/lib/genre";
import { filterUrl } from "@/lib/filterUrl";
import styles from "./GenreFilter.module.css";

// Genre-knapper under heroen. Hver knap er et link, der sætter ?genre= i URL'en
export default function GenreFilter({ kategori, genrer, filtre }) {
  const valgtGenre = filtre.genre;

  return (
    <section className={styles.filter}>
      <div className={styles.indhold}>
        <h2 className={styles.overskrift}>Vælg genre</h2>

        <ul className={styles.knapper}>
          {/* "Alle" fjerner genren, men beholder de andre filtre */}
          <li>
            <Link
              href={filterUrl(kategori, { ...filtre, genre: undefined })}
              scroll={false}
              className={`${styles.knap} ${!valgtGenre ? styles.valgt : ""}`}
              aria-current={!valgtGenre ? "true" : undefined}
            >
              Alle
            </Link>
          </li>

          {genrer.map((genre) => (
            <li key={genre}>
              <Link
                href={filterUrl(kategori, { ...filtre, genre })}
                scroll={false}
                className={`${styles.knap} ${valgtGenre === genre ? styles.valgt : ""}`}
                aria-current={valgtGenre === genre ? "true" : undefined}
              >
                {genreNavn(genre)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
