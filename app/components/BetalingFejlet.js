"use client"; // Overlayet åbnes/lukkes ved klik, så det skal køre i browseren

import { useEffect, useRef } from "react";
import styles from "./BetalingFejlet.module.css";

/* ==============================
   OVERLAY: "Betalingen gik ikke igennem"

   Bygget med HTML's eget <dialog>-element, fordi browseren så giver os gratis:
   - mørk baggrund bag boksen (::backdrop i CSS)
   - fokus fanges i boksen, så Tab ikke hopper ud på siden bagved
   - Escape lukker boksen
   - skærmlæsere ved, at det er en dialog

   Props:
   - aaben:          true/false – om overlayet skal vises
   - onProevIgen:    kaldes ved klik på "Prøv igen"
   - onAndenMetode:  kaldes ved klik på "Vælg en anden metode"
   - onLuk:          kaldes når boksen lukkes på anden måde (fx Escape)
   ============================== */
export default function BetalingFejlet({ aaben, onProevIgen, onAndenMetode, onLuk }) {
  // useRef giver adgang til selve <dialog>-elementet i DOM'en
  const dialogRef = useRef(null);

  // Når "aaben" skifter, åbner eller lukker vi dialogen.
  // showModal() = åbn som overlay (med baggrund og fokus-fælde).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (aaben && !dialog.open) dialog.showModal();
    if (!aaben && dialog.open) dialog.close();
  }, [aaben]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onLuk} // fx når man trykker Escape
      aria-labelledby="betaling-fejlet-titel"
      aria-describedby="betaling-fejlet-tekst"
    >
      <h2 id="betaling-fejlet-titel" className={styles.titel}>
        Betalingen gik ikke igennem
      </h2>
      <p id="betaling-fejlet-tekst" className={styles.tekst}>
        Tjek dine oplysninger, og prøv igen. Dine billetter er stadig reserveret.
      </p>

      {/* To lige brede knapper ved siden af hinanden */}
      <div className={styles.knapper}>
        {/* autoFocus: tastaturet starter på "Prøv igen", når boksen åbner */}
        <button type="button" className={styles.proevIgen} onClick={onProevIgen} autoFocus>
          Prøv igen
        </button>
        <button type="button" className={styles.andenMetode} onClick={onAndenMetode}>
          Vælg en anden metode
        </button>
      </div>
    </dialog>
  );
}
