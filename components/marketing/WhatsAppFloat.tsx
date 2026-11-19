"use client";

import Link from "next/link";
import { MessageSquare, Wrench, Tag,PlusCircle, User } from "lucide-react";
import { whatsappUrl } from "@/lib/site-config";

export function WhatsAppFloat() {
  const waHref = whatsappUrl("Hola Chispa32 — consulta técnica por una placa ESP32 / IoT");

  return (
    <>
      {/* Desktop Only Floating Button (>= md) */}
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Guardia WhatsApp de Taller"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2.5 px-4 py-3 rounded-lg bg-[#191C21] hover:bg-[#2C3038] text-[#FAF8F3] font-mono font-bold shadow-2xl border-2 border-[#FF5500] hover:scale-105 transition-all text-xs group tracking-wide"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#38D39F] animate-ping" />
        <MessageSquare className="w-4 h-4 text-[#38D39F] fill-current" />
        <span>WhatsApp Taller</span>
      </a>

      {/* Mobile Only Ergonomic Bottom Dock (< md) — Minimalista, bien espaciado, sin superponerse */}
      <nav
        aria-label="Navegación rápida móvil de taller"
        className="md:hidden fixed bottom-3 inset-x-3 z-50 select-none pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto max-w-md rounded-2xl border-2 border-[#D0C7B6] bg-[#FAF8F3]/95 backdrop-blur-xl shadow-[0_12px_32px_rgba(25,28,33,0.3)] p-1.5 grid grid-cols-4 items-center gap-1.5 font-mono">
          <Link
            href="/#servicios"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#332D24] hover:bg-[#EAE3D5] active:scale-95 transition-all"
          >
            <Wrench className="w-4 h-4 text-[#FF5500]" />
            <span className="text-[10px] font-bold mt-1 leading-none">Trabajos</span>
          </Link>

          <Link
            href="/#precios"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#332D24] hover:bg-[#EAE3D5] active:scale-95 transition-all"
          >
            <Tag className="w-4 h-4 text-[#191C21]" />
            <span className="text-[10px] font-bold mt-1 leading-none">Tarifario</span>
          </Link>

          <Link
            href="/panel/nuevo-ticket"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#FF5500] text-white shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-[10px] font-extrabold mt-1 leading-none">+ Placa</span>
          </Link>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#191C21] text-[#FAF8F3] active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#38D39F]" />
            <span className="text-[10px] font-bold mt-1 leading-none">WhatsApp</span>
          </a>
        </div>
      </nav>
    </>
  );
}
