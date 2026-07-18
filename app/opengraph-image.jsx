import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#131A2A",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(124,92,255,0.35), transparent 55%), radial-gradient(circle at 100% 90%, rgba(56,225,198,0.25), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 22px",
            borderRadius: 999,
            backgroundImage: "linear-gradient(100deg, #7C5CFF 0%, #3FA9F5 45%, #38E1C6 100%)",
            fontSize: 26,
            fontWeight: 800,
            color: "#131A2A",
          }}
        >
          TCG · Lima, Perú
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          TuCarpetero.com
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 820,
          }}
        >
          Busca la carta. Compara carpeteros.
        </div>
      </div>
    ),
    { ...size }
  );
}
