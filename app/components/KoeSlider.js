"use client"; // Lottie og useRouter kører i browseren, så komponenten skal være en client component
import { Lottie } from "lottie-react";
import { sti } from "@/lib/sti";
import { useRouter } from "next/navigation";
import styles from "./KoeSlider.module.css";

export default function KoeSlider() {
  const router = useRouter(); // Giver adgang til at skifte side fra JavaScript

  // Når stjernen er færdig: videre til pladsvalg
  function gaaTilPladser() {
    router.replace("/pladser");
  }

  return (
    <Lottie
      src={sti("/assets/lotties/slider-stjerne-koe-loading.json")}
      autoplay
      loop={false} // Stjernen rejser én gang hen over buen
      className={styles.slider}
      aria-hidden="true"
      subscriptions={{ complete: gaaTilPladser }} // Kører gaaTilPladser, når stjernen er færdig
    />
  );
}
