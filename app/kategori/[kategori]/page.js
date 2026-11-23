import { Suspense } from "react";
import { kategoriInfo } from "@/lib/kategorier";
import StjerneBaggrund from "@/app/components/StjerneBaggrund";
import KategoriLoading from "@/app/components/KategoriLoading";
import KategoriIndhold from "./KategoriIndhold";
import styles from "./page.module.css";

// Fortæller Next, hvilke kategorisider der skal bygges til GitHub Pages
export function generateStaticParams() {
  return Object.keys(kategoriInfo).map((kategori) => ({ kategori }));
}

export default function KategoriPage() {
  return (
    <main className={styles.side}>
      {/* Bevægende stjerner bag hele siden (men ikke header og footer) */}
      <StjerneBaggrund />
      <Suspense fallback={<KategoriLoading />}>
        <KategoriIndhold />
      </Suspense>
    </main>
  );
}
