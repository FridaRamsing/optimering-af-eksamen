
/*frida*/

// Visningsnavne til genrerne. Nøglen er præcis værdien i Supabase-kolonnen "genre"
export const genreNavne = {
  // Musik
  pop: "Pop",
  rock: "Rock",
  indie: "Indie rock",
  metal: "Hard rock / Metal",
  rap: "Hip-hop / Rap",
  soul: "Soul / R&B",
  edm: "Dance / Elektronisk",
  klassisk: "Klassisk musik",
  jazz: "Jazz / Blues",
  country: "Country / Folk",
  latin: "Latin musik",
  verdensmusik: "Verdensmusik",
  schlager: "Schlager",
  gospel: "Gospel / Kor",
  julekoncert: "Julekoncert",
  festival: "Festival",
  boernemusik: "Børnemusik",
  // Sport
  fodbold: "Fodbold",
  haandbold: "Håndbold",
  ishockey: "Ishockey",
  motorsport: "Motorsport",
  esport: "E-sport",
  fitness: "Gymnastik / Fitness",
  // Underholdning
  teater: "Teater",
  musical: "Musical",
  ballet: "Ballet",
  dans: "Dans",
  comedy: "Comedy",
  cirkus: "Cirkus",
  isshow: "Isshow",
  // Oplevelse
  dinner: "Dinnerkoncert",
  konference: "Konference",
  hotel: "Hotel / Restaurant",
};

// Genre-knapperne for hver kategori, i den rækkefølge de vises.
// De vises altid – også selvom der ikke er events i genren endnu
export const kategoriGenrer = {
  musik: [
    "pop", "rock", "indie", "metal", "rap", "soul", "edm", "klassisk", "jazz",
    "country", "latin", "verdensmusik", "schlager", "gospel", "julekoncert",
    "festival", "boernemusik",
  ],
  sport: ["fodbold", "haandbold", "ishockey", "motorsport", "esport", "fitness"],
  underholdning: ["teater", "musical", "ballet", "dans", "comedy", "cirkus", "isshow"],
  oplevelse: ["dinner", "klassisk", "pop", "konference", "hotel"],
};

// Giver det pæne navn. Mangler genren i listen, vises den bare med stort forbogstav
export function genreNavn(genre) {
  return genreNavne[genre] ?? genre.charAt(0).toUpperCase() + genre.slice(1);
}
