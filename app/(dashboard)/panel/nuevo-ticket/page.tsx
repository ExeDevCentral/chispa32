"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTicketStore } from "@/lib/ticket-store";
import { TicketPriority } from "@/types";
import { Wrench, Send, UploadCloud, ArrowLeft, MapPin, Phone } from "lucide-react";
import Link from "next/link";

function TicketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createTicket } = useTicketStore();

  const initialPackage = searchParams.get("paquete") || "";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "Usuario Maker",
    email: "cliente@ejemplo.com",
    whatsapp: "+54 9 341 000-0000",
    tipo_chip: "ESP32-WROOM-32",
    titulo: initialPackage ? `Solicitud: ${initialPackage}` : "",
    descripcion: "",
    prioridad: "media" as TicketPriority,
  });

  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const handleSimulateFile = () => {
    setAttachedFile("foto_placa_o_log.jpg");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newTicket = await createTicket({
        user_id: "usr-demo",
        user_nombre: formData.nombre,
        user_email: formData.email,
        user_whatsapp: formData.whatsapp,
        tipo_chip: formData.tipo_chip,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
        estado: "recibido",
        adjunto_url: attachedFile || undefined,
        messages: [
          {
            id: `msg-${Date.now()}`,
            ticket_id: "tk-temp",
            sender_id: "usr-demo",
            sender_name: formData.nombre,
            sender_role: "cliente",
            mensaje: `Orden creada en taller: ${formData.descripcion}`,
            created_at: new Date().toISOString(),
          }
        ]
      });

      router.push(`/panel/tickets/${newTicket.id}`);
    } catch (err) {
      console.error("Error al crear orden:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl font-sans">
      
      {/* Back button */}
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-xs text-[#6B6355] hover:text-[#FF5500] mb-6 transition-colors font-mono font-bold uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a mis órdenes
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF5500] bg-[#FAF8F3] px-2.5 py-0.5 rounded border border-[#D6CEC0] font-bold">
            PLANILLA DE INGRESO A BANCO
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#191C21] uppercase mt-2">
          Ingresar Placa a Servicio Técnico
        </h1>
        <p className="text-[#595245] text-xs sm:text-sm mt-1 font-medium">
          Completá los datos de la placa. Te responderemos con el diagnóstico inicial en menos de 24/48 hs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FAF8F3] border-2 border-[#D6CEC0] p-6 sm:p-8 rounded-xl shadow-sm">
        
        {/* Contacto & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-2 border-[#EAE3D5] pb-6">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Tu Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-3.5 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-3.5 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#FF5500] mb-1.5 font-mono uppercase flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              WhatsApp (Obligatorio)
            </label>
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

        {/* Tipo de Chip / Placa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Microcontrolador / Módulo
            </label>
            <select
              value={formData.tipo_chip}
              onChange={(e) => setFormData({ ...formData, tipo_chip: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-mono font-bold"
            >
              <option value="ESP32-WROOM-32">ESP32 Estándar (WROOM / NodeMCU / Wemos)</option>
              <option value="ESP32-S3 / S2">ESP32-S3 o ESP32-S2 (USB Nativo / AI)</option>
              <option value="ESP32-C3 / C6">ESP32-C3 o ESP32-C6 (RISC-V)</option>
              <option value="ESP8266 / D1 Mini">ESP8266 / NodeMCU ESP-12 / D1 Mini</option>
              <option value="Sonoff / Shelly / Domótica">Módulo comercial (Sonoff, Shelly, relé Tuya)</option>
              <option value="Otro Microcontrolador">Otro (Arduino, STM32, Raspberry Pi Pico)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Título descriptivo de la falla
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Boot loop tras OTA / No detecta puerto COM"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Descripción detallada */}
        <div>
          <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
            Descripción técnica del problema
          </label>
          <textarea
            rows={4}
            required
            placeholder="Explicá cómo ocurrió el problema, qué fuente de alimentación usás, si el microcontrolador calienta o pegá los logs de error..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
          />
        </div>

        {/* 1 Adjunto */}
        <div>
          <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
            Adjuntar 1 foto de la placa o archivo de log (Opcional)
          </label>
          <div
            onClick={handleSimulateFile}
            className="border-2 border-dashed border-[#D0C7B6] hover:border-[#FF5500] rounded-xl p-6 text-center bg-[#F3EFE6] cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 mx-auto text-[#736B5E] mb-2" />
            <p className="text-xs font-bold text-[#191C21]">
              {attachedFile ? `✓ Archivo adjunto: ${attachedFile}` : "Hacé clic para seleccionar una foto o archivo de log"}
            </p>
            <p className="text-[10px] text-[#736B5E] mt-1 font-mono">PNG, JPG, TXT o INO hasta 10MB</p>
          </div>
          {attachedFile && (
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono bg-[#EAE3D5] text-[#191C21] px-3 py-1.5 rounded-lg border border-[#D0C7B6]">
              <span>📎 {attachedFile}</span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-[#C62828] font-bold hover:underline"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Logística Rosario */}
        <div className="p-4 bg-[#EAE3D5] rounded-lg border border-[#D0C7B6] text-xs text-[#524B3E] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#191C21] font-mono uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Coordinación en Rosario & Envíos:</span>
          </div>
          <p>
            En <strong>Rosario</strong> coordinamos entrega física en punto de encuentro (Centro, Pellegrini o Pichincha). Para el resto del país podés despachar la placa por correo. Si el problema es solo de código o configuración, se resuelve 100% online.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider border border-[#D94800]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Generando Orden de Trabajo...
            </span>
          ) : (
            <>
              <Wrench className="w-4 h-4 -rotate-45" />
              Enviar Placa a Diagnóstico
            </>
          )}
        </button>

      </form>
    </div>
  );
}

export default function NuevoTicketPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[#595245] font-mono">Cargando planilla...</div>}>
      <TicketForm />
    </Suspense>
  );
}
