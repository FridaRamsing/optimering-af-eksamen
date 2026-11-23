// Kun ved build, så npm run dev virker som før for hele gruppen
const erProduktion = process.env.NODE_ENV === "production";
// På GitHub Pages ligger siden under /ticketmaster-eksamen
const basePath = erProduktion ? "/ticketmaster-eksamen" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gør stien tilgængelig for lib/sti.js
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // GitHub Pages har ingen server, så siden bygges til statiske filer
  ...(erProduktion && {
    output: "export",
    basePath,
    // /login bliver til /login/, som GitHub Pages finder i login/index.html
    trailingSlash: true,
  }),
  images: {
    // Vores egen loader sætter den rigtige sti foran lokale billeder
    ...(erProduktion && { loader: "custom", loaderFile: "./lib/billedLoader.js" }),
    remotePatterns: [
      { protocol: "https", hostname: "s1.ticketm.net" },
      { protocol: "https", hostname: "cgtozhuifkcmihfxekgo.supabase.co" },
    ],
  },
};

export default nextConfig;
