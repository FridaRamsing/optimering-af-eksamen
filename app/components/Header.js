import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

// Importerer de komponenter, som skal bruges i headeren.
import BrugerLink from "./BrugerLink";
import HeaderNavigation from "./HeaderNavigation";
import Soegning from "./Soegning";

// Header-komponenten samler logo, navigation og de forskellige
// funktioner, som skal vises øverst på hjemmesiden.
export default function Header() {
  return (
    <header className={styles.header}>
      {/* Venstre side af headeren indeholder logo og navigation. */}
      <div className={styles.leftSide}>
        {/* Logoet fungerer som et link til forsiden. */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/assets/icons/ticketmaster-logo.svg"
            alt="Ticketmaster"
            width={150}
            height={20}
          />
        </Link>

        {/* Viser navigationen med de forskellige kategorier
            som musik, sport, underholdning og oplevelser. */}
        <HeaderNavigation />
      </div>
      {/* Højre side af headeren indeholder de forskellige
          knapper og funktioner, som brugeren kan benytte. */}{" "}
      <div className={styles.actions}>
        {/* Link til eventgeneratoren, hvor brugeren
            kan finde inspiration til events. */}
        <Link href="/eventgenerator" className={styles.eventButton}>
          Eventgenerator
        </Link>
        {/* Viser søgefunktionen, hvor brugeren kan søge
            efter kunstnere, events og spillesteder. */}
        <Soegning />
        {/* Hjertet fungerer som et link til favoritsiden,
            hvor brugeren kan se sine favoritter. */}{" "}
        <Link href="/favoritter" className={styles.iconLink}>
          {/* Det almindelige favoritikon, som vises som standard. */}
          <Image
            src="/assets/icons/favorite.svg"
            alt="Favoritter"
            width={32}
            height={32}
            className={styles.iconDefault}
          />

          {/* Et andet favoritikon, som kan vises,
              når brugeren holder musen over hjertet. */}
          <Image
            src="/assets/icons/favorite-hover.svg"
            alt=""
            width={32}
            height={32}
            className={styles.iconHover}
          />
        </Link>
        
        {/* BrugerLink håndterer brugerikonet.
            Hvis brugeren er logget ind, fører det til profilen.
            Ellers bliver brugeren sendt til login.
            Funktionen ligger i sin egen komponent,
            fordi den skal kunne tjekke loginstatus. */}
        <BrugerLink />
      </div>
    </header>
  );
}
