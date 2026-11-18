import styles from "./IngenResultater.module.css";

export default function IngenResultater({ onRydFiltre }) {
  return (
    <div className={styles.boks}>
      <div className={styles.tekster}>
        <h2 className={styles.overskrift}>
          Vi fandt ingen forslag ud fra dine valg
        </h2>
        <p className={styles.undertekst}>
          Prøv at ændre eller fjerne et filter - så kan vi vise dig flere
          oplevelser
        </p>
      </div>

      {/* onRydFiltre er en funktion, som siden giver med – den rydder sidens filtre */}
      <button type="button" className={styles.knap} onClick={onRydFiltre}>
        Ryd alle filtre
      </button>
    </div>
  );
}
