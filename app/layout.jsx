import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { ChatProvider } from "@/components/ChatContext";
import { OrdersProvider } from "@/components/OrdersContext";

const description =
  "Busca la carta, compara carpeteros. Marketplace de cartas TCG (Pokémon, Yu-Gi-Oh, Magic) en Lima, Perú.";

export const metadata = {
  metadataBase: new URL("https://tucarpetero.com"),
  title: {
    default: "TuCarpetero.com — Marketplace de carpeteros",
    template: "%s · TuCarpetero.com",
  },
  description,
  keywords: [
    "cartas TCG Lima",
    "Pokémon cartas Perú",
    "Yu-Gi-Oh cartas Perú",
    "Magic the Gathering Perú",
    "carpeteros Lima",
  ],
  openGraph: {
    title: "TuCarpetero.com — Marketplace de carpeteros",
    description,
    type: "website",
    locale: "es_PE",
    siteName: "TuCarpetero.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "TuCarpetero.com — Marketplace de carpeteros",
    description,
  },
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
      <body className="flex min-h-screen flex-col pb-24 md:pb-0 md:pt-16">
        <CartProvider>
          <FavoritesProvider>
            <ChatProvider>
              <OrdersProvider>
                <div className="mx-auto w-full max-w-[480px] flex-1 px-4 pt-5 md:max-w-6xl md:px-10 md:pt-10">
                  {children}
                </div>
                <Footer />
                <Nav />
              </OrdersProvider>
            </ChatProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
