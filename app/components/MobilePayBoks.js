"use client"; // Knappen skal kunne åbne overlayet, så komponenten kører i browseren

import { useState } from "react";
import Image from "next/image";
import BetalingFejlet from "./BetalingFejlet";
import styles from "./MobilePayBoks.module.css";

/* ==============================
   MOBILEPAY-KASSEN på betalingssiden
   Der er ingen rigtig MobilePay-forbindelse, så "Vælg" viser altid
   overlayet "Betalingen gik ikke igennem".
   ============================== */
export default function MobilePayBoks() {
  // Om fejl-overlayet er åbent
  const [visFejl, setVisFejl] = useState(false);

  // "Vælg en anden metode": luk overlayet og send brugeren op til kortbetalingen
  function andenMetode() {
    setVisFejl(false);
    const kortform = document.getElementById("kortbetaling"); // id står på <form> i Betalingsformular
    kortform?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Sætter markøren i første felt (kortnummer), så man kan skrive med det samme
    kortform?.querySelector("input")?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className={styles.mobilepay}>
        <Image src="/assets/icons/mobilePaylogo.svg" alt="" width={48} height={48} />
        <h2>MobilePay</h2>
        <button type="button" className={styles.vaelg} onClick={() => setVisFejl(true)}>
          Vælg
        </button>
      </div>

      {/* Overlayet – "Prøv igen" lukker det, så man kan trykke "Vælg" igen */}
      <BetalingFejlet
        aaben={visFejl}
        onProevIgen={() => setVisFejl(false)}
        onAndenMetode={andenMetode}
        onLuk={() => setVisFejl(false)}
      />
    </>
  );
}
