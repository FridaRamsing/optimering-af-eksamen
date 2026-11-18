import Link from "next/link";
import Image from "next/image";
import { genreNavn } from "@/lib/genre";
import { filterUrl } from "@/lib/filterUrl";
import FilterPanel from "./FilterPanel";
import styles from "./FilterLinje.module.css";

// "300-500" → "300 - 500 kr."  /  "300-" (ingen øvre grænse) → "Fra 300 kr."
function prisTekst(pris) {
  const [min, max] = pris.split("-");
  return max ? `${min} - ${max} kr.` : `Fra ${min} kr.`;
}

// "2027-01-15" → "Fra 15. jan."
function datoTekst(dato) {
  const tekst = new Date(dato).toLocaleDateString("da-DK", { day: "numeric", month: "short" });
  return `Fra ${tekst}`;
}

// Linjen over kortene: "Filtrer"-knap (med panel) og et mærke for hvert aktivt filter
export default function FilterLinje({ kategori, filtre, genrer, byer }) {
  // Hvert aktivt filter får sit navn i URL'en og den tekst, der vises
  const aktive = [];
  if (filtre.genre) aktive.push({ navn: "genre", tekst: genreNavn(filtre.genre) });
  if (filtre.pris) aktive.push({ navn: "pris", tekst: prisTekst(filtre.pris) });
  if (filtre.dato) aktive.push({ navn: "dato", tekst: datoTekst(filtre.dato) });
  if (filtre.by) aktive.push({ navn: "by", tekst: filtre.by });

  return (
    <div className={styles.linje}>
      <FilterPanel
        kategori={kategori}
        filtre={filtre}
        genrer={genrer}
        byer={byer}
        antalAktive={aktive.length}
      />

      {aktive.length > 0 && (
        <ul className={styles.maerker}>
          {aktive.map((filter) => (
            <li key={filter.navn}>
              {/* Fører til samme side, men uden netop dette filter */}
              <Link
                href={filterUrl(kategori, { ...filtre, [filter.navn]: undefined })}
                scroll={false}
                className={styles.maerke}
                aria-label={`Fjern filter: ${filter.tekst}`}
              >
                {filter.tekst}
                <Image src="/assets/icons/luk.svg" alt="" width={20} height={20} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
