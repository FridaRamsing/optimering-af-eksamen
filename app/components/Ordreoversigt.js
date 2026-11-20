import Image from "next/image";
import Billet from "./Billet";
import { pinPlacering } from "@/lib/sal"; // Regner ud, hvor pinnen skal stå
import styles from "./Ordreoversigt.module.css";

// Viser prisen på dansk: 800.8 → "800,80"
// Ligger i en funktion, fordi den bruges to gange (gebyr og samlet pris)
function kr(tal) {
  return tal.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// billetter, gebyr og total kommer fra siden, så tallene er de samme som på betal-knappen
export default function Ordreoversigt({ billetter, gebyr, total }) {
  // Hvor pinnen skal stå: hvilket område og hvor i det (i procent) – ud fra de valgte pladser
  const pin = pinPlacering(billetter);

  // Pinnen som element – placeres med left/top i procent af området.
  // calc(... - 8.5px) og calc(... - 22px): pinnens SPIDS (bunden i midten) skal pege på pladsen,
  // ikke dens øverste venstre hjørne (pinnen er 17px bred og 22px høj)
  const pinBillede = (
    <Image
      src="/assets/icons/Locationikon.svg"
      alt=""
      width={17}
      height={22}
      className={styles.pin}
      style={{ left: `calc(${pin.x}% - 8.5px)`, top: `calc(${pin.y}% - 22px)` }}
    />
  );

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

      {/* Forenklet tegning af salen: Scene | Gulv | Balkon – pyntegrafik, derfor aria-hidden.
          Pinnen sættes ind i det område, pladserne ligger i */}
      <div className={styles.sal} aria-hidden="true">
        <div className={styles.salVenstre} />
        <div className={styles.salMidte}>{pin.omraade === "gulv" && pinBillede}</div>
        <div className={styles.salHoejre}>{pin.omraade === "balkon" && pinBillede}</div>
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
