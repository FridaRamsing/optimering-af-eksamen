

import Image from "next/image";
import Link from "next/link";
import styles from "./BilledKort.module.css";

//Kort med billede og navn i midten - bruges til både byer og kategorier*/
export default function BilledKort({ navn, billede, href }) {
    return (
        <Link href={href} className={styles.kort}>
            {/* fill: billedet fylder hele kortet */}
            <Image
                src={billede}
                alt=""
                fill
                sizes="(max-width: 600px) 80vw, 330px"
                className={styles.billede}
                />
            <span className={styles.navn}>{navn}</span>
        </Link>
    );
}