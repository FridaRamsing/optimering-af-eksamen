import { Suspense } from "react";
import Trinlinje from "@/app/components/Trinlinje";
import LoginKort from "@/app/components/LoginKort";
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js.

/* ==============================
   INDHOLDET – læser URL'en, derfor inde i <Suspense> (cacheComponents)

   Siden bruges på to måder:
   1. Fra bruger-ikonet i headeren: /login
      → kun login-kortet, og man sendes til profilsiden (Mine billetter) bagefter
   2. Midt i et køb: /login?event=12&omraade=Parket&pladser=E-7,E-8
      → trinlinjen vises, og man sendes videre til betalingen med samme ordre
   ============================== */
async function LoginIndhold({ searchParams }) {
  const { event, omraade, pladser } = await searchParams;

  // Er der et event i URL'en, er man midt i et køb
  const iKoebsflow = Boolean(event);

  // Hvor brugeren skal hen efter login:
  // - midt i et køb → videre til betalingen med ordren, så den ikke går tabt
  // - ellers → profilsiden, hvor brugerens billetter ligger
  const videreTil = iKoebsflow
    ? `/betaling?event=${event}&omraade=${omraade ?? "Parket"}&pladser=${pladser ?? ""}`
    : "/mine-billetter";

  return (
    <>
      {/* Trinlinjen hører kun til købsflowet – trin 2 = Login/opret bruger */}
      {iKoebsflow && <Trinlinje aktivtTrin={2} />}

      <main className={styles.side}>
        <LoginKort videreTil={videreTil} />
      </main>
    </>
  );
}

/* ==============================
   SIDEN
   ============================== */
export default function LoginPage({ searchParams }) {
  return (
    <Suspense fallback={<main className={styles.side} />}>
      <LoginIndhold searchParams={searchParams} />
    </Suspense>
  );
}
