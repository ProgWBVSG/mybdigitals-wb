import { ImageResponse } from "next/og";

export const alt = "SlopCheck: cuánto parece hecha por IA tu web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph generada en build. Sin ella caeríamos en la señal 14. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f2ee",
          color: "#16150f",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 2 }}>
          <span>SLOPCHECK</span>
          <span style={{ color: "#7c7a70" }}>45 SEÑALES · GRATIS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Tu web dice quién la escribió, aunque vos no lo digas.
          </div>
          <div style={{ fontSize: 30, color: "#4b4941", maxWidth: 820 }}>
            Puntaje del 1 al 10, informe de lo que la delata y un prompt a medida para arreglarla.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 220, height: 6, background: "#a8341c" }} />
          <div style={{ fontSize: 22, color: "#7c7a70" }}>Pegá una URL y listo.</div>
        </div>
      </div>
    ),
    size,
  );
}
