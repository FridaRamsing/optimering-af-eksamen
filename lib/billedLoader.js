import { sti } from "./sti";

// GitHub Pages kan ikke optimere billeder, så vi bruger originalen og retter kun lokale stier
export default function billedLoader({ src }) {
  return src.startsWith("/") ? sti(src) : src;
}
