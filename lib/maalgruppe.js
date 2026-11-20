
// Køn-valgene. "vaerdi" er det, der står i URL'en og i Supabase-kolonnen "koen".
// "formular" er teksten i formularen, "kort" er teksten i topbaren
export const koenValg = [
  { vaerdi: "kvinde", formular: "Kvinde / Pige", kort: "Kvinde" },
  { vaerdi: "mand", formular: "Mand / Dreng", kort: "Mand" },
  { vaerdi: "alle", formular: "Alle", kort: "Alle" },
];

// Mindst 1 (ikke 0): lavUrl springer tomme værdier over, og 0 tæller som "tom" i JavaScript
export const ALDER_MIN = 1;
export const ALDER_MAX = 100;
export const ALDER_START = 23; // Startværdien fra Figma

// "kvinde" → "Kvinde". Ukendt værdi → undefined (bruges også til at tjekke, om URL'en er gyldig)
export function koenNavn(koen) {
  return koenValg.find((k) => k.vaerdi === koen)?.kort;
}
