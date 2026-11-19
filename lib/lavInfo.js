// Fælles hjælper til betalings- og bekræftelsessiden.
// Ligger i lib/, så begge sider kan importere den i stedet for at have hver sin kopi.

// Laver "Tir 15. dec 2026 · 19:30 · Sct. Catharinæ Kirke, Hjørring" ud fra eventet
export function lavInfo(event) {
  const dato = new Date(event.starts_at);
  // Dansk tid – ellers viser serveren måske UTC (en time forkert)
  const tz = { timeZone: "Europe/Copenhagen" };

  // Hver del for sig, så vi selv styrer punktummerne
  const ugedag = dato.toLocaleDateString("da-DK", { ...tz, weekday: "short" }).replace(".", "");
  const dag = dato.toLocaleDateString("da-DK", { ...tz, day: "numeric" }).replace(".", "");
  const maaned = dato.toLocaleDateString("da-DK", { ...tz, month: "short" }).replace(".", "");
  const aar = dato.toLocaleDateString("da-DK", { ...tz, year: "numeric" });
  const tid = dato
    .toLocaleTimeString("da-DK", { ...tz, hour: "2-digit", minute: "2-digit" })
    .replace(".", ":");

  // Tre bogstaver med stort forbogstav: "tirs" → "Tir"
  const Ugedag = ugedag.charAt(0).toUpperCase() + ugedag.slice(1, 3);

  // → "Tir 15. dec 2026 · 19:30 · Sct. Catharinæ Kirke, Hjørring"
  return `${Ugedag} ${dag}. ${maaned} ${aar} · ${tid} · ${event.spillested}, ${event.by}`;
}
