"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./TilbageKnap.module.css";

export default function TilbageKnap() {
  const router = useRouter();

  function gaaTilbage() {
    // Kom man direkte ind på siden (fx via et delt link), er der intet at gå tilbage til
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button type="button" className={styles.knap} onClick={gaaTilbage}>
      <Image src="/assets/icons/pil-venstre.svg" alt="" width={16} height={16} />
      Tilbage
    </button>
  );
}
