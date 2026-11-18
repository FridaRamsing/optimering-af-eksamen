import Link from "next/link";
import Image from "next/image";
import MenuBar from "@/app/components/MenuBar";
import BrugerNavn from "@/app/components/BrugerNavn";
import FavoritListe from "@/app/components/FavoritListe";
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js.
// Layoutet er det samme som "Mine billetter", så profilsiderne hænger sammen.

export default function FavoritterPage() {
  return (
    <main className={styles.baggrund}>
      {/* Gradient-båndet øverst – ren pynt, ligger bag indholdet */}
      <div className={styles.baand}></div>

      <div className={styles.side}>
        {/* ===== VENSTRE KOLONNE – profilkort og menu (samme som Mine billetter) ===== */}
        <aside className={styles.venstre}>
          <div className={styles.profilkort}>
            <Image src="/assets/icons/ticketmaster-t.svg" alt="" width={18} height={33} />
            <div className={styles.velkommen}>
              <p className={styles.velkommenTekst}>Velkommen tilbage!</p>
              {/* Fornavnet på den bruger, der er logget ind – hentes fra Supabase */}
              <p className={styles.navn}>
                <BrugerNavn />
              </p>
            </div>
          </div>

          {/* Menuen – intet punkt er foldet ud, fordi favoritter ikke er et menupunkt */}
          <MenuBar startAaben={null} />
        </aside>

        {/* ===== HØJRE KOLONNE – overskrift og de likede kunstnere ===== */}
        <div className={styles.hoejre}>
          {/* Toppen – lige så høj som profilkortet, så den slutter ved båndets kant */}
          <div className={styles.top}>
            {/* Brødkrumme – viser hvor på siden man er */}
            <nav className={styles.broedkrumme} aria-label="Brødkrumme">
              <Link href="/">Forside</Link>/Mine favoritter
            </nav>

            {/* Hvid streg + overskrift i store bogstaver, som på Mine billetter */}
            <div className={styles.overskrift}>
              <div className={styles.streg}></div>
              <h1 className={styles.titel}>Mine favoritter</h1>
            </div>
          </div>

          {/* Listen over likede kunstnere – hentes i browseren, fordi login ligger dér */}
          <section className={styles.sektion}>
            <h2 className={styles.sektionTitel}>Kunstnere du har liket</h2>
            <FavoritListe />
          </section>
        </div>
      </div>
    </main>
  );
}
