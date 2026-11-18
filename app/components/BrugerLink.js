"use client"; // Login gemmes i browseren, så vi kan kun se det her

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./Header.module.css"; // Samme styling som de andre ikoner i headeren

// Bruger-ikonet i headeren.
// Logget ind → profilsiden (Mine billetter). Ikke logget ind → login-siden.
export default function BrugerLink() {
  // Starter som "ikke logget ind", indtil vi har spurgt Supabase
  const [loggetInd, setLoggetInd] = useState(false);

  useEffect(() => {
    // Tjekker med det samme, om der er et login gemt i browseren
    supabase.auth.getSession().then(({ data }) => {
      setLoggetInd(Boolean(data.session));
    });

    // Headeren bliver ikke genindlæst, når man skifter side (den ligger i layout.js).
    // Derfor lytter vi efter, når man logger ind eller ud, og opdaterer linket med det samme.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggetInd(Boolean(session));
    });

    // Oprydning: stop med at lytte, hvis komponenten forsvinder
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Link
      href={loggetInd ? "/mine-billetter" : "/login"}
      className={styles.iconLink}
      aria-label={loggetInd ? "Min profil" : "Log ind"}
    >
      {/* Normalt ikon og hover-ikon – CSS'en skifter mellem dem */}
      <Image
        src="/assets/icons/bruger.svg"
        alt=""
        width={32}
        height={32}
        className={styles.iconDefault}
      />
      <Image
        src="/assets/icons/bruger-hover.svg"
        alt=""
        width={32}
        height={32}
        className={styles.iconHover}
      />
    </Link>
  );
}
