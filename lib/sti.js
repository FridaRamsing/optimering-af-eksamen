// Siden ligger under /ticketmaster-eksamen på GitHub Pages, så filer fra public skal have den foran
export function sti(fil) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${fil}`;
}
