"use client";

import { useState } from "react";
import { Send, Wrench, Terminal } from "lucide-react";
import { TicketMessage, UserRole } from "@/types";
import { formatDate } from "@/lib/utils";

interface TicketChatProps {
  ticketId: string;
  messages: TicketMessage[];
  currentRole: UserRole;
  onSendMessage: (text: string) => void;
}

export function TicketChat({ messages, currentRole, onSendMessage }: TicketChatProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(text.trim());
    setText("");
  };

  return (
    <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl overflow-hidden flex flex-col h-120 font-sans">
      
      {/* Header del Chat */}
      <div className="p-3.5 border-b-2 border-[#D6CEC0] bg-[#EAE3D5] flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#FF5500]" />
          <h3 className="text-xs font-bold text-[#191C21] uppercase tracking-wider">
            Bitácora de Comunicación de Orden
          </h3>
        </div>
        <span className="text-[10px] font-bold text-[#736B5E] bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#D0C7B6]">
          {messages.length} {messages.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {/* Lista de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F3EFE6]/70">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#736B5E] text-xs font-mono">
            <p>No hay mensajes en esta orden aún.</p>
            <p className="mt-1 text-[#8C8474]">Escribí tus consultas o actualizaciones debajo.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isAdmin = m.sender_role === "admin";
            const isMe = currentRole === m.sender_role;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Nombre y Rol */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-[#736B5E]">
                  {isAdmin ? (
                    <span className="flex items-center gap-1 font-bold text-[#FF5500]">
                      <Wrench className="w-3 h-3 text-[#FF5500]" />
                      {m.sender_name || "Exequiel (Taller)"}
                    </span>
                  ) : (
                    <span className="font-bold text-[#191C21]">
                      {m.sender_name || "Cliente"}
                    </span>
                  )}
                  <span>•</span>
                  <span className="text-[10px]">{formatDate(m.created_at)}</span>
                </div>

                {/* Burbuja de Mensaje */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    isAdmin
                      ? "bg-[#191C21] text-[#FAF8F3] shadow-sm border border-[#2D323B]"
                      : "bg-[#FAF8F3] border-2 border-[#D6CEC0] text-[#191C21] shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.mensaje}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input de Mensaje */}
      <form onSubmit={handleSubmit} className="p-3 border-t-2 border-[#D6CEC0] bg-[#EAE3D5]">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              currentRole === "admin"
                ? "Escribir actualización técnica o presupuesto para el cliente..."
                : "Escribir consulta sobre el estado de la placa..."
            }
            className="flex-1 bg-[#FAF8F3] border-2 border-[#D0C7B6] rounded-lg px-3.5 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`px-4 py-2.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider ${
              !text.trim()
                ? "bg-[#D0C7B6] text-[#8C8474] cursor-not-allowed"
                : "bg-[#FF5500] hover:bg-[#E64D00] text-white shadow-sm"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </div>
      </form>

    </div>
  );
}
