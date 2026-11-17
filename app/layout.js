import { Figtree, Frigtree } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const figtree = Figtree ({
  variable: "--font-figtree",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ticketmaster eksamen",
  description: "dynamic user interface eksamen",
};

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
