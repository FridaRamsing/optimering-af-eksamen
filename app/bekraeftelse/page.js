import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Forbindelsen til databasen
import BilletKort from "@/app/components/BilletKort"; // Selve billetten – genbruges på Mine billetter
import StjerneBaggrund from "@/app/components/StjerneBaggrund"; // Blinkende stjerner bag det hele
import styles from "./page.module.css";

// Header og Footer kommer automatisk fra app/layout.js.

/* ==============================
   KONFETTI
   Alle stykkerne laves her på serveren, én gang.
   Hvert stykke får sin egen retning, hop-højde, faldtid, farve, form,
   drejning og forsinkelse, som sendes til CSS som "custom properties" (--x, --hop osv.).
   Selve bevægelsen sker i CSS (@keyframes konfetti i page.module.css).
   ============================== */

// Farverne fra designet: blå, lilla, lys gul og hvid
const KONFETTI_FARVER = ["#024ddf", "#4b2fa8", "#fff2c2", "#ffffff"];

// Former: aflang stribe, firkant og prik
const KONFETTI_FORMER = ["stribe", "firkant", "prik"];

// "Tilfældigt" tal mellem 0 og 1, men altid det samme for samme tal ind.
// Vi bruger ikke Math.random(), fordi serveren og browseren så ville få
// forskellige tal – og så passer HTML'en ikke sammen.
function tilfaeldig(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x); // kun decimalerne → et tal mellem 0 og 1
}

// 150 stykker konfetti – nok til at fylde hele skærmen
const KONFETTI = Array.from({ length: 150 }, (_, i) => ({
  // Hvor langt til siden stykket ender, i forhold til billetternes midte
  // Halvdelen flyver til venstre, halvdelen til højre – mest ud til siderne,
  // så konfettien ses rundt om billetterne og ikke kun bag dem
  // 50vw = helt ude ved skærmens kant, så 52vw betyder, at nogle flyver ud over kanten
  x: `${(i % 2 === 0 ? -1 : 1) * Math.round(tilfaeldig(i + 1) * 48 + 4)}vw`, // 4vw til 52vw væk fra midten
  // Hvor højt stykket hopper op, før det falder ned
  hop: `${Math.round(tilfaeldig(i + 101) * 40 + 5)}vh`, // 5vh til 45vh – nogle lavt, andre højt
  // Hvor lang tid stykket er om at falde – forskellige, så de ikke falder i takt
  varighed: `${(tilfaeldig(i + 501) * 3 + 4).toFixed(2)}s`, // 4 til 7 sekunder – langsomt, så de svæver
  // Svæve-bevægelsen: hvor langt stykket svajer fra side til side, og hvor hurtigt
  svaj: `${Math.round(tilfaeldig(i + 601) * 25 + 15)}px`, // 15px til 40px
  svajTid: `${(tilfaeldig(i + 701) * 1 + 0.8).toFixed(2)}s`, // 0,8 til 1,8 sekunder pr. sving
  drej: `${Math.round(tilfaeldig(i + 201) * 720 - 360)}deg`, // -360° til 360°
  forsinkelse: `${(tilfaeldig(i + 301) * 1 + 0.75).toFixed(2)}s`, // springer ud, lige når billetten lander
  farve: KONFETTI_FARVER[i % KONFETTI_FARVER.length],
  form: KONFETTI_FORMER[Math.floor(tilfaeldig(i + 401) * KONFETTI_FORMER.length)],
}));

/* ==============================
   INDHOLDET – læser URL'en og henter eventet, derfor inde i <Suspense>
   URL'en kommer fra betalingssiden, fx:
   /bekraeftelse?event=8&omraade=Parket&pladser=E-7,E-8
   ============================== */
async function BekraeftelseIndhold({ searchParams }) {
  const { event: eventId, omraade = "Parket", pladser = "" } = await searchParams;

  // Ingen ordre i URL'en (fx hvis man skriver /bekraeftelse direkte)
  if (!eventId) {
    return (
      <p className={styles.besked}>
        Vi kunne ikke finde din ordre. <Link href="/mine-billetter">Se mine billetter</Link>
      </p>
    );
  }

  // Henter eventet fra Supabase – samme måde som på betalingssiden
  const { data: event, error } = await supabase
    .from("event")
    .select("id, titel, spillested, by, starts_at, pris_fra, image_url, card_image_url")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return <p className={styles.besked}>Noget gik galt. Prøv igen senere.</p>;
  }

  // "E-7,E-8" → [{ raekke: "E", plads: "7" }, { raekke: "E", plads: "8" }]
  const billetter = pladser
    .split(",")
    .filter(Boolean)
    .map((p) => {
      const [raekke, plads] = p.split("-");
      return { omraade, raekke, plads };
    });

  // Højst 3 billetter i bunken – ellers bliver den for høj
  const bunke = billetter.slice(0, 3);

  return (
    <>
      {/* ===== BILLETBUNKEN =====
          Alle billetter ligger oven på hinanden. Den første (index 0) ligger forrest,
          de næste ligger bagved – skubbet op til højre og drejet lidt.
          --nr bruges i CSS til at regne placering og forsinkelse ud. */}
      <div className={styles.bunke}>
        {bunke.map((billet, i) => (
          <div
            key={`${billet.raekke}-${billet.plads}`}
            className={styles.billetPlads}
            style={{ "--nr": i, "--antal": bunke.length, zIndex: bunke.length - i }}
          >
            <BilletKort billet={billet} event={event} bagved={i > 0} />
          </div>
        ))}
      </div>

      {/* Konfettien springer ud bag billetterne og falder ud i bunden af siden.
          Ligger uden for .bunke, så den kan dække hele siden.
          aria-hidden: ren pynt, skal ikke læses op */}
      <div className={styles.konfetti} aria-hidden="true">
        {KONFETTI.map((k, i) => (
          <span
            key={i}
            className={`${styles.stykke} ${styles[k.form]}`}
            style={{
              "--x": k.x,
              "--hop": k.hop,
              "--varighed": k.varighed,
              "--svaj": k.svaj,
              "--svaj-tid": k.svajTid,
              "--drej": k.drej,
              "--forsinkelse": k.forsinkelse,
              background: k.farve,
            }}
          />
        ))}
      </div>

      {/* ===== TEKSTEN UNDER BILLETTERNE ===== */}
      <div className={styles.tekst}>
        <p className={styles.duSkalTil}>Du skal til</p>
        <h1 className={styles.titel}>{event.titel}!!!</h1>
        <p className={styles.kvittering}>Kvitteringen er sendt til din e-mail.</p>

        <div className={styles.knapper}>
          <Link href="/mine-billetter" className={styles.knapBlaa}>
            Se mine billetter
          </Link>
          {/* Wallet findes ikke i vores løsning – knappen er kun design */}
          <button type="button" className={styles.knapKant}>
            Tilføj til Wallet
          </button>
        </div>
      </div>
    </>
  );
}

/* ==============================
   SIDEN
   ============================== */
export default function BekraeftelsePage({ searchParams }) {
  return (
    <main className={styles.side}>
      {/* Stjernehimlen bag alt indholdet (z-index: -1) */}
      <StjerneBaggrund />

      {/* "Luk" øverst til højre – tilbage til forsiden */}
      <Link href="/" className={styles.luk}>
        Luk
        <Image src="/assets/icons/luk.svg" alt="" width={20} height={20} />
      </Link>

      <Suspense fallback={<p className={styles.besked}>Henter dine billetter...</p>}>
        <BekraeftelseIndhold searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
