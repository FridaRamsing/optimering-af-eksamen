"use client"; // onChange og useRouter kræver browseren

import { useRouter } from "next/navigation";
import Image from "next/image";
import { lavUrl } from "@/lib/filterUrl";
import styles from "./SorterVaelger.module.css";

export default function SorterVaelger({ sti, filtre }) {
  const router = useRouter();

  // Behold alle andre valg i URL'en, og skift kun "sort"
  function skift(e) {
    router.push(lavUrl(sti, { ...filtre, sort: e.target.value }), { scroll: false });
  }

  return (
    <div className={styles.boks}>
      <label htmlFor="sorter" className={styles.skjult}>Sortér efter</label>
      <select id="sorter" className={styles.select} value={filtre.sort ?? ""} onChange={skift}>
        <option value="">Sortér efter</option>
        <option value="dato">Dato – snarest først</option>
        <option value="pris-lav">Pris – lav til høj</option>
        <option value="pris-hoej">Pris – høj til lav</option>
      </select>
      <Image src="/assets/icons/pil-ned.svg" alt="" width={24} height={24} className={styles.pil} />
    </div>
  );
}
