"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Lock, Mail, User, Phone, ArrowRight, MapPin } from "lucide-react";
import { useTicketStore } from "@/lib/ticket-store";

export default function RegistroPage() {
  const router = useRouter();
  const { switchRole } = useTicketStore();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    ciudad: "Rosario",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      switchRole("cliente");
      router.push("/panel");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-lg bg-[#FAF8F3] border-2 border-[#D6CEC0] p-8 rounded-xl shadow-md relative">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#FF5500] flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Wrench className="w-6 h-6 -rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-[#191C21] uppercase tracking-tight">Alta de Cliente</h1>
          <p className="text-xs text-[#595245] mt-1 font-medium font-mono">
            Registrá tus datos para coordinar reparaciones y entregas en Rosario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Nombre Completo</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                required
                placeholder="Lucas Benítez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-[#FF5500] mb-1.5 font-mono uppercase">
                <Phone className="w-3.5 h-3.5" />
                WhatsApp (Obligatorio)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+54 9 341..."
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-[#F3EFE6] border-2 border-[#FF5500] rounded-lg px-3.5 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#D94800]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Ciudad</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                required
                placeholder="Rosario, Santa Fe"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm text-xs sm:text-sm uppercase tracking-wider border border-[#D94800] mt-2"
          >
            {loading ? "Creando registro..." : "Registrar Cuenta de Taller"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#736B5E] border-t-2 border-[#EAE3D5] pt-4 font-mono">
          ¿Ya tenés orden previa?{" "}
          <Link href="/login" className="text-[#FF5500] font-bold hover:underline">
            Iniciá sesión acá
          </Link>
        </div>

      </div>
    </div>
  );
}
