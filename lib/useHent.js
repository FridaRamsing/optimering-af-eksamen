"use client";
import { useEffect, useState } from "react";

// Henter data i browseren, fordi GitHub Pages ikke har en server.
// Giver null under første hentning og henter igen, når noegle ændrer sig
export function useHent(hent, noegle) {
  const [svar, setSvar] = useState(null);

  useEffect(() => {
    let aktuel = true; // Et gammelt svar må ikke overskrive et nyere
    Promise.resolve(hent())
      .then((resultat) => aktuel && setSvar(resultat))
      .catch((error) => aktuel && setSvar({ error }));
    return () => {
      aktuel = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noegle]);

  return svar;
}
