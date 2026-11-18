"use client"; // Knappen skal kunne klikkes, og useRouter virker kun i browseren
import { useRouter } from "next/navigation";
import IngenResultater from "./IngenResultater";

// Freias "ingen resultater"-boks på kategorisiden.
// "Ryd alle filtre" sender én tilbage til kategorien uden filtre i URL'en
export default function KategoriIngenResultater({ kategori }) {
  const router = useRouter();

  return (
    <IngenResultater
      onRydFiltre={() => router.push(`/kategori/${kategori}`, { scroll: false })}
    />
  );
}
