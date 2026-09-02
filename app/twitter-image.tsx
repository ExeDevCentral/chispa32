import { ImageResponse } from "next/og";

export const alt = "Chispa32 — Taller de reparación y reflasheo ESP32 en Rosario";
export const size = { width: 1200, height: 675 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#191C21",
          color: "#FAF8F3",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: "#FF5500",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FAF8F3",
              borderRadius: 22,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              height="72"
              viewBox="0 0 64 64"
            >
              <path
                d="M34 8 L14 36 L29 36 L24 56 L50 24 L34 24 Z"
                fill="#FF5500"
                transform="rotate(-8 32 32)"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            CHISPA
            <span style={{ color: "#FF5500" }}>32</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            textAlign: "center",
            color: "#FAF8F3",
          }}
        >
          Taller de Reparación y Reflasheo ESP32
        </div>
        <div
          style={{
            fontSize: 26,
            textAlign: "center",
            color: "#A6ACB8",
            marginTop: 16,
          }}
        >
          Banco de pruebas · Desbrickeado · Tasmota · ESPHome · Rosario, Argentina
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
