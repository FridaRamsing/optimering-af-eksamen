"use client"; // Man klikker på områder og pladser (useState), så den skal køre i browseren

import { useState, useEffect } from "react"; // useEffect henter de købte pladser, når siden er vist
import { useRouter } from "next/navigation"; // Skifter side fra JavaScript
import { supabase } from "@/lib/supabase"; // Henter købte pladser + tjekker, om man er logget ind
import Billet from "./Billet"; // Samme billet som i "Din ordre" på betalingssiden
import { OMRAADER } from "@/lib/sal"; // Gulv og Balkon: rækker, pladser og udsolgt
import styles from "./PladsVaelger.module.css";

// Salens opbygning (rækker og pladser) ligger i lib/sal.js – den deles med "Din ordre"

// Man må højst købe 8 billetter ad gangen
const MAKS_BILLETTER = 8;

// Pladser, der er "solgt i forvejen" – fyld, så salen ikke ser tom ud i vores demo.
// De RIGTIGE købte pladser hentes fra databasen (se useEffect i komponenten).
// Altid de samme, så salen ikke ændrer sig hver gang siden indlæses:
// regnestykket giver et fast "tilfældigt" tal for hver plads.
function erDemoOptaget(omraade, raekke, plads) {
  const tal = Math.sin(omraade.length * 31 + raekke.charCodeAt(0) * 17 + plads * 7) * 10000;
  return tal - Math.floor(tal) < 0.3; // ca. 30% af pladserne er optaget
}

// Én tekst pr. plads, så den er nem at slå op: "gulv-E-7".
// toLowerCase, fordi databasen gemmer "Gulv", mens lib/sal.js bruger "gulv"
function pladsNoegle(omraade, raekke, plads) {
  return `${omraade.toLowerCase()}-${raekke}-${plads}`;
}

// 1450 → "1.450 kr."
function kr(beloeb) {
  return `${beloeb.toLocaleString("da-DK")} kr.`;
}

/* ==============================
   PLADSVÆLGEREN
   Props:
   - eventId: hvilket event (sendes videre til betalingen)
   - datoId:  hvilken dato fra event_dato (sendes også videre)
   - pris:    prisen pr. billet for den valgte dato
   - titel:   eventets titel (vises på billetterne)
   - info:    "Tir 15. dec 2026 · 19:30 · Spillested, By" (vises på billetterne)
   ============================== */
