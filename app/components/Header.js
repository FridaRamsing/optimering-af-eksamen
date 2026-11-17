
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSide}>
        <Link href="/" className={styles.logo}>
          TicketMaster
        </Link>

        <nav className={styles.navigation}>
          <Link href="/kategori/musik">Musik</Link>
          <Link href="/kategori/sport">Sport</Link>
          <Link href="/kategori/underholdning">Underholdning</Link>
          <Link href="/kategori/oplevelse">Oplevelse</Link>
        </nav>
      </div>
    </header>
  );
}
