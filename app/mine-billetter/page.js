import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuBar from "../components/MenuBar";

export default function MineBilletterPage() {
  return (
    <main className={styles.baggrund}>
      {/* Gradient-båndet øverst – ren pynt, ligger bag indholdet */}
      <div className={styles.baand}></div>

      <div className={styles.side}>
        {/* Venstre kolonne – profilkort og menu (trin 6 og 7) */}
        <aside className={styles.venstre}>
          {/* Profilkort */}
          <div className={styles.profilkort}>
            <Image
              src="/assets/icons/ticketmaster-t.svg"
              alt=""
              width={18}
              height={33}
            />
            <div className={styles.velkommen}>
              <p className={styles.velkommenTekst}>Velkommen tilbage!</p>
              <p className={styles.navn}>Maja</p>
            </div>
          </div>

          {/* Menu – egen komponent, fordi den skal kunne foldes ud */}
          <MenuBar startAaben="Mine billetter" />
        </aside>

        {/* Højre kolonne – overskrift, faner og billetter (trin 4 og 5) */}
        <div className={styles.hoejre}>
          {/* Toppen – lige så høj som profilkortet, så den slutter ved båndets kant */}
          <div className={styles.top}>
            {/* Brødkrumme – viser hvor på siden man er */}
            <nav className={styles.broedkrumme} aria-label="Brødkrumme">
              <Link href="/">Forside</Link>/Mine billetter
            </nav>

            {/* Streg, overskrift og faner */}
            <div className={styles.overskrift}>
              <div className={styles.streg}></div>
              <h1 className={styles.titel}>Mine billetter</h1>

              <div className={styles.faner}>
                <button type="button" className={`${styles.fane} ${styles.aktiv}`}>
                  Kommende arrangementer
                </button>
                <button type="button" className={styles.fane}>
                  Tidligere arrangementer
                </button>
                <button type="button" className={styles.fane}>
                  Medlemskaber
                </button>
              </div>
            </div>
          </div>

          {/* Næste arrangement – billetterne kommer fra Supabase senere */}
          <section className={styles.naesteArrangement}>
            <h2 className={styles.sektionTitel}>Næste arrangement</h2>

            {/* PLACEHOLDER – udskiftes med <Billet /> i en senere branch */}
            <div className={styles.billetPlaceholder}>Billet</div>
            <div className={styles.billetPlaceholder}>Billet</div>
          </section>
        </div>
      </div>
    </main>
  );
}
