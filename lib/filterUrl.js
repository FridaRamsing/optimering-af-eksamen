// Bygger en URL ud fra en sti og nogle filtre. Tomme filtre udelades
// lavUrl("/eventgenerator", { alder: 25, koen: "kvinde", by: undefined }) → "/eventgenerator?alder=25&koen=kvinde"
export function lavUrl(sti, filtre) {
  const params = new URLSearchParams();

  for (const [navn, vaerdi] of Object.entries(filtre)) {
    if (vaerdi) params.set(navn, vaerdi);
  }

  const query = params.toString();
  return query ? `${sti}?${query}` : sti;
}

// Genvej til kategorisiden (bruges af GenreFilter)
// filterUrl("musik", { genre: "pop", pris: undefined }) → "/kategori/musik?genre=pop"
export function filterUrl(kategori, filtre) {
  return lavUrl(`/kategori/${kategori}`, filtre);
}
