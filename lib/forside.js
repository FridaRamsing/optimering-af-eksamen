

/*Frida*/
import {filterUrl} from "./filterUrl";

// "by" skal stå præcis som i Supabase-kolonnen "by" (fx "Aarhus C"), ellers finder filteret ingenting

export const byKort = [
  {
    navn: "Aalborg",
    billede: "/assets/images/forside/aalborg.jpg",
    href: filterUrl("musik", { by: "Aalborg" }),
  },
  {
    navn: "Aarhus",
    billede: "/assets/images/forside/aarhus.jpg",
    href: filterUrl("musik", { by: "Aarhus C" }),
  },
  {
    navn: "Herning",
    billede: "/assets/images/forside/herning.jpg",
    href: filterUrl("musik", { by: "Herning" }),
  },
  {
    navn: "Odense",
    billede: "/assets/images/forside/odense.jpg",
    href: filterUrl("musik", { by: "Odense" }),
  },
  {
    navn: "København",
    billede: "/assets/images/forside/koebenhavn.jpg",
    href: filterUrl("musik", { by: "København V" }),
  },
];

// Kortene under "Udforsk kategorier" på forsiden
export const kategoriKort = [
  {
    navn: "Børn",
    billede: "/assets/images/forside/boern.jpg",
    href: filterUrl("musik", { genre: "boernemusik" }),
  },
  {
    navn: "Shows",
    billede: "/assets/images/forside/shows.jpg",
    href: "/kategori/underholdning",
  },
  {
    navn: "Sportsgrene",
    billede: "/assets/images/forside/sport.jpg",
    href: "/kategori/sport",
  },
  {
    navn: "Musikgenrer",
    billede: "/assets/images/forside/musikgenrer.jpg",
    href: "/kategori/musik",
  },
  {
    navn: "Comedy",
    billede: "/assets/images/forside/comedy.jpg",
    href: filterUrl("underholdning", { genre: "comedy" }),
  },
  {
    navn: "Festivaler",
    billede: "/assets/images/forside/festivaler.jpg",
    href: filterUrl("musik", { genre: "festival" }),
  },
  {
    navn: "Koncerter",
    billede: "/assets/images/forside/koncerter.jpg",
    href: "/kategori/musik",
  },
];



