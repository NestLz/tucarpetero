import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "TuCarpetero.com — Marketplace de carpeteros",
  description:
    "Busca la carta, compara carpeteros. Marketplace de cartas TCG (Pokémon, Yu-Gi-Oh, Magic) en Lima, Perú.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen pb-24">
        <div className="mx-auto w-full max-w-[480px] px-4 pt-5">{children}</div>
        <Nav />
      </body>
    </html>
  );
}
