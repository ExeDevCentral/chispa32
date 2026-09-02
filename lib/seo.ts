/**
 * Configuración centralizada de SEO e identidad del sitio Chispa32.
 *
 * IMPORTANTE: cuando tengas tu dominio en producción, configuralo en el
 * entorno de deploy como la variable NEXT_PUBLIC_SITE_URL
 * (ej: https://chispa32.com). Los canonical, robots.txt, sitemap.xml y
 * las imágenes OpenGraph usan esta URL.
 */

export const BRAND_NAME = "Chispa32";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const TITLE_TEMPLATE = `%s | ${BRAND_NAME} — Taller ESP32 Rosario`;

export const DEFAULT_TITLE =
  "Chispa32 — Taller de Reparación y Reflasheo ESP32 | Rosario";

export const DEFAULT_DESCRIPTION =
  "Chispa32 es el taller técnico de microcontroladores ESP32 y ESP8266 en Rosario, Argentina. Banco de pruebas, recuperación de bootloaders, desbrickeado, flasheo Tasmota y ESPHome, reparación de placas trabadas y domótica para IoT. Recepción local y envíos a todo el país.";

export const DEFAULT_KEYWORDS = [
  "Taller ESP32 Rosario",
  "Reparación de microcontroladores",
  "Flasheo ESPHome",
  "Flasheo Tasmota",
  "Desbrickeado ESP32",
  "Recuperación bootloader ESP32",
  "Reparación placa ESP8266",
  "Servicio técnico electrónica Rosario",
  "Banco de pruebas ESP32",
  "Domótica local IoT",
  "Flasheo WLED",
];

export const DEFAULT_OG_TITLE = DEFAULT_TITLE;
export const DEFAULT_OG_DESCRIPTION =
  "Banco de servicio técnico para microcontroladores ESP32, ESP8266 e IoT. Recuperación de flash SPI, bootloaders dañados y programación para domótica local en Rosario, Argentina. Enviamos a todo el país.";

export const BRAND_COLOR = "#FF5500";
export const BRAND_DARK = "#191C21";
export const BRAND_CREAM = "#FAF8F3";
