
import styles from "./SektionsOverskrift.module.css";

export default function SektionOverskrift({ id, children}) {
    return (
        <div className={styles.overskrift}>
            <span className={styles.streg} aria-hidden="true" />
            <h2 id={id} className={styles.titel}>
                {children}
            </h2>
        </div>
    );
}