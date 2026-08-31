"use client";

import { useTicketStore } from "@/lib/ticket-store";
import { Wrench, User } from "lucide-react";

export function RoleSwitcher() {
  const { currentRole, switchRole } = useTicketStore();

  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-[#EAE3D5] border-2 border-[#D0C7B6] rounded-lg text-xs font-mono">
      <span className="text-[10px] text-[#736B5E] px-1 font-bold hidden sm:inline uppercase">VISTA:</span>
      <button
        onClick={() => switchRole("cliente")}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded font-bold transition-all ${
          currentRole === "cliente"
            ? "bg-[#191C21] text-white shadow-sm"
            : "text-[#595245] hover:text-[#191C21]"
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Cliente
      </button>
      <button
        onClick={() => switchRole("admin")}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded font-bold transition-all ${
          currentRole === "admin"
            ? "bg-[#FF5500] text-white shadow-sm"
            : "text-[#595245] hover:text-[#191C21]"
        }`}
      >
        <Wrench className="w-3.5 h-3.5" />
        Técnico (Exequiel)
      </button>
    </div>
  );
}
