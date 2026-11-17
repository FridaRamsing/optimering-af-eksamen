
import Link from "next/link";
import styles from "./Header.module.css";

{/* Header komponenten, der indeholder navigationen og logoet */}
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <Link href="/" className={styles.logo}>
          TicketMaster
        </Link>

        {/* navigation elementer til de forskellige kategorier */}
        <nav className={styles.navigation}>
          <div className={styles.categoryItem}>
            <Link href="/kategori/musik">Musik</Link>
          </div>
          <Link href="/kategori/sport">Sport</Link>
          <Link href="/kategori/underholdning">Underholdning</Link>
          <Link href="/kategori/oplevelse">Oplevelse</Link>
        </nav>
      </div>

      {/* tilføjet ny div med klassen "actions" for at placere knappen til eventgeneratoren */}
      <div className={styles.actions}>
        <Link href="/eventgenerator" className={styles.eventButton}>
          Eventgenerator
        </Link>
        <button type="button" className={styles.iconLink}>Søg</button>
        <Link href="/events" className={styles.iconLink}>
          Favoritter
        </Link>
        <button type="button" className={styles.iconLink}>Bruger</button>
      </div>
    </header>
  );
}
