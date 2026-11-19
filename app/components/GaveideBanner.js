

import Link from "next/link";
import styles from "./GaveideBanner.module.css";

export default function GaveideBanner() {
    return (
        <section className={styles.banner} aria-labelledby="gaveide">
            <div className={styles.tekster}>
                <h2 id="gaveide" className={styles.titel}>
                    Mangler du en gaveide?
                    </h2>
                    <p className={styles.tekst}>
                        Fortæl os hvem gaven er til, så får du forslag til oplevelser.
                    </p>
                    </div>
                <Link href="/eventgenerator" className={styles.knap}>
                    Prøv eventgeneratoren
                </Link>
            </section>
    );
}