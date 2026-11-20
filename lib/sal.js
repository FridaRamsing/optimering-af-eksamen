/* ==============================
   SALEN – fælles for pladssiden og "Din ordre" på betalingssiden.
   Ligger i lib/, så begge steder bruger præcis samme opbygning:
   ændrer man antallet af rækker her, passer både pladsvælgeren og pinnen.

   Scenen står til VENSTRE, så rækkerne står lodret (parallelt med scenen):
   - Rækkerne (bogstaverne) går vandret: A er tættest på scenen, så B, C ... mod højre
   - Pladserne (tallene) går lodret: plads 1 øverst, 2, 3 ... nedad
   ============================== */
export const OMRAADER = {
  // 11 lodrette rækker (A-K) med 13 pladser i hver, som i designet
  gulv: { navn: "Gulv", raekker: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"], pladser: 13 },
  // Balkonen er udsolgt – den vises grå og kan ikke klikkes
  balkon: { navn: "Balkon", raekker: ["A", "B", "C"], pladser: 13, udsolgt: true },
};

/* ==============================
   Hvor skal pinnen stå på tegningen af salen?
   Får billetterne ([{ omraade: "Gulv", raekke: "E", plads: "7" }, ...])
   og giver området + placeringen i procent:
   { omraade: "gulv", x: 40.9, y: 50 }
   x = hvor langt inde fra venstre (0-100%), y = hvor langt nede (0-100%)
   ============================== */
export function pinPlacering(billetter) {
  // "Gulv" → "gulv". Gamle links med "Parket" eller ukendte navne regnes som gulv
  const navn = (billetter[0]?.omraade ?? "").toLowerCase();
  const noegle = OMRAADER[navn] ? navn : "gulv";
  const omraade = OMRAADER[noegle];

  // Hver billets plads omregnet til procent af områdets bredde og højde.
  // + 0.5 sætter pinnen midt i "cellen" i stedet for i kanten.
  const punkter = billetter
    .map((b) => {
      const kolonne = omraade.raekker.indexOf(b.raekke); // "E" → 4
      const linje = Number(b.plads) - 1; // "7" → 6 (tæller fra 0)
      if (kolonne === -1 || Number.isNaN(linje)) return null; // ukendt plads → springes over
      return {
        x: ((kolonne + 0.5) / omraade.raekker.length) * 100,
        y: ((linje + 0.5) / omraade.pladser) * 100,
      };
    })
    .filter(Boolean); // fjerner de ukendte (null)

  // Ingen gyldige pladser → pinnen i midten af området
  if (punkter.length === 0) return { omraade: noegle, x: 50, y: 50 };

  // Flere billetter → pinnen i midten af dem (gennemsnittet)
  const gennemsnit = (liste) => liste.reduce((sum, tal) => sum + tal, 0) / liste.length;
  return {
    omraade: noegle,
    x: gennemsnit(punkter.map((p) => p.x)),
    y: gennemsnit(punkter.map((p) => p.y)),
  };
}
