

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">Logo</Link>
      <nav>
        <Link href="/events">Events</Link>
        <Link href="/mine-billetter">Mine billetter</Link>
        <Link href="/login">Log ind</Link>
      </nav>
    </header>
  );
}
