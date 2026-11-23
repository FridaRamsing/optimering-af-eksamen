"use client"; // Kortet husker valgt fane og felter (useState), så det skal køre i browseren

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Sender brugeren videre efter login
import { supabase } from "@/lib/supabase"; // Supabase har indbygget login (Auth)
import styles from "./LoginKort.module.css";

// Felterne starter tomme – bruges både ved start og når man skifter fane
const tommeFelter = {
  fornavn: "",
  efternavn: "",
  email: "",
  adgangskode: "",
  accepterer: false,
};

// Oversætter Supabase's fejlkoder til dansk, så brugeren ved, hvad der er galt.
// Kendes koden ikke, vises Supabase's egen (engelske) besked.
function fejlTekst(error) {
  const tekster = {
    user_already_exists: "Der findes allerede en profil med den e-mail. Prøv at logge ind.",
    email_exists: "Der findes allerede en profil med den e-mail. Prøv at logge ind.",
    email_address_invalid: "E-mailen er ikke gyldig.",
    weak_password: "Adgangskoden er for svag. Brug mindst 8 tegn med både bogstaver og tal.",
    over_email_send_rate_limit: "Der er sendt for mange e-mails. Vent lidt og prøv igen.",
    signup_disabled: "Det er ikke muligt at oprette profiler lige nu.",
    email_provider_disabled: "Login med e-mail er slået fra i Supabase.",
    invalid_credentials: "Forkert e-mail eller adgangskode.",
    email_not_confirmed: "Du skal bekræfte din e-mail, før du kan logge ind.",
  };
  return tekster[error.code] ?? error.message;
}

