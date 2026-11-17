
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">Logo</Link>
      <nav>
        <Link href="/events">Events</Link>
        <Link href="/mine-billetter">Mine billetter</Link>
        <Link href="/login">Log ind</Link>
      </nav>
    </header>
  );
}
