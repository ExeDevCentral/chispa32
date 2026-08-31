"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Lock, Mail, ArrowRight } from "lucide-react";
import { useTicketStore } from "@/lib/ticket-store";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useTicketStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email.includes("admin") || email.includes("exequiel")) {
        switchRole("admin");
        router.push("/admin");
      } else {
        switchRole("cliente");
        router.push("/panel");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-[#FAF8F3] border-2 border-[#D6CEC0] p-8 rounded-xl shadow-md relative">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#FF5500] flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Wrench className="w-6 h-6 -rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-[#191C21] uppercase tracking-tight">Acceso a Taller</h1>
          <p className="text-xs text-[#595245] mt-1 font-medium font-mono">
            Ingresá para seguir el estado de tus microcontroladores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 font-mono">
              <label className="text-xs font-bold text-[#191C21] uppercase">Contraseña</label>
              <a href="#" className="text-[11px] text-[#FF5500] hover:underline font-bold">¿Olvidaste tu clave?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm text-xs sm:text-sm uppercase tracking-wider border border-[#D94800] mt-2"
          >
            {loading ? "Verificando..." : "Ingresar a mi Panel"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#736B5E] border-t-2 border-[#EAE3D5] pt-4 font-mono">
          ¿No tenés orden previa?{" "}
          <Link href="/registro" className="text-[#FF5500] font-bold hover:underline">
            Crear cuenta acá
          </Link>
        </div>

      </div>
    </div>
  );
}
