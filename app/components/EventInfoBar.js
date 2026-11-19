import Image from "next/image";
import styles from "./EventInfoBar.module.css";

export default function EventInfoBar({ event, foersteDato }) {
  // "2026-12-14T19:30:00" → "14/12/2026"
  const dato = new Date(foersteDato.starts_at)
    .toLocaleDateString("da-DK", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replaceAll(".", "/");

  const fakta = [
    { label: "Datoer", vaerdi: dato, ikon: "kalender.svg" },
    { label: "Spillested", vaerdi: event.spillested, ikon: "sted.svg" },
    { label: "Varighed", vaerdi: event.varighed, ikon: "ur.svg" },
    { label: "Alder", vaerdi: event.alder, ikon: "billet.svg" },
  ];

  return (
    <dl className={styles.bar}>
      {/* Tomme felter (fx ingen varighed i Supabase) vises ikke */}
      {fakta
        .filter((punkt) => punkt.vaerdi)
        .map((punkt) => (
          <div key={punkt.label} className={styles.punkt}>
            <Image src={`/assets/icons/${punkt.ikon}`} alt="" width={20} height={20} />
            <div>
              <dt className={styles.label}>{punkt.label}</dt>
              <dd className={styles.vaerdi}>{punkt.vaerdi}</dd>
            </div>
          </div>
        ))}
    </dl>
  );
}
