import styles from "./page.module.css";
import Image from "next/image";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import KoeProgress from "@/app/components/KoeProgress";
import KoeSlider from "@/app/components/KoeSlider";

export default function KoePage() {
  return (
    <main>
      <section className={styles.koe}>
        <Image
          src="/assets/images/anne-linnet-koe-billede.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className={styles.billede}
        />

        {/* Den mørke bue i bunden – stjernehimlen ligger inde i den */}
        <div className={styles.bue} aria-hidden="true">
          <StjerneBaggrund />
        </div>

        {/* Stjernen der rejser langs buens kant */}
        <KoeSlider />
        
        <div className={styles.indhold}>
          <h1 className={styles.overskrift}>Du er nr. 88 i køen</h1>
          <p className={styles.ventetid}>Forventet ventetid: 3 minutter</p>
          <KoeProgress />
        </div>
      </section>
    </main>
  );
}
