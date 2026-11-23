// Kun ved build, så npm run dev virker som før for hele gruppen
const erProduktion = process.env.NODE_ENV === "production";
const basePath = erProduktion ? "/ticketmaster-eksamen" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // GitHub Pages har ingen server, så siden bygges til statiske filer
  ...(erProduktion && {
    output: "export",
    basePath,
    trailingSlash: true,
  }),
  images: {
    ...(erProduktion && { loader: "custom", loaderFile: "./lib/billedLoader.js" }),
    remotePatterns: [
      { protocol: "https", hostname: "s1.ticketm.net" },
      { protocol: "https", hostname: "cgtozhuifkcmihfxekgo.supabase.co" },
    ],
  },
};

export default nextConfig;
