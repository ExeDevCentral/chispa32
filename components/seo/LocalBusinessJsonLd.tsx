import { SITE_URL, BRAND_NAME, BRAND_COLOR } from "@/lib/seo";

/**
 * Datos estructurados JSON-LD con schema.org.
 * Se inyectan como <script type="application/ld+json"> para que Google,
 * Bing y Brave entiendan el negocio, los servicios y la ubicación.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    "name": BRAND_NAME,
    "alternateName": "Chispa32 Workshop",
    "description":
      "Taller de servicio técnico para microcontroladores ESP32, ESP8266 e IoT en Rosario, Argentina. Reparación, desbrickeado, recuperación de bootloaders y flasheo Tasmota, ESPHome y WLED.",
    "url": SITE_URL,
    "image": `${SITE_URL}/opengraph-image`,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/icon.svg`,
    },
    "priceRange": "$$",
    "currenciesAccepted": "ARS",
    "paymentAccepted": "Efectivo, transferencia, Mercado Pago",
    "telephone": "+5493410000000",
    "email": "taller@chispa32.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rosario",
      "addressRegion": "Santa Fe",
      "addressCountry": "AR",
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Rosario",
      },
      {
        "@type": "Country",
        "name": "Argentina",
      },
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      "opens": "09:00",
      "closes": "19:00",
    },
    "sameAs": [],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120",
    },
    "brand": {
      "@type": "Brand",
      "name": BRAND_NAME,
      "logo": `${SITE_URL}/icon.svg`,
      "color": BRAND_COLOR,
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios del taller",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desbrickeado ESP32 / ESP32-S3 / ESP8266",
            "description":
              "Recuperación de placas con bootloader dañado, firmware corrupto o flash SPI bloqueado.",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flasheo Tasmota y ESPHome",
            "description":
              "Programación de microcontroladores para domótica local con Tasmota o ESPHome.",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flasheo WLED",
            "description":
              "Instalación y configuración de controladoras WLED para tiras LED y proyectos decorativos.",
          },
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reparación electrónica y banco de pruebas",
            "description":
              "Diagnóstico en banco de pruebas, detección de memory leaks en FreeRTOS y reparación de hardware.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
