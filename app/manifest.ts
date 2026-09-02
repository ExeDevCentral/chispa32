import type { MetadataRoute } from "next";
import { BRAND_COLOR, BRAND_CREAM } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chispa32 — Taller ESP32 Rosario",
    short_name: "Chispa32",
    description:
      "Taller técnico de reparación y reflasheo de microcontroladores ESP32, ESP8266 e IoT en Rosario, Argentina.",
    start_url: "/",
    display: "standalone",
    background_color: BRAND_CREAM,
    theme_color: BRAND_COLOR,
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