// videreTil: hvor brugeren sendes hen efter login (forsiden eller betalingen)
// indlejret: true = kortet ligger inde i en anden boks (KoebLogin) og skal ikke have sin egen baggrund
// springOverHvisLoggetInd: true = er man allerede logget ind, sendes man videre med det samme
export default function LoginKort({ videreTil, indlejret = false, springOverHvisLoggetInd = false }) {
  const router = useRouter();

  // Hvilken fane er valgt: "login" eller "opret"
  const [fane, setFane] = useState("login");

  // Alle felterne i ét objekt – samme måde som i Betalingsformular
  const [felter, setFelter] = useState(tommeFelter);

  // Besked under knappen – type "fejl" er rød, "info" er grå
  const [besked, setBesked] = useState(null);

  // true, mens vi venter på svar fra Supabase – så kan man ikke klikke to gange
  const [venter, setVenter] = useState(false);

  // I købsflowet: er man allerede logget ind, skal man ikke se login – videre til betalingen.
  // router.replace (ikke push), så tilbage-knappen ikke sender en tilbage til login igen
  useEffect(() => {
    if (!springOverHvisLoggetInd) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(videreTil);
    });
  }, [springOverHvisLoggetInd, videreTil, router]);

  // Opdaterer det felt, der skrives i.
  // Checkboxe har "checked" (true/false) i stedet for "value".
  function opdater(e) {
    const { name, type, value, checked } = e.target;
    setFelter({ ...felter, [name]: type === "checkbox" ? checked : value });
  }

  // Skifter fane og nulstiller beskeden (felterne bevares, så e-mailen ikke skal skrives igen)
  function skiftFane(nyFane) {
    setFane(nyFane);
    setBesked(null);
  }

  // Knappen virker først, når de nødvendige felter er udfyldt
  const kanLogge = felter.email.trim() !== "" && felter.adgangskode !== "";
  const kanOprette =
    felter.fornavn.trim() !== "" &&
    felter.efternavn.trim() !== "" &&
    felter.email.trim() !== "" &&
    felter.adgangskode.length >= 8 &&
    felter.accepterer;

  /* ===== LOG IND ===== */
  async function logInd(e) {
    e.preventDefault(); // Stopper browseren i at genindlæse siden
    setVenter(true);
    setBesked(null);

    // Spørger Supabase, om e-mail og adgangskode passer
    const { error } = await supabase.auth.signInWithPassword({
      email: felter.email,
      password: felter.adgangskode,
    });

    setVenter(false);

    if (error) {
      if (error.code !== "invalid_credentials") {
        console.error("Login fejlede:", error);
      }
      setBesked({ type: "fejl", tekst: fejlTekst(error) });
      return;
    }

    router.push(videreTil); // Logget ind → videre
  }

  /* ===== OPRET PROFIL ===== */
  async function opret(e) {
    e.preventDefault();
    setVenter(true);
    setBesked(null);

    // Opretter brugeren i Supabase. Fornavn og efternavn gemmes på brugeren under "data".
    const { data, error } = await supabase.auth.signUp({
      email: felter.email,
      password: felter.adgangskode,
      options: {
        data: { fornavn: felter.fornavn, efternavn: felter.efternavn },
      },
    });

    setVenter(false);

    if (error) {
      console.error("Oprettelse fejlede:", error); // Hele fejlen i browserens konsol (F12)
      setBesked({ type: "fejl", tekst: fejlTekst(error) });
      return;
    }

    // Er "Confirm email" slået til i Supabase, får man ingen session, før mailen er bekræftet
    if (!data.session) {
      setBesked({ type: "info", tekst: "Tjek din e-mail og bekræft din profil, før du logger ind." });
      return;
    }

    router.push(videreTil); // Oprettet og logget ind → videre
  }

  /* ===== GLEMT ADGANGSKODE ===== */
  async function glemtKode() {
    if (felter.email.trim() === "") {
      setBesked({ type: "fejl", tekst: "Skriv din e-mail ovenfor først." });
      return;
    }
    // Supabase sender en mail med et link til at vælge ny adgangskode
    await supabase.auth.resetPasswordForEmail(felter.email);
    setBesked({ type: "info", tekst: "Hvis e-mailen findes, har vi sendt et link til ny adgangskode." });
  }

  /* ===== PASSKEY =====
     Supabase understøtter ikke passkeys direkte, så knappen er kun design indtil videre. */
  function passkey() {
    setBesked({ type: "info", tekst: "Log på med Passkey kommer snart." });
  }

  return (
    // Indlejret: uden baggrund og kant (boksen udenom har dem i forvejen)
    <section className={indlejret ? styles.indlejret : styles.kort}>
      {/* ===== FANERNE =====
          type="button": ellers ville knapperne sende formularen.
          aria-pressed: fortæller skærmlæsere, hvilken fane der er valgt. */}
      <div className={styles.faner}>
        <button
          type="button"
          className={fane === "login" ? styles.aktivFane : styles.fane}
          aria-pressed={fane === "login"}
          onClick={() => skiftFane("login")}
        >
          Log ind
        </button>
        <button
          type="button"
          className={fane === "opret" ? styles.aktivFane : styles.fane}
          aria-pressed={fane === "opret"}
          onClick={() => skiftFane("opret")}
        >
          Opret profil
        </button>
      </div>

      {/* Viser det ene eller det andet indhold ud fra den valgte fane */}
      {fane === "login" ? (
        /* ================= LOG IND ================= */
        <form className={styles.formular} onSubmit={logInd}>
          {/* <h1>, fordi det er sidens hovedoverskrift – der er ingen anden titel */}
          <h1 className={styles.overskrift}>Velkommen tilbage</h1>
          <p className={styles.undertekst}>Log ind for at købe dine billetter.</p>

          {/* type="email": browseren tjekker @, og mobilen viser @-tastaturet.
              autoComplete: password-managere kan udfylde felterne. */}
          <label className={styles.felt}>
            E-mail
            <input
              type="email"
              name="email"
              value={felter.email}
              onChange={opdater}
              placeholder="E-mail"
              autoComplete="email"
            />
          </label>

          <label className={styles.felt}>
            Adgangskode
            <input
              type="password"
              name="adgangskode"
              value={felter.adgangskode}
              onChange={opdater}
              placeholder="Adgangskode"
              autoComplete="current-password"
            />
          </label>

          {/* En knap, der ligner et link – den sender en mail i stedet for at skifte side */}
          <button type="button" className={`${styles.linkKnap} ${styles.glemt}`} onClick={glemtKode}>
            Glemt adgangskode?
          </button>

          <button type="submit" className={styles.knap} disabled={!kanLogge || venter}>
            {venter ? "Logger ind..." : "Log ind"}
          </button>

          {/* Beskeden – role="alert" får skærmlæsere til at læse den op */}
          {besked && (
            <p className={besked.type === "fejl" ? styles.fejl : styles.info} role="alert">
              {besked.tekst}
            </p>
          )}

          {/* "—— eller ——" – stregerne laves med ::before og ::after i CSS */}
          <p className={styles.skille}>eller</p>

          <button type="button" className={styles.knapKant} onClick={passkey}>
            Log på med Passkey
          </button>

          <p className={styles.skift}>
            Ny her?{" "}
            {/* Skifter fane – derfor en knap og ikke et link */}
            <button type="button" className={styles.linkKnap} onClick={() => skiftFane("opret")}>
              Opret en profil på et øjeblik
            </button>
          </p>
        </form>
      ) : (
        /* ================= OPRET PROFIL ================= */
        <form className={styles.formular} onSubmit={opret}>
          <h1 className={styles.overskrift}>Opret profil</h1>
          <p className={styles.undertekst}>Det tager kun et øjeblik.</p>

          {/* Fornavn og efternavn ved siden af hinanden */}
          <div className={styles.raekke}>
            <label className={styles.felt}>
              Fornavn
              <input
                name="fornavn"
                value={felter.fornavn}
                onChange={opdater}
                placeholder="Fornavn"
                autoComplete="given-name"
              />
            </label>
            <label className={styles.felt}>
              Efternavn
              <input
                name="efternavn"
                value={felter.efternavn}
                onChange={opdater}
                placeholder="Efternavn"
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className={styles.felt}>
            E-mail
            <input
              type="email"
              name="email"
              value={felter.email}
              onChange={opdater}
              placeholder="E-mail"
              autoComplete="email"
            />
          </label>

          {/* "new-password": browseren foreslår en stærk adgangskode */}
          <label className={styles.felt}>
            Adgangskode
            <input
              type="password"
              name="adgangskode"
              value={felter.adgangskode}
              onChange={opdater}
              placeholder="Adgangskode"
              autoComplete="new-password"
              minLength={8}
            />
            <small>Mindst 8 tegn</small>
          </label>

          {/* Checkbox – skal være sat, før man kan oprette */}
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="accepterer"
              checked={felter.accepterer}
              onChange={opdater}
            />
            Jeg accepterer betingelserne for køb
          </label>

          <button type="submit" className={styles.knap} disabled={!kanOprette || venter}>
            {venter ? "Opretter..." : "Opret profil"}
          </button>

          {besked && (
            <p className={besked.type === "fejl" ? styles.fejl : styles.info} role="alert">
              {besked.tekst}
            </p>
          )}

          <p className={styles.skift}>
            Har du allerede en profil?{" "}
            <button type="button" className={styles.linkKnap} onClick={() => skiftFane("login")}>
              Log ind
            </button>
          </p>
        </form>
      )}
    </section>
  );
}
