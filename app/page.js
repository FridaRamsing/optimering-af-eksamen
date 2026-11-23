import { byKort, kategoriKort } from "@/lib/forside";
import ForsideHero from "@/app/components/ForsideHero";
import SektionOverskrift from "@/app/components/SektionOverskrift";
import BilledKort from "@/app/components/BilledKort";
import GaveideBanner from "@/app/components/GaveideBanner";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import { PopulaereEvents, KommendeEvents } from "./ForsideEvents";
import styles from "./page.module.css";

export default function Forside() {
  return (
    <main className={styles.side}>
      <StjerneBaggrund />
      <ForsideHero />

      <div className={styles.sektioner}>
        <section className={styles.sektion} aria-labelledby="populaere">
          <SektionOverskrift id="populaere">
            Populære søgninger
          </SektionOverskrift>
          <PopulaereEvents />
        </section>

        <section className={styles.sektion} aria-labelledby="byer">
          <SektionOverskrift id="byer">Events i din by</SektionOverskrift>
          <ul className={styles.raekke}>
            {byKort.map((kort) => (
              <li key={kort.navn}>
                <BilledKort {...kort} />
              </li>
            ))}
          </ul>
        </section>

        <GaveideBanner />

        <section className={styles.sektion} aria-labelledby="kategorier">
          <SektionOverskrift id="kategorier">
            Udforsk kategorier
          </SektionOverskrift>
          <ul className={styles.raekke}>
            {kategoriKort.map((kort) => (
              <li key={kort.navn}>
                <BilledKort {...kort} />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.sektion} aria-labelledby="kommende">
          <SektionOverskrift id="kommende">Kommende events</SektionOverskrift>
          <KommendeEvents />
        </section>
      </div>
    </main>
  );
}
