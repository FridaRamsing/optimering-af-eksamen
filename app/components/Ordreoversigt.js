import Image from "next/image";
import Billet from "./Billet";
import styles from "./Ordreoversigt.module.css";

// Viser prisen på dansk: 800.8 → "800,80"
// Ligger i en funktion, fordi den bruges to gange (gebyr og samlet pris)
function kr(tal) {
  return tal.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// billetter, gebyr og total kommer fra siden, så tallene er de samme som på betal-knappen
export default function Ordreoversigt({ billetter, gebyr, total }) {
  return (
    // <section>, fordi "Din ordre" er et selvstændigt afsnit med egen overskrift
    <section className={styles.kort}>
      <h2 className={styles.overskrift}>Din ordre</h2>

      {/* Én billet pr. objekt i arrayet.
          key: React skal kunne kende billetterne fra hinanden.
          {...b}: sender alle felterne (nr, titel, pris ...) som hver sin prop */}
      <div className={styles.billetter}>
        {billetter.map((b) => (
          <Billet key={b.nr} {...b} />
        ))}
      </div>

      {/* billetter.length = antallet af billetter, så teksten altid passer */}
      <p className={styles.antal}>
        {billetter.length} billetter · giver adgang for {billetter.length} personer
      </p>

      {/* Forenklet tegning af salen – pyntegrafik, derfor aria-hidden */}
      <div className={styles.sal} aria-hidden="true">
        <div className={styles.salVenstre} />
        <div className={styles.salMidte}>
          <Image src="/assets/icons/Locationikon.svg" alt="" width={17} height={22} className={styles.pin} />
        </div>
        <div className={styles.salHoejre} />
      </div>

      {/* Prislinjer – én linje pr. billet med række, plads og pris */}
      <ul className={styles.linjer}>
        {billetter.map((b) => (
          <li key={b.nr}>
            <span>
              Række {b.raekke} · Plads {b.plads}
            </span>
            <span>{b.pris} DKK</span>
          </li>
        ))}
      </ul>

      {/* Gebyr og samlet pris – to klasser på én gang: .linje (tekst venstre, pris højre)
          og .gebyr/.total (farve og størrelse) */}
      <p className={`${styles.linje} ${styles.gebyr}`}>
        <span>Gebyrer</span>
        <span>{kr(gebyr)} DKK</span>
      </p>

      <p className={`${styles.linje} ${styles.total}`}>
        <span>Samlet pris</span>
        <span>{kr(total)} DKK</span>
      </p>
    </section>
  );
}
