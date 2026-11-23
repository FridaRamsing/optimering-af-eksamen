"use client"; // Lottie kører i browseren, så komponenten skal være en client component
import { Lottie } from "lottie-react";
import { sti } from "@/lib/sti";
import styles from "./KoeProgress.module.css";

export default function KoeProgress() {
  return (
    <Lottie
      src={sti("/assets/lotties/koe-loading-blaa-linje.json")}
      autoplay
      loop={false} // Baren fyldes én gang – køen gentager sig ikke
      className={styles.bar}
      aria-hidden="true"
    />
  );
}
