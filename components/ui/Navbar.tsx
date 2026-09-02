"use client";

import Link from "next/link";
import { useState } from "react";
import { Wrench, Menu, X, Shield, PlusCircle, LogOut, User, Sparkles } from "lucide-react";
import { useCurrentUser, signOutUser } from "@/lib/auth";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, nombre, avatarUrl, isAdmin } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F3]/95 backdrop-blur-md shadow-[0_1px_0_rgba(25,28,33,0.06)]">
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
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#4A4337] uppercase font-mono">
          <Link href="/#servicios" className="hover:text-[#FF5500] transition-colors">
            Trabajos
          </Link>
          <Link href="/#precios" className="hover:text-[#FF5500] transition-colors">
            Tarifario
          </Link>
          <Link href="/#como-funciona" className="hover:text-[#FF5500] transition-colors">
            Protocolo
          </Link>
          <Link href="/#opiniones" className="hover:text-[#FF5500] transition-colors flex items-center gap-1 text-[#FF5500]">
            <Sparkles className="w-3 h-3" />
            Opiniones
          </Link>
          <Link href="/#faq" className="hover:text-[#FF5500] transition-colors">
            Preguntas
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Si es SUPER ADMIN activo */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-[#191C21] text-[#FF5500] border-2 border-[#FF5500] hover:bg-[#2C3038] transition-all font-mono tracking-wider shadow-sm animate-pulse"
            >
              <Shield className="w-3.5 h-3.5 fill-[#FF5500]" />
              BANCO ADMIN
            </Link>
          )}

          {/* Usuario logueado */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/panel"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#EAE3D5] hover:bg-[#D0C7B6] text-[#191C21] border border-[#D0C7B6] font-mono transition-colors"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={nombre} className="w-5 h-5 rounded-full object-cover border border-[#FF5500]" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#FF5500]" />
                )}
                <span className="max-w-[110px] truncate">{nombre}</span>
              </Link>
              <button
                onClick={signOutUser}
                title="Cerrar sesión"
                className="p-2 rounded-lg bg-[#EAE3D5] text-[#736B5E] hover:text-[#C62828] hover:bg-[#D0C7B6] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#FAF8F3] hover:bg-[#EAE3D5] text-[#191C21] border-2 border-[#D0C7B6] transition-colors font-mono"
            >
              Ingresar
            </Link>
          )}

          {/* Botón Principal: Ingresar Placa */}
          <Link
            href="/panel/nuevo-ticket"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#FF5500] hover:bg-[#E64D00] text-white transition-all shadow-sm border border-[#D94800] uppercase tracking-wider font-mono"
          >
            <PlusCircle className="w-3.5 h-3.5" />
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
        <div className="md:hidden bg-[#FAF8F3] px-4 py-6 space-y-4 font-mono">
          <nav className="flex flex-col space-y-3 text-[#332D24] font-bold text-xs uppercase">
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
              href="/#opiniones"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500] text-[#FF5500]"
            >
              Opiniones de Clientes
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-[#FF5500]"
            >
              Preguntas de Taller
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#D6CEC0] flex flex-col gap-2.5 font-mono">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-xs font-black rounded-lg bg-[#191C21] text-[#FF5500] border-2 border-[#FF5500] uppercase tracking-wider"
              >
                ⚡ Acceder al Banco Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center justify-between gap-2 bg-[#EAE3D5] p-2 rounded-lg border border-[#D0C7B6]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#191C21]">
                  {avatarUrl && <img src={avatarUrl} alt={nombre} className="w-5 h-5 rounded-full" />}
                  <span>{nombre}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOutUser();
                  }}
                  className="text-xs text-[#C62828] font-bold hover:underline"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold rounded-lg bg-[#EAE3D5] text-[#191C21] border border-[#D0C7B6]"
              >
                Ingresar / Iniciar Sesión
              </Link>
            )}

            <Link
              href="/panel/nuevo-ticket"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 text-center text-xs font-bold rounded-lg bg-[#FF5500] text-white uppercase tracking-wider shadow-md"
            >
              + Ingresar Placa a Taller
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
