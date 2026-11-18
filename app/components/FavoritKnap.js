
/*frida*/

// Kører i browseren, fordi knappen skal kunne klikkes og huske sin tilstand
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./FavoritKnap.module.css";

// eventId: hvilket event hjertet hører til (gemmes i tabellen "likes")
// onFjernet: valgfri – kaldes, når et like fjernes (bruges på favoritsiden til at fjerne kortet)
export default function FavoritKnap({ eventId, titel, onFjernet }) {
  const router = useRouter();

  // Om hjertet er valgt
  const [erFavorit, setErFavorit] = useState(false);

  // Når knappen vises: tjek i Supabase, om brugeren allerede har liket eventet
  useEffect(() => {
    async function hentLike() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return; // Ikke logget ind → hjertet er tomt

      // Tabellens regler (RLS) gør, at man kun kan se sine egne likes
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true }) // head: henter kun antallet, ikke rækkerne
        .eq("event_id", eventId);

      setErFavorit(count > 0);
    }
    hentLike();
  }, [eventId]);

  async function skift() {
    // Man skal være logget ind for at like – ellers sendes man til login
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/login");
      return;
    }

    const nyVaerdi = !erFavorit;
    setErFavorit(nyVaerdi); // Opdaterer hjertet med det samme, så det føles hurtigt

    // Gemmer eller sletter like'et i Supabase.
    // user_id udfyldes automatisk i databasen (default auth.uid()).
    const { error } = nyVaerdi
      ? await supabase.from("likes").insert({ event_id: eventId })
      : await supabase.from("likes").delete().eq("event_id", eventId);

    if (error) {
      console.error("Kunne ikke gemme like:", error);
      setErFavorit(!nyVaerdi); // Gik det galt, sættes hjertet tilbage
      return;
    }

    // Fortæl favoritsiden, at kortet skal fjernes
    if (!nyVaerdi && onFjernet) onFjernet(eventId);
  }

  return (
    <button
      type="button"
      className={`${styles.knap} ${erFavorit ? styles.valgt : ""}`}
      onClick={skift}
      aria-pressed={erFavorit}
      aria-label={`Gem ${titel} som favorit`}
    >
      {/* To hjerter oven i hinanden. CSS viser det fyldte ved hover eller når valgt */}
      <Image src="/assets/icons/favorite.svg" alt="" width={24} height={24} className={styles.tom} />
      <Image src="/assets/icons/favorite-hover.svg" alt="" width={24} height={24} className={styles.fyldt} />
    </button>
  );
}
