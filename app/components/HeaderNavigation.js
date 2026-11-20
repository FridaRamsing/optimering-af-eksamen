"use client";

// Komponenten kører på klientsiden, da vi bruger useState
// til at holde styr på, om en dropdown-menu er blevet lukket.

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

// Importerer de forskellige dropdown-menuer,
// som hører til hver kategori i navigationen.
import MusicDropdown from "./MusicDropdown";
import SportDropdown from "./SportDropdown";
import UnderholdningDropdown from "./UnderholdningDropdown";
import OplevelseDropdown from "./OplevelseDropdown";

// Opretter en liste med kategorierne i navigationen.
// Hver kategori har en titel, et link og en dropdown-komponent.
// På den måde slipper vi for at skrive den samme kode flere gange.
const categories = [
  { label: "Musik", href: "/kategori/musik", Dropdown: MusicDropdown },
  { label: "Sport", href: "/kategori/sport", Dropdown: SportDropdown },
  { label: "Underholdning", href: "/kategori/underholdning", Dropdown: UnderholdningDropdown },
  { label: "Oplevelse", href: "/kategori/oplevelse", Dropdown: OplevelseDropdown },
];

// Komponenten viser navigationen i headeren.
export default function HeaderNavigation() {

  // Holder styr på, om en menu er blevet lukket ved klik.
  // Som udgangspunkt er værdien false.
  const [menuDismissed, setMenuDismissed] = useState(false);

  return (
    // Navigationen får styling fra Header.module.css.
    <nav className={styles.navigation}>
      {/* Gennemgår alle kategorier og opretter
          et navigationselement for hver kategori. */}
      {categories.map(({ label, href, Dropdown }) => (
        <div
          className={styles.categoryItem}
          // Sender information om menuens tilstand til HTML-elementet.
          // Denne værdi kan bruges i CSS til at styre dropdown-menuen.
          data-menu-dismissed={menuDismissed ? "true" : undefined}
          // Når musen forlader kategorien, nulstilles menuens tilstand.
          onMouseLeave={() => setMenuDismissed(false)}
          // Giver hvert element en unik nøgle,
          // så React kan holde styr på elementerne.
          key={href}
        >
          {/* Linket sender brugeren videre til kategorisiden.
              Når der klikkes, sættes menuDismissed til true. */}
          <Link href={href} onClick={() => setMenuDismissed(true)}>
            {label}
          </Link>

          {/* Viser den dropdown-menu, der hører til kategorien.
              Komponenten vælges automatisk fra categories-listen. */}
          <Dropdown />
        </div>
      ))}
    </nav>
  );
}
