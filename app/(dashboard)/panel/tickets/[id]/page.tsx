"use client";

import { use } from "react";
import Link from "next/link";
import { useTicketStore } from "@/lib/ticket-store";
import { useCurrentUser } from "@/lib/auth";
import { TicketStatusStepper } from "@/components/tickets/TicketStatusStepper";
import { TicketChat } from "@/components/tickets/TicketChat";
import { ArrowLeft, Cpu, MessageCircle, AlertCircle, Paperclip, Wrench, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { whatsappUrl } from "@/lib/site-config";

export default function ClientTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { tickets, isLoaded, addMessage } = useTicketStore();
  const { user, nombre, isAdmin } = useCurrentUser();

  const ticket = tickets.find((t) => t.id === resolvedParams.id);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#595245] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" />
          <span>Cargando orden de taller...</span>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg font-mono">
        <AlertCircle className="w-12 h-12 text-[#C62828] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#191C21] uppercase">Orden no encontrada</h2>
        <p className="text-xs text-[#595245] mt-2">
          El ticket solicitado no existe o fue removido.
        </p>
        <Link
          href="/panel"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#191C21] text-white rounded-lg text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a mis órdenes
        </Link>
      </div>
    );
  }

  const handleSendMessage = (text: string) => {
    addMessage(
      ticket.id,
      text,
      user?.id || (isAdmin ? "usr-admin" : "usr-demo"),
      isAdmin ? "Exequiel (Taller)" : (ticket.user_nombre || nombre || "Cliente"),
      isAdmin ? "admin" : "cliente"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href={isAdmin ? "/admin" : "/panel"}
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6355] hover:text-[#FF5500] transition-colors font-mono font-bold uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> {isAdmin ? "Volver al Banco Admin" : "Volver al listado de órdenes"}
        </Link>
        {isAdmin && (
          <span className="text-[10px] font-mono font-bold bg-[#191C21] text-[#FF5500] px-2.5 py-1 rounded border border-[#FF5500] uppercase flex items-center gap-1">
            <Shield className="w-3 h-3" /> Vista de Administrador
          </span>
        )}
      </div>

      {/* Header Info */}
      <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono flex-wrap">
              <span className="text-xs font-bold text-[#FF5500] bg-[#F3EFE6] px-2.5 py-0.5 rounded border border-[#D6CEC0]">
                ORDEN #{ticket.ticket_number}
              </span>
              <span className="text-xs font-bold text-[#191C21] flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#FF5500]" /> {ticket.tipo_chip}
              </span>
              <span className="text-[#A69E8F] text-xs">•</span>
              <span className="text-xs text-[#736B5E]">
                Ingreso: {formatDate(ticket.created_at)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#191C21] uppercase">
              {ticket.titulo}
            </h1>
          </div>

          <div className="bg-[#EAE3D5] px-4 py-2.5 rounded-lg border border-[#D0C7B6] text-right font-mono">
            <span className="text-[10px] uppercase text-[#736B5E] block font-bold">Estado en Banco:</span>
            <span className="text-xs sm:text-sm font-black text-[#FF5500] uppercase">
              {ticket.estado.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper de Progreso */}
      <div className="mb-8">
        <TicketStatusStepper currentStatus={ticket.estado} />
      </div>

      {/* Main Grid: Details + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#736B5E] font-bold tracking-wider">
              Diagnóstico / Falla Reportada
            </h3>
            <p className="text-xs sm:text-sm text-[#332E27] leading-relaxed whitespace-pre-wrap">
              {ticket.descripcion}
            </p>

            {/* 1 Adjunto si existe */}
            {ticket.adjunto_url && (
              <div className="pt-4 border-t-2 border-[#EAE3D5]">
                <span className="text-xs text-[#736B5E] block mb-2 font-mono font-bold uppercase">Foto o archivo adjunto:</span>
                <div className="overflow-hidden rounded-xl border border-[#D0C7B6] bg-[#F3EFE6] p-2">
                  <img
                    src={ticket.adjunto_url}
                    alt="Foto de la orden"
                    className="max-h-60 w-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Help */}
          <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] p-5 rounded-xl flex items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-[#191C21] font-mono uppercase">Coordinación de Entrega</h4>
              <p className="text-[11px] text-[#595245] mt-0.5 font-medium">
                ¿Querés coordinar horario en Rosario para retirar la placa?
              </p>
            </div>
            <a
              href={whatsappUrl(`Hola Chispa32 — consulto por la orden #${ticket.ticket_number}`)}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[#191C21] text-[#FAF8F3] hover:bg-[#2C3038] font-mono font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 uppercase tracking-wider"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#38D39F]" />
              WhatsApp
            </a>
          </div>

        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-6">
          <TicketChat
            ticketId={ticket.id}
            messages={ticket.messages || []}
            currentRole={isAdmin ? "admin" : "cliente"}
            onSendMessage={handleSendMessage}
          />
        </div>

      </div>

    </div>
  );
}
