import FilterPanel from "./FilterPanel";
import FilterMaerker, { aktiveFiltre } from "./FilterMaerker";
import styles from "./FilterLinje.module.css";

// Linjen over kortene: "Filtrer"-knap (med panel) og et mærke for hvert aktivt filter.
// sti, felt og muligheder gør, at den virker på både kategorisiden og eventgeneratoren
export default function FilterLinje({ sti, filtre, felt, muligheder, byer }) {
  const antalAktive = aktiveFiltre(filtre, felt, muligheder).length;

  return (
    <div className={styles.linje}>
      <FilterPanel
        sti={sti}
        filtre={filtre}
        felt={felt}
        muligheder={muligheder}
        byer={byer}
        antalAktive={antalAktive}
      />
      <FilterMaerker sti={sti} filtre={filtre} felt={felt} muligheder={muligheder} />
    </div>
  );
}
