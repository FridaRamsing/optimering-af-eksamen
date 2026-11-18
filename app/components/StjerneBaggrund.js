import styles from "./StjerneBaggrund.module.css";

// Stjernehimmel bag indholdet på kategorisiden.
// 6 lag med prikker, der hver vipper og blinker i sin egen rytme (samme bevægelse som StjernerFooter).
// Al grafik og animation ligger i CSS, så komponenten behøver ingen JavaScript i browseren.
export default function StjerneBaggrund() {
  return (
    <div className={styles.himmel} aria-hidden="true">
      <span className={`${styles.lag} ${styles.lag1}`} />
      <span className={`${styles.lag} ${styles.lag2}`} />
      <span className={`${styles.lag} ${styles.lag3}`} />
      <span className={`${styles.lag} ${styles.lag4}`} />
      <span className={`${styles.lag} ${styles.lag5}`} />
      <span className={`${styles.lag} ${styles.lag6}`} />
    </div>
  );
}
