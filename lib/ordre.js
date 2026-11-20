/* ==============================
   ORDREN – fælles hjælpere til hele købsflowet
   (pladser → login → betaling → bekræftelse)

   Ordren sendes fra side til side i URL'en, fx:
   ?event=8&omraade=Gulv&pladser=E-7,E-8&dato=1
   Funktionerne her læser den på samme måde alle steder,
   så billetterne viser præcis det, man valgte på pladssiden.
   ============================== */

// De kolonner fra event_dato, vi skal bruge. Sættes ind i et select, fx:
// .select(`id, titel, ..., ${DATO_FELTER}`)
export const DATO_FELTER = "event_dato(id, starts_at, pris)";

// "E-7,E-8" → [{ raekke: "E", plads: "7" }, { raekke: "E", plads: "8" }]
export function laesPladser(pladser = "") {
  return pladser
    .split(",") // "E-7,E-8" → ["E-7", "E-8"]
    .filter(Boolean) // fjerner tomme tekster, fx hvis pladser er ""
    .map((p) => {
      const [raekke, plads] = p.split("-"); // "E-7" → ["E", "7"]
      return { raekke, plads };
    });
}

// Giver eventet med den DATO og PRIS, man valgte på pladssiden.
// Et event kan have flere datoer (tabellen event_dato) med hver sin pris.
// Vi lægger den valgte dato ind i starts_at og prisen i pris_fra – så virker al den
// eksisterende kode (lavInfo, billetterne, priserne) uden at skulle ændres.
// Er der ingen dato i URL'en, bruges eventets egen dato og pris.
export function medValgtDato(event, datoId) {
  // Number(): i URL'en er alt tekst ("1"), men id'et i databasen er et tal (1)
  const valgt = event.event_dato?.find((d) => d.id === Number(datoId));
  if (!valgt) return event;

  // { ...event } kopierer eventet, og de to felter efter kommaet overskriver
  return { ...event, starts_at: valgt.starts_at, pris_fra: valgt.pris ?? event.pris_fra };
}

// Ordren som URL-parametre: "event=8&omraade=Gulv&pladser=E-7,E-8&dato=1"
// Bruges, når man sender ordren videre til næste side
export function ordreParametre({ eventId, omraade, pladser, datoId }) {
  return (
    `event=${eventId}&omraade=${encodeURIComponent(omraade)}&pladser=${pladser}` +
    (datoId ? `&dato=${datoId}` : "")
  );
}
