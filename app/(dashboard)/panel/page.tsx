"use client";

import Link from "next/link";
import { useState } from "react";
import { useTicketStore } from "@/lib/ticket-store";
import { Clock, CheckCircle2, Cpu, PlusCircle, Search, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

export default function ClientDashboardPage() {
  const { tickets, isLoaded } = useTicketStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#595245] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" />
          <span>Cargando órdenes de taller...</span>
        </div>
      </div>
    );
  }

  // Filtrar tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tipo_chip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticket_number.toString().includes(searchTerm);

    if (statusFilter === "todos") return matchesSearch;
    if (statusFilter === "activos") return matchesSearch && t.estado !== "resuelto" && t.estado !== "entregado" && t.estado !== "cancelado";
    if (statusFilter === "resueltos") return matchesSearch && (t.estado === "resuelto" || t.estado === "entregado");
    return matchesSearch && t.estado === statusFilter;
  });

  const activeCount = tickets.filter((t) => t.estado !== "resuelto" && t.estado !== "entregado" && t.estado !== "cancelado").length;
  const resolvedCount = tickets.filter((t) => t.estado === "resuelto" || t.estado === "entregado").length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#191C21] uppercase tracking-tight">
              Mis Placas en Taller
            </h1>
            <RoleSwitcher />
          </div>
          <p className="text-[#595245] text-xs sm:text-sm mt-1 font-medium">
            Seguimiento de reparaciones, reflasheos y órdenes de servicio técnico.
          </p>
        </div>

        <Link
          href="/panel/nuevo-ticket"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-xs sm:text-sm transition-all shadow-md uppercase tracking-wider border border-[#D94800]"
        >
          <PlusCircle className="w-4 h-4" />
          Ingresar Nueva Placa
        </Link>
      </div>

      {/* Metrics Cards de Taller */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono">
        <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#736B5E] font-bold uppercase tracking-wider">En Banco / Diagnóstico</p>
            <p className="text-3xl font-black text-[#FF5500] mt-1">{activeCount}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#EAE3D5] border border-[#D0C7B6] flex items-center justify-center text-[#FF5500]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#736B5E] font-bold uppercase tracking-wider">Placas Listas</p>
            <p className="text-3xl font-black text-[#2E7D32] mt-1">{resolvedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#EAE3D5] border border-[#D0C7B6] flex items-center justify-center text-[#2E7D32]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#736B5E] font-bold uppercase tracking-wider">Historial Total</p>
            <p className="text-3xl font-black text-[#191C21] mt-1">{tickets.length}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#EAE3D5] border border-[#D0C7B6] flex items-center justify-center text-[#191C21]">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#EAE3D5] p-3 rounded-xl border-2 border-[#D0C7B6] font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
          <input
            type="text"
            placeholder="Buscar por chip, #orden o falla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F3] border-2 border-[#D0C7B6] rounded-lg pl-9 pr-4 py-2 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          {["todos", "activos", "resueltos"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-colors ${
                statusFilter === f
                  ? "bg-[#191C21] text-white"
                  : "text-[#595245] hover:text-[#191C21]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-12 text-center font-mono">
          <Wrench className="w-12 h-12 text-[#A69E8F] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#191C21] uppercase">No hay órdenes en este estado</h3>
          <Link
            href="/panel/nuevo-ticket"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5500] text-white font-bold rounded-lg text-xs uppercase"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Ingresar Primera Placa
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => {
            const isResolved = t.estado === "resuelto" || t.estado === "entregado";
            const isWaiting = t.estado === "esperando_cliente";

            return (
              <Link
                key={t.id}
                href={`/panel/tickets/${t.id}`}
                className="block bg-[#FAF8F3] border-2 border-[#D6CEC0] hover:border-[#FF5500] rounded-xl p-5 transition-all duration-200 group shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#FF5500] text-xs bg-[#F3EFE6] px-2 py-0.5 rounded border border-[#D6CEC0]">
                        ORDEN #{t.ticket_number}
                      </span>
                      <span className="text-xs font-bold text-[#191C21] flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#FF5500]" /> {t.tipo_chip}
                      </span>
                      <span className="text-[#A69E8F] text-xs">•</span>
                      <span className="text-[11px] text-[#736B5E]">
                        {formatDate(t.created_at)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#191C21] group-hover:text-[#FF5500] transition-colors">
                      {t.titulo}
                    </h3>

                    <p className="text-xs text-[#595245] line-clamp-1">
                      {t.descripcion}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-[#EAE3D5] pt-2 sm:pt-0 font-mono">
                    <span
                      className={`text-[11px] font-bold uppercase px-3 py-1 rounded ${
                        isResolved
                          ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]"
                          : isWaiting
                          ? "bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] animate-pulse"
                          : "bg-[#EAE3D5] text-[#191C21] border border-[#D0C7B6]"
                      }`}
                    >
                      {t.estado.replace("_", " ")}
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
