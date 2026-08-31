"use client";

import Link from "next/link";
import { useState } from "react";
import { Wrench, Menu, X, User, Cpu, ShieldCheck } from "lucide-react";
import { useTicketStore } from "@/lib/ticket-store";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentRole, switchRole } = useTicketStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#D6CEC0] bg-[#FAF8F3]/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        
        {/* Logo / Emblema de Taller */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#FF5500] text-white flex items-center justify-center font-black rounded-lg shadow-sm border border-[#D94800] group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#191C21]">
                CHISPA<span className="text-[#FF5500]">32</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#191C21] text-[#FAF8F3] px-1.5 py-0.5 rounded uppercase tracking-wider">
                TALLER
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#736B5E] -mt-1 hidden sm:block">
              BANCO DE SERVICIO TÉCNICO • ROSARIO
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#4A4337]">
          <Link href="/#servicios" className="hover:text-[#FF5500] transition-colors">
            Trabajos de Taller
          </Link>
          <Link href="/#precios" className="hover:text-[#FF5500] transition-colors">
            Tarifario
          </Link>
          <Link href="/#como-funciona" className="hover:text-[#FF5500] transition-colors">
            Protocolo de Recepción
          </Link>
          <Link href="/#faq" className="hover:text-[#FF5500] transition-colors">
            Preguntas de Taller
          </Link>
        </nav>

        {/* Action Buttons & Role Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Selector de modo para pruebas */}
          <div className="flex items-center bg-[#EAE3D5] border border-[#D0C7B6] rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => switchRole("cliente")}
              className={`px-2.5 py-1 rounded transition-all ${
                currentRole === "cliente"
                  ? "bg-[#191C21] text-white font-bold"
                  : "text-[#665D4F] hover:text-[#191C21]"
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => switchRole("admin")}
              className={`px-2.5 py-1 rounded transition-all ${
                currentRole === "admin"
                  ? "bg-[#FF5500] text-white font-bold"
                  : "text-[#665D4F] hover:text-[#191C21]"
              }`}
            >
              Técnico (Vos)
            </button>
          </div>

          <Link
            href={currentRole === "admin" ? "/admin" : "/panel"}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#FAF8F3] hover:bg-[#EAE3D5] text-[#191C21] border-2 border-[#D0C7B6] transition-colors font-mono"
          >
            <User className="w-3.5 h-3.5 text-[#FF5500]" />
            {currentRole === "admin" ? "Banco Admin" : "Mis Órdenes"}
          </Link>

          <Link
            href="/panel/nuevo-ticket"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#FF5500] hover:bg-[#E64D00] text-white transition-all shadow-sm border border-[#D94800] uppercase tracking-wider font-mono"
          >
            + Ingresar Placa
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-[#EAE3D5] border border-[#D0C7B6] text-[#191C21]"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b-2 border-[#D6CEC0] bg-[#FAF8F3] px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-[#332D24] font-semibold text-sm">
            <Link
              href="/#servicios"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500]"
            >
              Trabajos de Taller
            </Link>
            <Link
              href="/#precios"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500]"
            >
              Tarifario
            </Link>
            <Link
              href="/#como-funciona"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500]"
            >
              Protocolo de Recepción
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500]"
            >
              Preguntas de Taller
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#D6CEC0] flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between py-2 text-xs text-[#665D4F]">
              <span>Modo Activo:</span>
              <div className="flex bg-[#EAE3D5] rounded p-0.5">
                <button
                  onClick={() => switchRole("cliente")}
                  className={`px-3 py-1 rounded text-xs ${currentRole === "cliente" ? "bg-[#191C21] text-white font-bold" : "text-[#665D4F]"}`}
                >
                  Cliente
                </button>
                <button
                  onClick={() => switchRole("admin")}
                  className={`px-3 py-1 rounded text-xs ${currentRole === "admin" ? "bg-[#FF5500] text-white font-bold" : "text-[#665D4F]"}`}
                >
                  Técnico
                </button>
              </div>
            </div>

            <Link
              href={currentRole === "admin" ? "/admin" : "/panel"}
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold rounded-lg bg-[#EAE3D5] text-[#191C21] border border-[#D0C7B6]"
            >
              {currentRole === "admin" ? "Ir al Banco de Admin" : "Mis Órdenes de Servicio"}
            </Link>
            <Link
              href="/panel/nuevo-ticket"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center text-xs font-bold rounded-lg bg-[#FF5500] text-white uppercase tracking-wider"
            >
              Ingresar Placa a Taller
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
