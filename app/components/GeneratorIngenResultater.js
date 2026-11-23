"use client"; // Knappen skal kunne klikkes, og useRouter virker kun i browseren

import { useRouter } from "next/navigation";
import { lavUrl } from "@/lib/filterUrl";
import IngenResultater from "./IngenResultater";

// Freias boks. "Ryd alle filtre" fjerner filtrene, men beholder alder, køn og sortering
export default function GeneratorIngenResultater({ alder, koen, sort }) {
  const router = useRouter();

  return (
    <IngenResultater
      onRydFiltre={() =>
        router.push(lavUrl("/eventgenerator", { alder, koen, sort }), { scroll: false })
      }
    />
  );
}
