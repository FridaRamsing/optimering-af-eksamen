
import styles from "./SektionsOverskrift.module.css";

// className: valgfri – lader en side ændre afstanden rundt om overskriften
export default function SektionOverskrift({ id, children, className }) {
    return (
        <div className={`${styles.overskrift} ${className ?? ""}`}>
            <span className={styles.streg} aria-hidden="true" />
            <h2 id={id} className={styles.titel}>
                {children}
            </h2>
        </div>
    );
}