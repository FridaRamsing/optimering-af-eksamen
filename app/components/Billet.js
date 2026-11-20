import Image from "next/image";
import styles from "./Billet.module.css";

// Én billet i "Din ordre". Alle oplysningerne kommer som props fra arrayet i siden.
// { nr, titel, ... } pakker props ud, så vi kan skrive "titel" i stedet for "props.titel".
// Ingen "use client" – billetten viser kun data og har ingen state.
// visQr: true = QR-kode over prisen (Din ordre). false = "PRIS" over prisen (Dit valg på pladssiden)
export default function Billet({ nr, titel, info, omraade, raekke, plads, pris, visQr = true }) {
  return (
    // <article>, fordi billetten er en selvstændig ting, der giver mening alene
    <article className={styles.billet}>
      {/* Venstre: blå boks med nummeret */}
      <div className={styles.nummer}>#{nr}</div>

      {/* Midten: koncert og plads */}
      <div className={styles.midte}>
        <h3 className={styles.titel}>{titel}</h3>
        <p className={styles.info}>{info}</p>

        {/* <dl> = beskrivelsesliste: <dt> er overskriften (OMRÅDE), <dd> er værdien (Parket).
            Det passer præcis til "navn: værdi"-par, og skærmlæsere læser dem sammen. */}
        <dl className={styles.detaljer}>
          <div>
            <dt>Område</dt>
            <dd>{omraade}</dd>
          </div>
          <div>
            <dt>Række</dt>
            <dd>{raekke}</dd>
          </div>
          <div>
            <dt>Plads</dt>
            <dd>{plads}</dd>
          </div>
        </dl>
      </div>

      {/* Højre: QR-kode og pris – adskilt af en stiplet streg med "huller".
          QR-koden er pynt (alt=""), fordi den ikke er en rigtig, scanbar kode. */}
      <div className={styles.hoejre}>
        {/* Enten QR-koden eller den lille "PRIS"-overskrift */}
        {visQr ? (
          <Image src="/assets/icons/qr.svg" alt="" width={56} height={56} />
        ) : (
          <p className={styles.prisLabel}>Pris</p>
        )}
        <p className={styles.pris}>{pris} DKK</p>
      </div>
    </article>
  );
}
