import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#191C21",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 168,
            height: 168,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF8F3",
            borderRadius: 20,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 64 64"
          >
            <path
              d="M34 8 L14 36 L29 36 L24 56 L50 24 L34 24 Z"
              fill="#FF5500"
              transform="rotate(-8 32 32)"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
