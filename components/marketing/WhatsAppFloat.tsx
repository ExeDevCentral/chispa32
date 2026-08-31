"use client";

import { MessageSquare } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5493410000000?text=Hola%20Chispa32!%20Tengo%20una%20consulta%20por%20una%20placa%20ESP32"
      target="_blank"
      rel="noreferrer"
      aria-label="Guardia WhatsApp de Taller"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#191C21] hover:bg-[#2C3038] text-[#FAF8F3] font-mono font-bold shadow-2xl border-2 border-[#FF5500] hover:scale-105 transition-all text-xs group uppercase tracking-wider"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#38D39F] animate-ping" />
      <MessageSquare className="w-4 h-4 text-[#38D39F] fill-current" />
      <span className="hidden sm:inline">WhatsApp Taller</span>
    </a>
  );
}
