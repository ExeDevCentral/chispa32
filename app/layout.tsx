import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";
import { EnergyGridBgLight } from "@/components/ui/EnergyGridBgLight";
import {
  BRAND_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_TITLE,
  DEFAULT_OG_DESCRIPTION,
  BRAND_COLOR,
} from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-industrial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-tech",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND_COLOR,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-workshop-surface text-[#191C21] selection:bg-[#FF5500] selection:text-white font-sans">
        <EnergyGridBgLight />

        {/* All content sits above the canvas */}
        <div className="relative z-10 flex flex-col min-h-screen">

        {/* Banner industrial superior de taller */}
        <div className="bg-[#191C21]/95 backdrop-blur-sm text-[#FAF8F3] text-[11px] font-mono py-1 px-4 border-b border-[#FF5500]/30 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="font-bold tracking-wide">Banco de pruebas activo</span>
            <span className="text-[#8C929E] hidden sm:inline">• Taller ESP32 / ESP8266 / IoT</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#A6ACB8]">
            <span className="hidden md:inline">📍 Rosario, Santa Fe</span>
            <span className="bg-[#FF5500] text-white px-2 py-0.5 rounded font-mono font-bold">RMA / Taller 2026</span>
          </div>
        </div>

        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        </div>{/* end relative z-10 wrapper */}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