export default function PladsVaelger({ eventId, datoId, pris, titel, info }) {
  const router = useRouter();
  // Hvilket område, man kigger på: null = salsplanen, "gulv" eller "balkon" = pladserne
  const [aabentOmraade, setAabentOmraade] = useState(null);
  // De valgte pladser: [{ omraade: "gulv", raekke: "E", plads: 7 }, ...]
  const [valgte, setValgte] = useState([]);
  // Kort besked til brugeren, fx når man har nået maks.
  const [besked, setBesked] = useState("");
  // De pladser, andre (eller man selv) allerede har købt: Set med "gulv-E-7", "gulv-E-8" ...
  const [koebte, setKoebte] = useState(new Set());

  // Henter de købte pladser fra Supabase, når siden vises (og hvis eventet/datoen skifter).
  // Viewet "optagne_pladser" viser kun pladserne – ikke hvem der har købt dem.
  useEffect(() => {
    async function hentKoebte() {
      let foresp = supabase.from("optagne_pladser").select("omraade, raekke, plads").eq("event_id", eventId);
      // Kun pladser til den valgte dato – samme plads kan sagtens være ledig en anden aften
      foresp = datoId ? foresp.eq("dato_id", datoId) : foresp.is("dato_id", null);

      const { data, error } = await foresp;
      if (error) {
        console.error("Kunne ikke hente optagne pladser:", error);
        return; // Så vises bare demo-pladserne
      }
      setKoebte(new Set(data.map((p) => pladsNoegle(p.omraade, p.raekke, p.plads))));
    }
    hentKoebte();
  }, [eventId, datoId]);

  // Optaget = købt i databasen ELLER en af demo-pladserne
  function erOptaget(omraade, raekke, plads) {
    return koebte.has(pladsNoegle(omraade, raekke, plads)) || erDemoOptaget(omraade, raekke, plads);
  }

  // Er netop denne plads valgt?
  function erValgt(omraade, raekke, plads) {
    return valgte.some((v) => v.omraade === omraade && v.raekke === raekke && v.plads === plads);
  }

  // Klik på en plads: vælg den – eller fravælg den, hvis den allerede er valgt
  function klikPlads(omraade, raekke, plads) {
    setBesked("");

    // Allerede valgt → fjern den
    if (erValgt(omraade, raekke, plads)) {
      setValgte(valgte.filter((v) => !(v.omraade === omraade && v.raekke === raekke && v.plads === plads)));
      return;
    }

    // Alle billetter i én ordre skal være i samme område (betalingen har ét område).
    // Vælger man i et nyt område, starter man forfra dér.
    if (valgte.length > 0 && valgte[0].omraade !== omraade) {
      setValgte([{ omraade, raekke, plads }]);
      setBesked("Alle pladser skal være i samme område – dit tidligere valg er fjernet.");
      return;
    }

    if (valgte.length >= MAKS_BILLETTER) {
      setBesked(`Du kan højst vælge ${MAKS_BILLETTER} billetter.`);
      return;
    }

    // ...valgte kopierer de gamle, og den nye lægges bagerst
    setValgte([...valgte, { omraade, raekke, plads }]);
  }

  // Fjern en plads fra "Dit valg"
  function fjern(valg) {
    setValgte(valgte.filter((v) => v !== valg));
    setBesked("");
  }

  const antal = valgte.length;
  const samletPris = antal * pris;

  // URL til betalingen: /betaling?event=8&omraade=Gulv&pladser=E-7,E-8&dato=1
  const pladsTekst = valgte.map((v) => `${v.raekke}-${v.plads}`).join(",");
  const omraadeNavn = antal > 0 ? OMRAADER[valgte[0].omraade].navn : "";
  // Ordren som URL-parametre – samme til login og betaling
  const ordre =
    `event=${eventId}&omraade=${encodeURIComponent(omraadeNavn)}&pladser=${pladsTekst}` +
    (datoId ? `&dato=${datoId}` : "");

  // "Gå til betaling":
  // - logget ind → direkte til betalingen
  // - ikke logget ind → til login, hvor ordren vises ved siden af (KoebLogin)
  async function gaaVidere() {
    const { data } = await supabase.auth.getSession();
    router.push(data.session ? `/betaling?${ordre}` : `/login?${ordre}`);
  }

  return (
    <div className={styles.layout}>
      {/* ===== VENSTRE: salsplanen ===== */}
      <div className={styles.venstre}>
        {/* Scene | Gulv | Balkon – alle tre bliver stående hele tiden.
            Det område, man klikker på, viser sine pladser inde i sin egen kasse */}
        <div className={styles.salsplan}>
          {/* Scenen kan man ikke købe billetter til – derfor et <div> og ikke en knap */}
          <div className={`${styles.omraade} ${styles.scene}`}>Scene</div>

          {/* Gulv og Balkon laves ens – ["gulv", "balkon"].map gør det for begge */}
          {["gulv", "balkon"].map((noegle) => {
            const omraade = OMRAADER[noegle];

            // Udsolgt → bare en grå kasse med navnet, som ikke kan klikkes
            if (omraade.udsolgt) {
              return (
                <div key={noegle} className={`${styles.omraade} ${styles[noegle]}`}>
                  {omraade.navn}
                  {/* Kun til skærmlæsere – synligt viser den grå farve, at den er udsolgt */}
                  <span className={styles.skjult}> (udsolgt)</span>
                </div>
              );
            }

            // Ikke valgt endnu → en farvet knap med navnet (Tab + Enter virker også)
            if (aabentOmraade !== noegle) {
              return (
                <button
                  key={noegle}
                  type="button"
                  className={`${styles.omraade} ${styles[noegle]}`}
                  onClick={() => setAabentOmraade(noegle)}
                >
                  {omraade.navn}
                </button>
              );
            }

            // Valgt → kassen bliver mørk og viser pladserne i et gitter
            return (
              <div
                key={noegle}
                className={`${styles.omraade} ${styles.aabent}`}
                role="group" // skærmlæsere: "gruppe: Pladser på Gulv"
                aria-label={`Pladser på ${omraade.navn}`}
                style={{ "--kolonner": omraade.raekker.length }} // én kolonne pr. række (A, B, C ...)
              >
                {/* CSS-gitteret fyldes linje for linje (fra venstre mod højre).
                    Derfor løber vi først gennem pladsnumrene (linjerne oppefra og ned)
                    og inden i dem gennem rækkerne (kolonnerne fra venstre mod højre).
                    Resultat: hver række (bogstav) bliver en lodret kolonne */}
                {Array.from({ length: omraade.pladser }, (_, i) => i + 1).map((plads) =>
                  omraade.raekker.map((raekke) => {
                    const optaget = erOptaget(noegle, raekke, plads);
                    const valgt = erValgt(noegle, raekke, plads);

                    // Farven vælges ud fra status: ledig (hvid), valgt (grøn), optaget (grå)
                    let status = styles.ledig;
                    if (valgt) status = styles.valgt;
                    if (optaget) status = styles.optaget;

                    return (
                      <button
                        key={`${raekke}-${plads}`}
                        type="button"
                        className={`${styles.plads} ${status}`}
                        onClick={() => klikPlads(noegle, raekke, plads)}
                        disabled={optaget} // optagne pladser kan ikke vælges
                        aria-pressed={valgt} // skærmlæsere siger "valgt" / "ikke valgt"
                        aria-label={`Række ${raekke}, plads ${plads}${optaget ? ", optaget" : ""}`}
                      />
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        {/* Forklaringen på farverne */}
        <ul className={styles.forklaring}>
          <li>
            <span className={`${styles.prik} ${styles.ledig}`} /> Ledig plads
          </li>
          <li>
            <span className={`${styles.prik} ${styles.valgt}`} /> Din(e) valgte pladser
          </li>
          <li>
            <span className={`${styles.prik} ${styles.optaget}`} /> Optaget
          </li>
        </ul>
      </div>

      {/* ===== HØJRE: Dit valg ===== */}
      <aside className={styles.ditValg} aria-labelledby="dit-valg-titel">
        <h2 id="dit-valg-titel" className={styles.ditValgTitel}>
          Dit valg
        </h2>

        {antal === 0 ? (
          <p className={styles.ingen}>Ingen billetter valgt</p>
        ) : (
          <ul className={styles.valgListe}>
            {/* Én billet pr. valgt plads – i: 0, 1, 2 ... bliver til #1, #2, #3 */}
            {valgte.map((v, i) => (
              <li key={`${v.omraade}-${v.raekke}-${v.plads}`} className={styles.valgPunkt}>
                <Billet
                  nr={i + 1}
                  titel={titel}
                  info={info}
                  omraade={OMRAADER[v.omraade].navn}
                  raekke={v.raekke}
                  plads={v.plads}
                  pris={pris.toLocaleString("da-DK")}
                  visQr={false} // "PRIS" i stedet for QR-kode – man har ikke købt endnu
                />
                {/* Lille × i hjørnet til at fjerne pladsen igen */}
                <button
                  type="button"
                  className={styles.fjern}
                  onClick={() => fjern(v)}
                  aria-label={`Fjern række ${v.raekke}, plads ${v.plads}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Beskeder, fx "højst 8 billetter". aria-live læser dem op, når de dukker op */}
        <p className={styles.besked} aria-live="polite">
          {besked}
        </p>

        {/* Bunden: antal, pris og knappen */}
        <div className={styles.bund}>
          <p className={styles.total}>
            {antal} {antal === 1 ? "billet" : "billetter"} · Samlet pris
            {antal > 0 && <strong> {kr(samletPris)}</strong>}
          </p>

          {/* Uden valgte pladser er knappen grå og gør ingenting */}
          {antal === 0 ? (
            <button type="button" className={styles.knap} disabled>
              Vælg billetter først
            </button>
          ) : (
            <button type="button" className={`${styles.knap} ${styles.knapAktiv}`} onClick={gaaVidere}>
              Gå til betaling
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
