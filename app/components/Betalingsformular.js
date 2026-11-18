"use client"; // Formularen husker, hvad brugeren skriver (useState), så den skal køre i browseren

import { useState } from "react"; // Husker værdierne i felterne
import { useRouter } from "next/navigation"; // Sender brugeren videre til næste side
import Image from "next/image"; // Next's billed-komponent (optimerer billederne)
import styles from "./Betalingsformular.module.css";

// Kortmærkerne under kortnummer-feltet.
// Ligger uden for komponenten, fordi listen aldrig ændrer sig.
const kortmaerker = ["UnionPay", "Diners Club", "Discover", "JCB", "Mastercard", "VISA"];

// total: prisen fra siden, så knappen viser det rigtige beløb
export default function Betalingsformular({ total }) {
  const router = useRouter(); // Bruges i betal() til at skifte side

  // Ét objekt med alle felterne – alle starter tomme, undtagen land (Danmark)
  const [felter, setFelter] = useState({
    kortnummer: "",
    udloeb: "",
    cvc: "",
    navn: "",
    land: "DK",
    gade: "",
    husnr: "",
    postnr: "",
    by: "",
  });

  // Én funktion opdaterer alle felter – name="" på inputtet bestemmer hvilket.
  // ...felter kopierer de gamle værdier, så kun det ene felt bliver ændret.
  function opdater(e) {
    setFelter({ ...felter, [e.target.name]: e.target.value });
  }

  // Knappen virker først, når alle felter er udfyldt.
  // Object.values laver objektet om til en liste, og every tjekker, at ingen er tomme.
  // trim() fjerner mellemrum, så "   " ikke tæller som udfyldt.
  const alleUdfyldt = Object.values(felter).every((v) => v.trim() !== "");

  // Kører, når formularen sendes (klik på Betal eller Enter i et felt)
  function betal(e) {
    e.preventDefault(); // Stopper browseren i at genindlæse siden
    if (alleUdfyldt) {
      router.push("/koe"); // Videre til næste side i flowet
    }
  }

  // Prisen på dansk med komma og to decimaler: 800.8 → "800,80"
  const prisTekst = total.toLocaleString("da-DK", { minimumFractionDigits: 2 });

  return (
    // <form> + onSubmit: så virker både knappen og Enter-tasten
    <form className={styles.kort} onSubmit={betal}>
      {/* Overskrift – alt="" fordi ikonet kun er pynt ved siden af teksten */}
      <div className={styles.overskrift}>
        <Image src="/assets/icons/kort.svg" alt="" width={43} height={35} />
        <h2>Kortbetaling</h2>
      </div>
      <p className={styles.note}>Alle felter er obligatoriske, medmindre andet er markeret.</p>

      {/* Kortnummer
          <label> rundt om: man kan klikke på teksten for at komme ind i feltet,
          og skærmlæsere ved, hvad feltet hedder.
          value + onChange: React styrer, hvad der står i feltet ("controlled input").
          inputMode="numeric": mobiler viser et tal-tastatur.
          autoComplete="cc-...": browseren kan udfylde gemte kortoplysninger. */}
      <label className={styles.felt}>
        Kortnummer
        <input
          className={styles.medIkon}
          name="kortnummer"
          value={felter.kortnummer}
          onChange={opdater}
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          autoComplete="cc-number"
        />
      </label>

      {/* Kortmærkerne – én "pill" pr. navn i listen øverst */}
      <ul className={styles.maerker}>
        {kortmaerker.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      {/* Udløbsdato + sikkerhedskode – to lige brede felter (.lige)
          <small> er den lille grå hjælpetekst under feltet */}
      <div className={`${styles.raekke} ${styles.lige}`}>
        <label className={styles.felt}>
          Udløbsdato
          <input
            className={styles.medIkon}
            name="udloeb"
            value={felter.udloeb}
            onChange={opdater}
            placeholder="MM/ÅÅ"
            autoComplete="cc-exp"
          />
          <small>På forsiden, format MM/ÅÅ</small>
        </label>
        <label className={styles.felt}>
          Sikkerhedskode
          <input
            className={styles.medIkon}
            name="cvc"
            value={felter.cvc}
            onChange={opdater}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
          />
          <small>3 cifre på bagsiden af kortet</small>
        </label>
      </div>

      {/* Navn – .ekstraLuft giver den ekstra afstand over feltet, som i Figma */}
      <label className={`${styles.felt} ${styles.ekstraLuft}`}>
        Navn på kort
        <input
          name="navn"
          value={felter.navn}
          onChange={opdater}
          placeholder="Fornavn Efternavn"
          autoComplete="cc-name"
        />
      </label>

      {/* Adresse – <h3>, fordi den ligger under <h2>Kortbetaling</h2> */}
      <h3 className={styles.underoverskrift}>Faktureringsadresse</h3>

      {/* Land – en dropdown. value="DK" er det, der gemmes; "Danmark" er det, man ser */}
      <label className={styles.felt}>
        Land/region
        <select name="land" value={felter.land} onChange={opdater}>
          <option value="DK">Danmark</option>
          <option value="SE">Sverige</option>
          <option value="NO">Norge</option>
        </select>
      </label>

      {/* Gade + husnummer – gaden er dobbelt så bred (.gade) */}
      <div className={`${styles.raekke} ${styles.gade}`}>
        <label className={styles.felt}>
          Gade
          <input name="gade" value={felter.gade} onChange={opdater} placeholder="Gade" />
        </label>
        <label className={styles.felt}>
          Husnummer
          <input name="husnr" value={felter.husnr} onChange={opdater} placeholder="Nr." />
        </label>
      </div>

      {/* Postnummer + by – byen er dobbelt så bred (.postnr) */}
      <div className={`${styles.raekke} ${styles.postnr}`}>
        <label className={styles.felt}>
          Postnummer
          <input
            name="postnr"
            value={felter.postnr}
            onChange={opdater}
            placeholder="0000"
            inputMode="numeric"
          />
        </label>
        <label className={styles.felt}>
          By
          <input name="by" value={felter.by} onChange={opdater} placeholder="By" />
        </label>
      </div>

      {/* Betal-knappen – er mørk (disabled), indtil alt er udfyldt.
          type="submit" gør, at et klik kører betal() via formularens onSubmit */}
      <button type="submit" className={styles.betal} disabled={!alleUdfyldt}>
        <Image src="/assets/icons/leas.svg" alt="" width={14} height={18} />
        Betal {prisTekst} kr.
      </button>

      {/* Småtekst under knappen.
          && betyder: vis kun "Udfyld alle felter..." så længe noget mangler.
          <> </> (fragment) samler teksten og <br /> uden et ekstra element. */}
      <p className={styles.smaatekst}>
        {!alleUdfyldt && (
          <>
            Udfyld alle felter for at betale
            <br />
          </>
        )}
        Dette er et simuleret køb, og der trækkes ingen penge.
      </p>
    </form>
  );
}
