import LoginKort from "./LoginKort";
import styles from "./KoebLogin.module.css";

// 750 → "750", 1450 → "1.450"
function kr(beloeb) {
  return beloeb.toLocaleString("da-DK");
}

/* ==============================
   KØB-LOGIN – login + "Din ordre" side om side
   Vises på /login, når man er midt i et køb og IKKE er logget ind.
   (Er man logget ind, sender LoginKort en videre til betalingen med det samme.)

   Props:
   - titel:     eventets titel
   - info:      "Tir 15. dec 2026 · 19:30 · Spillested, By"
   - pris:      prisen pr. billet
   - billetter: [{ raekke, plads }, ...] – én pr. valgt plads
   - videreTil: betalingssiden med ordren i URL'en – dit kommer man efter login
   ============================== */
export default function KoebLogin({ titel, info, pris, billetter, videreTil }) {
  const antal = billetter.length;
  const iAlt = antal * pris;

  return (
    <section className={styles.boks}>
      {/* ===== VENSTRE: login / opret profil =====
          indlejret: uden eget kort – boksen her har baggrunden
          springOverHvisLoggetInd: er man logget ind, ryger man direkte til betalingen */}
      <div className={styles.login}>
        <LoginKort videreTil={videreTil} indlejret springOverHvisLoggetInd />
      </div>

      {/* ===== HØJRE: Din ordre ===== */}
      <aside className={styles.ordre} aria-labelledby="koeb-ordre-titel">
        <h2 id="koeb-ordre-titel" className={styles.overskrift}>
          Din ordre
        </h2>

        {/* Billetbunke: den forreste billet + én grå bagved, hvis der er flere */}
        <div className={styles.bunke}>
          {antal > 1 && <div className={`${styles.miniBillet} ${styles.bagved}`} aria-hidden="true" />}

          <div className={styles.miniBillet}>
            <div className={styles.miniIndhold}>
              <p className={styles.miniTitel}>{titel}</p>
              <p className={styles.miniInfo}>{info}</p>
            </div>
            {/* Afrivningsdelen med prisen – stregen og hullerne laves i CSS */}
            <p className={styles.miniPris}>{kr(pris)} DKK</p>
          </div>
        </div>

        {/* "2 billetter" til venstre, "I alt 750 DKK" til højre */}
        <p className={styles.linje}>
          <span>
            {antal} {antal === 1 ? "billet" : "billetter"}
          </span>
          <strong>I alt {kr(iAlt)} DKK</strong>
        </p>

        <p className={styles.note}>
          Dine pladser er reserveret, mens du logger ind. Når tiden løber ud, frigives de igen.
        </p>
      </aside>
    </section>
  );
}
