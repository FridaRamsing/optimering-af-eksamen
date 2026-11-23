import { ALDER_MIN, ALDER_MAX } from "@/lib/maalgruppe";
import styles from "./AlderSkyder.module.css";

// Fælles skyder til formularen og topbaren. Forælderen ejer værdien.
// onSlip er valgfri: topbaren bruger den til først at hente kort, når man slipper
export default function AlderSkyder({ id, vaerdi, onChange, onSlip }) {
  // Hvor langt håndtaget er trukket. CSS bruger det til den hvide del af sporet
  const procent = ((vaerdi - ALDER_MIN) / (ALDER_MAX - ALDER_MIN)) * 100;

  return (
    <input
      id={id}
      type="range"
      min={ALDER_MIN}
      max={ALDER_MAX}
      value={vaerdi}
      onChange={(e) => onChange(Number(e.target.value))}
      onPointerUp={onSlip}
      onKeyUp={onSlip}
      aria-valuetext={`${vaerdi} år`}
      className={styles.skyder}
      style={{ "--fyld": `${procent}%` }}
    />
  );
}
