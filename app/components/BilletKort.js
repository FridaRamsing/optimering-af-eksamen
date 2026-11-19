import Image from "next/image";
import { lavInfo } from "@/lib/lavInfo"; // "Tir 15. dec 2026 · 19:30 · Spillested, By"
import styles from "./BilletKort.module.css";

/* ==============================
   BILLETKORT – én købt billet
   Billede | titel, info, område/række/plads | QR-kode og pris

   Bruges på:
   - bekræftelsessiden (billetterne, der flyver ind)
   - Mine billetter (de billetter, man har købt)

   Alt indhold kommer ind gennem props – intet er skrevet fast,
   så samme komponent virker til alle events.

   Props:
   - event:      eventet fra Supabase (titel, starts_at, spillested, by, pris_fra, billeder)
   - billet:     { omraade, raekke, plads, pris } – pris er valgfri
   - bagved:     true, hvis billetten ligger bag en anden (skal ikke læses op af skærmlæsere)
   - overskrift: hvilket overskrifts-niveau titlen skal have. "h2" som standard,
                 men på Mine billetter ligger billetten under en <h2>, så dér bruges "h3"
   ============================== */
export default function BilletKort({ event, billet, bagved = false, overskrift = "h2" }) {
  // Prisen på dansk: 1450 → "1.450 DKK"
  // Er billetten købt, bruges den pris, der blev betalt – ellers eventets "fra"-pris
  const pris = `${Number(billet.pris ?? event.pris_fra).toLocaleString("da-DK")} DKK`;

  // Variabel med stort forbogstav, så React bruger den som et HTML-tag: <Titel> → <h2> eller <h3>
  const Titel = overskrift;

  return (
    <div className={styles.ramme}>
      {/* aria-hidden: billetterne bagved skal ikke læses op to gange */}
      <article className={styles.billet} aria-hidden={bagved || undefined}>
        {/* Billedet til venstre – card_image_url er lavet til kort, ellers bruges det store billede */}
        <div className={styles.billede}>
          <Image
            src={event.card_image_url || event.image_url}
            alt=""
            fill // fylder hele .billede-kassen
            sizes="200px"
            className={styles.foto}
          />
        </div>

        {/* Midten – titel, dato/sted og pladsen */}
        <div className={styles.indhold}>
          <Titel className={styles.billetTitel}>{event.titel}</Titel>
          <p className={styles.info}>{lavInfo(event)}</p>

          {/* <dl> = liste med "navn: værdi" – passer til område/række/plads */}
          <dl className={styles.detaljer}>
            <div>
              <dt>Område</dt>
              <dd>{billet.omraade}</dd>
            </div>
            <div>
              <dt>Række</dt>
              <dd>{billet.raekke}</dd>
            </div>
            <div>
              <dt>Plads</dt>
              <dd>{billet.plads}</dd>
            </div>
          </dl>
        </div>

        {/* Afrivningsdelen – den stiplede streg og de to "huller" laves i CSS */}
        <div className={styles.stub}>
          <Image src="/assets/icons/qr.svg" alt="QR-kode til billetten" width={112} height={112} />
          <p className={styles.pris}>{pris}</p>
        </div>
      </article>
    </div>
  );
}
