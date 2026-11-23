

"use client"; // Lottie afspilles i browseren, så komponenten skal være en client component
import { Lottie } from "lottie-react";
import { sti } from "@/lib/sti";
import styles from "./ForsideHero.module.css";

export default function HeroAnimation() {
  return (
    <Lottie
      src={sti("/assets/lotties/forside-hero.json")}
      autoplay
      loop
      className={styles.animation}
      aria-hidden="true"
    />
  );
}
