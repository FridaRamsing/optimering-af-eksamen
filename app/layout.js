import { Figtree } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Figtree-fonten bliver til CSS-variablen --font-figtree
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

// Titel og beskrivelse til browserfanen og søgemaskiner
export const metadata = {
  title: "Ticketmaster eksamen",
  description: "dynamic user interface eksamen",
};

// Rammen om alle sider: children er den side, man står på
export default function RootLayout({ children }) {
  return (
    <html lang="da" className={figtree.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
