"use client";

import { useState } from "react";
import Link from "next/link";
import { useTicketStore } from "@/lib/ticket-store";
import { TicketStatus } from "@/types";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { 
  Wrench, 
  Cpu, 
  Send, 
  MessageCircle, 
  Search, 
  Lock, 
  ArrowRight,
  Save,
  Gauge
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { tickets, updateTicketStatus, updateInternalNote, isLoaded } = useTicketStore();
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#595245] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" />
          <span>Cargando banco de administración...</span>
        </div>
      </div>
    );
  }

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tipo_chip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.user_nombre && t.user_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.ticket_number.toString().includes(searchTerm);

    if (filterStatus === "todos") return matchesSearch;
    return matchesSearch && t.estado === filterStatus;
  });

  const handleTestTelegram = async () => {
    setTelegramStatus("Enviando alerta de prueba a Telegram...");
    try {
      const res = await fetch("/api/tickets/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber: 999,
          clienteNombre: "Exequiel (Taller)",
          modeloPlaca: "ESP32-S3",
          tipoProblema: "Test Banco de Trabajo",
          titulo: "Alerta de Notificación de Taller",
          descripcion: "¡Alerta enviada con éxito desde el banco de Chispa32!",
          ticketId: "tk-test",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramStatus("✓ ¡Alerta recibida en tu celular!");
      } else {
        setTelegramStatus(`Aviso: ${data.error || "Revisá TELEGRAM_BOT_TOKEN en .env"}`);
      }
    } catch {
      setTelegramStatus("No se pudo conectar con el endpoint.");
    }
    setTimeout(() => setTelegramStatus(null), 5000);
  };

  const handleSaveNote = (ticketId: string) => {
    const note = editingNotes[ticketId];
    if (note !== undefined) {
      updateInternalNote(ticketId, note);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      
      {/* Top Bar Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-ping" />
              <h1 className="text-2xl sm:text-3xl font-black text-[#191C21] uppercase tracking-tight">
                Banco de Despacho & Taller (Admin)
              </h1>
            </div>
            <RoleSwitcher />
          </div>
          <p className="text-[#595245] text-xs sm:text-sm mt-1 font-medium">
            Gestión asincrónica de placas, notas de banco y comunicación directa con clientes.
          </p>
        </div>

        {/* Telegram Test Button */}
        <button
          onClick={handleTestTelegram}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#191C21] hover:bg-[#2C3038] text-[#FAF8F3] text-xs font-mono font-bold transition-all uppercase tracking-wider shadow-sm"
        >
          <Send className="w-3.5 h-3.5 text-[#FF5500]" />
          Probar Alerta en mi Celular
        </button>
      </div>

      {telegramStatus && (
        <div className="mb-6 p-3 bg-[#EAE3D5] border-2 border-[#FF5500] rounded-lg text-xs text-[#191C21] font-mono font-bold">
          {telegramStatus}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#EAE3D5] p-4 rounded-xl border-2 border-[#D0C7B6] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
          <input
            type="text"
            placeholder="Buscar por cliente, chip, #orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF8F3] border-2 border-[#D0C7B6] rounded-lg pl-9 pr-4 py-2 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
          />
        </div>

        {/* State filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {[
            { key: "todos", label: "Todos" },
            { key: "recibido", label: "Recibidos" },
            { key: "en_diagnostico", label: "En Diagnóstico" },
            { key: "en_reparacion", label: "En Reparación" },
            { key: "esperando_cliente", label: "Esperando Cliente" },
            { key: "resuelto", label: "Resueltos" },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setFilterStatus(st.key)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-colors ${
                filterStatus === st.key
                  ? "bg-[#191C21] text-white"
                  : "text-[#595245] hover:text-[#191C21] hover:bg-[#FAF8F3]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Management List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] p-8 rounded-xl text-center text-[#736B5E] text-xs font-mono">
            No hay órdenes de servicio con este filtro.
          </div>
        ) : (
          filteredTickets.map((t) => {
            const rawPhone = t.user_whatsapp || "";
            const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(t.user_nombre || "")}!%20Te%20escribo%20desde%20Chispa32%20por%20la%20Orden%20%23${t.ticket_number}%20(${encodeURIComponent(t.tipo_chip)})`;

            return (
              <div
                key={t.id}
                className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 hover:border-[#FF5500] transition-all flex flex-col space-y-4 shadow-sm"
              >
                {/* Header info */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      <span className="font-bold text-[#FF5500] text-xs bg-[#F3EFE6] px-2 py-0.5 rounded border border-[#D6CEC0]">
                        ORDEN #{t.ticket_number}
                      </span>
                      <span className="text-xs font-bold text-[#191C21]">
                        👤 {t.user_nombre || "Cliente"}
                      </span>
                      <span className="text-xs font-bold text-[#191C21] flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#FF5500]" /> {t.tipo_chip}
                      </span>
                      <span className="text-[#A69E8F] text-xs">•</span>
                      <span className="text-[11px] text-[#736B5E]">
                        {formatDate(t.created_at)}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#191C21]">
                      {t.titulo}
                    </h3>

                    <p className="text-xs text-[#595245]">
                      {t.descripcion}
                    </p>
                  </div>

                  {/* Status selector & Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EAE3D5] font-mono">
                    
                    {/* Status selector */}
                    <div>
                      <label className="text-[10px] uppercase text-[#736B5E] block mb-1 font-bold">
                        Fase de Banco:
                      </label>
                      <select
                        value={t.estado}
                        onChange={(e) => updateTicketStatus(t.id, e.target.value as TicketStatus)}
                        className="bg-[#F3EFE6] border-2 border-[#D0C7B6] text-[#191C21] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5500] font-bold"
                      >
                        <option value="recibido">1. Recibido</option>
                        <option value="en_diagnostico">2. En Diagnóstico</option>
                        <option value="en_reparacion">3. En Reparación</option>
                        <option value="esperando_cliente">4. Esperando Cliente</option>
                        <option value="resuelto">5. Resuelto</option>
                        <option value="entregado">6. Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    {/* WhatsApp */}
                    {cleanPhone && (
                      <div>
                        <span className="text-[10px] uppercase text-[#736B5E] block mb-1 opacity-0">
                          WA
                        </span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-[#191C21] text-[#FAF8F3] hover:bg-[#2C3038] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all uppercase tracking-wider"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#38D39F]" />
                          WhatsApp
                        </a>
                      </div>
                    )}

                    {/* Chat */}
                    <div>
                      <span className="text-[10px] uppercase text-[#736B5E] block mb-1 opacity-0">
                        Chat
                      </span>
                      <Link
                        href={`/panel/tickets/${t.id}`}
                        className="px-4 py-2 bg-[#EAE3D5] hover:bg-[#D0C7B6] text-[#191C21] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all border border-[#D0C7B6] uppercase tracking-wider"
                      >
                        Bitácora <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>

                {/* Nota Interna Privada */}
                <div className="bg-[#F3EFE6] p-3.5 rounded-lg border-2 border-[#D6CEC0] font-mono">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] text-[#C62828] flex items-center gap-1 font-bold uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> Nota Técnica Privada (Solo Admin):
                    </label>
                    <button
                      onClick={() => handleSaveNote(t.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#191C21] hover:bg-[#2C3038] text-[#FAF8F3] text-[10px] rounded border border-[#191C21] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Save className="w-3 h-3 text-[#FF5500]" /> Guardar Nota
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Anotar voltajes medidos, componentes a sustituir, fuses o instrucciones privadas..."
                    value={editingNotes[t.id] !== undefined ? editingNotes[t.id] : (t.nota_interna || "")}
                    onChange={(e) => setEditingNotes({ ...editingNotes, [t.id]: e.target.value })}
                    className="w-full bg-[#FAF8F3] border-2 border-[#D0C7B6] rounded-md p-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
