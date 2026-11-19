"use client"; // Formularen husker, hvad brugeren skriver (useState), så den skal køre i browseren

import { useState } from "react"; // Husker værdierne i felterne
import { useRouter } from "next/navigation"; // Sender brugeren videre til næste side
import Image from "next/image"; // Next's billed-komponent (optimerer billederne)
import BehandlerKoeb from "./BehandlerKoeb"; // Loading-overlayet "Vi behandler dit køb"
import styles from "./Betalingsformular.module.css";

// Kortmærkerne under kortnummer-feltet.
// Ligger uden for komponenten, fordi listen aldrig ændrer sig.
const kortmaerker = ["UnionPay", "Diners Club", "Discover", "JCB", "Mastercard", "VISA"];

// Tjekker om udløbsdatoen (fx "09/26") er i en måned, der er gået.
// Et kort virker hele sin udløbsmåned ud: "11/26" er gyldigt hele november 2026.
// Returnerer true, hvis kortet er udløbet.
function erUdloebet(udloeb) {
  if (udloeb.length !== 5) return false; // datoen er ikke skrevet færdig endnu

  const maaned = Number(udloeb.slice(0, 2)); // "09/26" → 9
  const aar = 2000 + Number(udloeb.slice(3)); // "09/26" → 2026

  // "Kalenderen": dagens dato fra computerens ur
  const nu = new Date();
  const detteAar = nu.getFullYear(); // fx 2026
  const denneMaaned = nu.getMonth() + 1; // getMonth() tæller fra 0 (januar = 0), derfor + 1

  // Udløbet, hvis året er gået – eller hvis det er i år, og måneden er gået
  return aar < detteAar || (aar === detteAar && maaned < denneMaaned);
}

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

  // Kortnummeret formateres som på en rigtig betalingsside: "1234 5678 9012 3456"
  function opdaterKortnummer(e) {
    const cifre = e.target.value
      .replace(/\D/g, "") // fjerner alt, der ikke er et ciffer (bogstaver, mellemrum osv.)
      .slice(0, 16); // stopklods: højst 16 cifre – resten smides væk

    // Sætter et mellemrum efter hver 4. ciffer.
    // match(/.{1,4}/g) deler teksten i bidder på op til 4 tegn: "12345" → ["1234", "5"]
    // join(" ") sætter dem sammen med mellemrum: "1234 5"
    // ?? [] bruges, når feltet er tomt (så giver match null)
    const formateret = (cifre.match(/.{1,4}/g) ?? []).join(" ");

    setFelter({ ...felter, kortnummer: formateret });
  }

  // Udløbsdatoen formateres som MM/ÅÅ: "1228" → "12/28"
  // Måneden skal være 01-12, året må være 00-99
  function opdaterUdloeb(e) {
    const alleCifre = e.target.value.replace(/\D/g, ""); // kun cifre

    // Vi bygger datoen op ét ciffer ad gangen og tjekker hvert ciffer
    let cifre = "";
    for (const c of alleCifre) {
      if (cifre.length === 0) {
        // 1. ciffer: en måned kan kun starte med 0 eller 1.
        // Skriver man fx 5, må det betyde maj → "05"
        cifre = c > "1" ? "0" + c : c;
      } else if (cifre.length === 1) {
        // 2. ciffer: måneden må ikke blive 00 eller over 12 – ellers ignoreres cifret
        const maaned = cifre + c;
        if (maaned !== "00" && Number(maaned) <= 12) cifre = maaned;
      } else if (cifre.length < 4) {
        // 3. og 4. ciffer: året – alle cifre er tilladt (00-99)
        cifre += c;
      }
      // Er der allerede 4 cifre, ignoreres resten (stopklods)
    }

    // Er der mere end 2 cifre, sættes "/" ind efter de første 2 (måneden)
    const formateret = cifre.length > 2 ? `${cifre.slice(0, 2)}/${cifre.slice(2)}` : cifre;

    setFelter({ ...felter, udloeb: formateret });
  }

  // Knappen virker først, når alle felter er udfyldt.
  // Object.values laver objektet om til en liste, og every tjekker, at ingen er tomme.
  // trim() fjerner mellemrum, så "   " ikke tæller som udfyldt.
  const alleUdfyldt = Object.values(felter).every((v) => v.trim() !== "");

  // Sikkerhedstjek af kortet
  const kortUdloebet = erUdloebet(felter.udloeb); // true = datoen er i fortiden
  const kortnummerKomplet = felter.kortnummer.replace(/\D/g, "").length === 16; // præcis 16 cifre
  const datoKomplet = felter.udloeb.length === 5; // hele MM/ÅÅ er skrevet

  // Man kan kun betale, når alt er udfyldt OG kortet er gyldigt
  const kanBetale = alleUdfyldt && kortnummerKomplet && datoKomplet && !kortUdloebet;

  // Om loading-overlayet vises (efter klik på Betal)
  const [behandler, setBehandler] = useState(false);

  // Kører, når formularen sendes (klik på Betal eller Enter i et felt)
  function betal(e) {
    e.preventDefault(); // Stopper browseren i at genindlæse siden
    if (kanBetale) {
      setBehandler(true); // Viser "Vi behandler dit køb" – siden skifter, når animationen er færdig
    }
  }

  // Prisen på dansk med komma og to decimaler: 800.8 → "800,80"
  const prisTekst = total.toLocaleString("da-DK", { minimumFractionDigits: 2 });

  return (
    // <form> + onSubmit: så virker både knappen og Enter-tasten
    <form id="kortbetaling" className={styles.kort} onSubmit={betal}>
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
          className={`${styles.medIkon} ${styles.ikonKortnummer}`}
          name="kortnummer"
          value={felter.kortnummer}
          onChange={opdaterKortnummer} // egen funktion, der laver mellemrum og stopper ved 16 cifre
          maxLength={19} // 16 cifre + 3 mellemrum
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
            className={`${styles.medIkon} ${styles.ikonUdloeb}`}
            name="udloeb"
            value={felter.udloeb}
            onChange={opdaterUdloeb} // sætter "/" ind efter måneden
            maxLength={5} // MM/ÅÅ = 5 tegn
            inputMode="numeric"
            placeholder="MM/ÅÅ"
            autoComplete="cc-exp"
            aria-invalid={kortUdloebet} // fortæller skærmlæsere, at feltet er forkert
            aria-describedby="udloeb-hjaelp"
          />
          {/* Er kortet udløbet, vises en rød fejl i stedet for hjælpeteksten.
              role="alert" gør, at skærmlæsere læser fejlen op med det samme */}
          {kortUdloebet ? (
            <small id="udloeb-hjaelp" className={styles.fejl} role="alert">
              Kortet er udløbet – brug et gyldigt kort
            </small>
          ) : (
            <small id="udloeb-hjaelp">På forsiden, format MM/ÅÅ</small>
          )}
        </label>
        <label className={styles.felt}>
          Sikkerhedskode
          <input
            className={`${styles.medIkon} ${styles.ikonCvc}`}
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
      <button type="submit" className={styles.betal} disabled={!kanBetale}>
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
        {/* Alt er udfyldt, men kortet er ikke gyldigt endnu */}
        {alleUdfyldt && !kanBetale && (
          <>
            Tjek kortnummer og udløbsdato
            <br />
          </>
        )}
        Dette er et simuleret køb, og der trækkes ingen penge.
      </p>

      {/* Loading-overlayet. Når stjerne-animationen er færdig, går vi videre til bekræftelsen */}
      {behandler && <BehandlerKoeb onFaerdig={() => router.push("/bekraeftelse")} />}
    </form>
  );
}
