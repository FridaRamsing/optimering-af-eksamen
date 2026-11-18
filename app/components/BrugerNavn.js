"use client"; // Login gemmes i browseren, så navnet kan kun hentes her

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Viser fornavnet på den bruger, der er logget ind.
// Fornavnet blev gemt på brugeren, da profilen blev oprettet (se LoginKort.js).
export default function BrugerNavn() {
  // Tom tekst, indtil navnet er hentet – så der ikke står et forkert navn et øjeblik
  const [navn, setNavn] = useState("");

  // Kører én gang, når komponenten vises
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const bruger = data.user;

      if (!bruger) {
        setNavn("Gæst"); // Ikke logget ind
        return;
      }

      // user_metadata er det, vi gemte under "data" ved oprettelsen.
      // Mangler fornavnet (fx ældre testbrugere), bruges e-mailen i stedet.
      setNavn(bruger.user_metadata?.fornavn || bruger.email);
    });
  }, []);

  return navn;
}
