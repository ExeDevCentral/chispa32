import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";
import { EnergyGridBgLight } from "@/components/ui/EnergyGridBgLight";

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
  title: "Chispa32 — Taller de Reparación y Reflasheo ESP32 | Rosario",
  description: "Taller técnico de electrónica y microcontroladores ESP32 en Rosario, Argentina. Banco de pruebas, recuperación de bootloaders, flasheo Tasmota/ESPHome y reparación de placas trabadas.",
  keywords: ["Taller ESP32 Rosario", "Reparación microcontroladores", "Flasheo ESPHome Tasmota", "Desbrickeado ESP32", "Servicio Técnico Electrónica Rosario"],
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
