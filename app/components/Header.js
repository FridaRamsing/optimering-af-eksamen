import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import MusicDropdown from "./MusicDropdown"; 
import SportDropdown from "./SportDropdown";
import UnderholdningDropdown from "./UnderholdningDropdown";
import OplevelseDropdown from "./OplevelseDropdown";


{/* Header komponenten, der indeholder navigationen og logoet */}
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/assets/icons/ticketmaster-logo.svg"
            alt="Ticketmaster"
            width={150}
            height={20}
          />
        </Link>

        {/* navigation elementer til de forskellige kategorier */}
        <nav className={styles.navigation}>
          <div className={styles.categoryItem}>
            <Link href="/kategori/musik">Musik</Link>
            <MusicDropdown /> 
          </div>

          <div className={styles.categoryItem}>
          <Link href="/kategori/sport">Sport</Link>
            <SportDropdown />
          </div>
          
          <div className={styles.categoryItem}>
            <Link href="/kategori/underholdning">Underholdning</Link>
            <UnderholdningDropdown />
          </div>
          
          <div className={styles.categoryItem}>
            <Link href="/kategori/oplevelse">Oplevelse</Link>
            <OplevelseDropdown />
          </div>
        </nav>
      </div>

      {/* tilføjet ny div med klassen "actions" for at placere knappen til eventgeneratoren */}
      <div className={styles.actions}>
        <Link href="/eventgenerator" className={styles.eventButton}>
          Eventgenerator
        </Link>
        <button type="button" className={styles.iconLink}>
          <Image
            src="/assets/icons/søg.svg"
            alt="Søg"
            width={32}
            height={32}
            className={styles.iconDefault}
          />
          <Image
            src="/assets/icons/søg-hover.svg"
            alt=""
            width={32}
            height={32}
            className={styles.iconHover}
          />
        </button>
        <Link href="/events" className={styles.iconLink}>
          <Image
            src="/assets/icons/favorite.svg"
            alt="Favoritter"
            width={32}
            height={32}
            className={styles.iconDefault}
          />
          <Image
            src="/assets/icons/favorite-hover.svg"
            alt=""
            width={32}
            height={32}
            className={styles.iconHover}
          />
        </Link>
        <button type="button" className={styles.iconLink}>
          <Image
            src="/assets/icons/bruger.svg"
            alt="Bruger"
            width={32}
            height={32}
            className={styles.iconDefault}
          />
          <Image
            src="/assets/icons/bruger-hover.svg"
            alt=""
            width={32}
            height={32}
            className={styles.iconHover}
          />
        </button>
      </div>
    </header>
  );
}
