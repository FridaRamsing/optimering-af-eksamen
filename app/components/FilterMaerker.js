import Link from "next/link";
import Image from "next/image";
import { lavUrl } from "@/lib/filterUrl";
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

// Laver listen over aktive filtre. felt er "genre" på kategorisiden og "kategori" i generatoren
export function aktiveFiltre(filtre, felt, muligheder) {
  const aktive = [];
  const valgt = muligheder.find((m) => m.vaerdi === filtre[felt]);

  if (valgt) aktive.push({ navn: felt, tekst: valgt.tekst });
  if (filtre.pris) aktive.push({ navn: "pris", tekst: prisTekst(filtre.pris) });
  if (filtre.dato) aktive.push({ navn: "dato", tekst: datoTekst(filtre.dato) });
  if (filtre.by) aktive.push({ navn: "by", tekst: filtre.by });
  return aktive;
}

// De blå mærker med et kryds. Bruges både i filterlinjen og i den lille topbar
export default function FilterMaerker({ sti, filtre, felt, muligheder }) {
  const aktive = aktiveFiltre(filtre, felt, muligheder);
  if (aktive.length === 0) return null;

  return (
    <ul className={styles.maerker}>
      {aktive.map((filter) => (
        <li key={filter.navn}>
          {/* Fører til samme side, men uden netop dette filter */}
          <Link
            href={lavUrl(sti, { ...filtre, [filter.navn]: undefined })}
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
  );
}
