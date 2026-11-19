"use client"; // Bruger useEffect og kører animationen i browseren

import { useEffect } from "react";
import KoebLoading from "./KoebLoading"; // Overskrift + stjerne-streg + tekst (lavet af gruppen)
import StjerneBaggrund from "./StjerneBaggrund"; // Den blinkende stjernehimmel fra kategorisiden
import styles from "./BehandlerKoeb.module.css";

/* ==============================
   LOADING-OVERLAY: "Vi behandler dit køb"
   Vises oven på betalingssiden, efter man har trykket Betal.

   Hvorfor et overlay (komponent) og ikke en side for sig selv?
   - Brugeren bliver på /betaling, så ordren (event, pladser, pris) ikke går tabt
   - Teksten siger "Luk ikke siden" – det giver mening, fordi det ER den samme side
   - Genindlæser man en loading-side, ville den bare stå og loade uden et køb bagved

   Props:
   - onFaerdig: kaldes, når stjerne-animationen er kørt færdig (fx skift til bekræftelse)
   ============================== */
export default function BehandlerKoeb({ onFaerdig }) {
  useEffect(() => {
    // Ruller op, så headeren ses øverst – som i designet
    window.scrollTo(0, 0);

    // Låser scroll på siden bagved, mens overlayet vises
    document.body.style.overflow = "hidden";
    // Oprydning: scroll virker igen, når overlayet forsvinder
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.overlay}>
      {/* Stjernerne ligger bag teksten (z-index: -1 i StjerneBaggrund) */}
      <StjerneBaggrund />
      <KoebLoading onFaerdig={onFaerdig} />
    </div>
  );
}
