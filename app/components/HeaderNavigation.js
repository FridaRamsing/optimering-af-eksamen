"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import MusicDropdown from "./MusicDropdown";
import SportDropdown from "./SportDropdown";
import UnderholdningDropdown from "./UnderholdningDropdown";
import OplevelseDropdown from "./OplevelseDropdown";

const categories = [
  { label: "Musik", href: "/kategori/musik", Dropdown: MusicDropdown },
  { label: "Sport", href: "/kategori/sport", Dropdown: SportDropdown },
  { label: "Underholdning", href: "/kategori/underholdning", Dropdown: UnderholdningDropdown },
  { label: "Oplevelse", href: "/kategori/oplevelse", Dropdown: OplevelseDropdown },
];

export default function HeaderNavigation() {
  const [menuDismissed, setMenuDismissed] = useState(false);

  return (
    <nav className={styles.navigation}>
      {categories.map(({ label, href, Dropdown }) => (
        <div
          className={styles.categoryItem}
          data-menu-dismissed={menuDismissed ? "true" : undefined}
          onMouseLeave={() => setMenuDismissed(false)}
          key={href}
        >
          <Link href={href} onClick={() => setMenuDismissed(true)}>
            {label}
          </Link>
          <Dropdown />
        </div>
      ))}
    </nav>
  );
}
