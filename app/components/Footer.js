import styles from "./Footer.module.css";
import Image from "next/image";
import StjernerFooter from "./StjernerFooter";
import Link from "next/link";

/* ==============================
   DATA – teksterne og ikonerne i footeren
   Ligger uden for komponenten, fordi de aldrig ændrer sig.
   Så bliver de kun lavet én gang, og HTML'en nedenfor
   kan bruge .map() i stedet for at gentage den samme kode.
   ============================== */

// Sociale medier – hvert objekt har et navn (bruges som alt-tekst) og en sti til ikonet
const sociale = [
  { navn: "Facebook", ikon: "/assets/icons/facebook.svg" },
  { navn: "Instagram", ikon: "/assets/icons/instagram.svg" },
  { navn: "TikTok", ikon: "/assets/icons/tiktok.svg" },
  { navn: "Blog", ikon: "/assets/icons/blog.svg" },
  { navn: "LinkedIn", ikon: "/assets/icons/linkedin.svg" },
];

// De 4 kolonner i højre side – hver kolonne har en overskrift og en liste af punkter
const kolonner = [
  {
    titel: "Vores netværk",
    punkter: ["Live Nation", "Salgssteder"],
  },
  {
    titel: "Har du brug for hjælp?",
    punkter: [
      "Hjælp",
      "Kontakt os",
      "Levering/afhentning",
      "Gebyrer",
      "Om billetsvindel",
      "Om store billetsalg (onsales)",
      "Gavekort og resale",
      "Collector Card",
      "Platinum-billetter",
    ],
  },
  {
    titel: "Arrangører / samarbejdspartnere",
    punkter: [
      "Arrangør? Sælg dine billetter hos os!",
      "Arrangørsite",
      "Annoncering",
      "Bliv Affiliate",
    ],
  },
  {
    titel: "Om os",
    punkter: ["Om os", "Ledige stillinger"],
  },
];

// De grå tekster nederst – stregerne "|" imellem dem laves i CSS
const bundTekster = [
  "Betingelser for køb",
  "Persondatapolitik",
  "Cookie-politik",
  "Tilgængelighedserklæring",
  "Administrer cookies",
];

/* ==============================
   KOMPONENTEN
   ============================== */
export default function Footer() {
  return (
    // Fragment (<> </>): en komponent må kun returnere ét yderste element,
    // og her har vi to – stjernerne og footeren
    <>
      {/* Animerede stjerner over footeren – egen komponent i StjernerFooter.js */}
      <StjernerFooter />

      <footer className={styles.footer}>
        {/* ===== ØVERSTE DEL – venstre og højre side ===== */}
        <div className={styles.indhold}>
          {/* ----- Venstre side ----- */}
          <div className={styles.venstre}>
            {/* Logoet er det eneste i footeren, man kan klikke på – det fører til forsiden */}
            <Link href="/">
              <Image
                src="/assets/icons/ticketmaster-logo.svg"
                alt="Ticketmaster – gå til forsiden"
                width={180}
                height={25}
              />
            </Link>

            {/* Følg os – ét ikon pr. objekt i "sociale" */}
            <div className={styles.gruppe}>
              <p>Følg os</p>
              <ul className={styles.ikonRaekke}>
                {sociale.map((s) => (
                  <li key={s.navn}>
                    <Image src={s.ikon} alt={s.navn} width={24} height={24} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Download vores apps */}
            <div className={styles.gruppe}>
              <p>Download vores apps</p>
              <div className={styles.badges}>
                <Image
                  src="/assets/icons/app-store.svg"
                  alt="Hent i App Store"
                  width={138}
                  height={46}
                />
                <Image
                  src="/assets/icons/google-play.svg"
                  alt="Hent i Google Play"
                  width={152}
                  height={46}
                />
              </div>
            </div>

            {/* Betal trygt med */}
            <div className={styles.gruppe}>
              <p>Betal trygt med</p>
              <Image
                src="/assets/icons/paypal.svg"
                alt="PayPal – foretrukken betalingspartner"
                width={138}
                height={46}
              />
            </div>

            {/* Retningslinjer – <span> så kun ordet kan understreges i CSS */}
            <p className={styles.retningslinjer}>
              Ved at gå videre fra denne side accepterer du vores{" "}
              <span>retningslinjer</span>
            </p>
          </div>

          {/* ----- Højre side – .map() inde i .map():
              den ydre laver de 4 kolonner, den indre laver punkterne i hver kolonne ----- */}
          <div className={styles.kolonner}>
            {kolonner.map((kolonne) => (
              <div key={kolonne.titel} className={styles.kolonne}>
                <h2 className={styles.kolonneTitel}>{kolonne.titel}</h2>
                <ul className={styles.liste}>
                  {kolonne.punkter.map((punkt) => (
                    <li key={punkt}>{punkt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ===== VORES NETVÆRK – mellem to streger ===== */}
        <hr className={styles.streg} />

        <div className={styles.netvaerk}>
          <p>Vores netværk</p>
          <p>LIVE NATION</p>
          <p>universe</p>
        </div>

        <hr className={styles.streg} />

        {/* ===== BUND – grå tekster og copyright ===== */}
        <div className={styles.bund}>
          <ul className={styles.bundTekster}>
            {bundTekster.map((tekst) => (
              <li key={tekst}>{tekst}</li>
            ))}
          </ul>
          <p>
            © 1999-2026 Ticketmaster. All rights reserved.
            <br />
            (Studieprojekt uden tilknytning til Ticketmaster)
          </p>
        </div>
      </footer>
    </>
  );
}
