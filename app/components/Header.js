import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import BrugerLink from "./BrugerLink";
import HeaderNavigation from "./HeaderNavigation";
import Soegning from "./Soegning";


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
        <HeaderNavigation />
      </div>

      {/* tilføjet ny div med klassen "actions" for at placere knappen til eventgeneratoren */}
      <div className={styles.actions}>
        <Link href="/eventgenerator" className={styles.eventButton}>
          Eventgenerator
        </Link>

        <Soegning />

        {/* Hjertet åbner favoritsiden med de kunstnere, man har liket */}
        <Link href="/favoritter" className={styles.iconLink}>
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
        {/* Bruger-ikonet – går til profilen, hvis man er logget ind, ellers til login.
            Egen komponent, fordi den skal køre i browseren for at se, om man er logget ind. */}
        <BrugerLink />
      </div>
    </header>
  );
}
