
/*frida*/

// Visningsnavne til genrerne. Nøglen er præcis værdien i Supabase-kolonnen "genre"
export const genreNavne = {
  pop: "Pop",
  rap: "Hip-hop / Rap",
  edm: "Dance / Elektronisk",
  klassisk: "Klassisk musik",
  ballet: "Ballet",
};

// Giver det pæne navn. Mangler genren i listen, vises den bare med stort forbogstav
export function genreNavn(genre) {
  return genreNavne[genre] ?? genre.charAt(0).toUpperCase() + genre.slice(1);
}
