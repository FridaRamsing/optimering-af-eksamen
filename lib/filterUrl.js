// Bygger en URL til kategorisiden med de givne filtre. Tomme filtre udelades
// filterUrl("musik", { genre: "pop", pris: undefined }) → "/kategori/musik?genre=pop"
export function filterUrl(kategori, filtre) {
  const params = new URLSearchParams();

  for (const [navn, vaerdi] of Object.entries(filtre)) {
    if (vaerdi) params.set(navn, vaerdi);
  }

  const query = params.toString();
  return query ? `/kategori/${kategori}?${query}` : `/kategori/${kategori}`;
}
