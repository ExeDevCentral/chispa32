"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTicketStore } from "@/lib/ticket-store";
import { useCurrentUser } from "@/lib/auth";
import { uploadPhotoFile } from "@/lib/supabase-service";
import { TicketPriority } from "@/types";
import { Wrench, UploadCloud, ArrowLeft, MapPin, Phone, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";

function TicketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createTicket } = useTicketStore();
  const { user, email: userEmail, nombre: userName, isLoading: isAuthLoading } = useCurrentUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialPackage = searchParams.get("paquete") || "";

  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: isAuthLoading ? "" : userName || "",
    email: isAuthLoading ? "" : userEmail || "",
    whatsapp: "",
    tipo_chip: "ESP32-WROOM-32",
    tipo_trabajo: "flasheo",
    marca_dispositivo: "Espressif",
    origen: "web",
    modo_servicio: "presencial",
    titulo: initialPackage ? `Solicitud: ${initialPackage}` : "",
    descripcion: "",
    prioridad: "media" as TicketPriority,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    setUploadingFile(true);
    try {
      const uploadedUrl = await uploadPhotoFile(file);
      setAttachedUrl(uploadedUrl);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setAttachedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newTicket = await createTicket({
        user_id: user?.id || null,
        user_nombre: formData.nombre.trim(),
        user_email: formData.email.trim(),
        user_whatsapp: formData.whatsapp.trim(),
        tipo_chip: formData.tipo_chip,
        tipo_trabajo: formData.tipo_trabajo,
        marca_dispositivo: formData.marca_dispositivo,
        origen: formData.origen,
        modo_servicio: formData.modo_servicio,
        costo_repuestos: 0,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        prioridad: formData.prioridad,
        estado: "recibido",
        presupuesto: 0,
        adjunto_url: attachedUrl || undefined,
        messages: [
          {
            id: `msg-${Date.now()}`,
            ticket_id: "tk-temp",
            sender_id: user?.id || "usr-anon",
            sender_name: formData.nombre,
            sender_role: "cliente",
            mensaje: `Orden creada en banco de taller: ${formData.descripcion}`,
            created_at: new Date().toISOString(),
          },
        ],
      });

      router.push(`/panel/tickets/${newTicket.id}`);
    } catch (err) {
      console.error("Error al crear orden en Supabase:", err);
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
          Completá los datos de la placa y adjuntá fotos si las tenés. Te responderemos con el diagnóstico inicial en menos de 24/48 hs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FAF8F3] border-4 border-[#191C21] p-6 sm:p-8 rounded-2xl shadow-xl">
        
        {/* Contacto & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-2 border-[#EAE3D5] pb-6">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">Tu Nombre</label>
            <input
              type="text"
              required
              placeholder="Ej: Marcos Rossi"
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
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-3.5 py-2.5 text-xs text-[#191C21] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-[#FF5500] mb-1.5 font-mono uppercase">
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
              <option value="Controladora WLED">Controladora WLED / Tiras Pixel</option>
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

        {/* Segmentación del pedido (para análisis futuro) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y-2 border-[#EAE3D5] py-6">
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Tipo de trabajo
            </label>
            <select
              value={formData.tipo_trabajo}
              onChange={(e) => setFormData({ ...formData, tipo_trabajo: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-mono font-bold"
            >
              <option value="flasheo">Flasheo / Firmware</option>
              <option value="desbrickeado">Desbrickeado / Bootloader</option>
              <option value="debug">Debug / Código / FreeRTOS</option>
              <option value="reparacion_hw">Reparación de hardware</option>
              <option value="wled">Controladora WLED</option>
              <option value="domotica">Domótica / MQTT</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Marca / Dispositivo
            </label>
            <input
              type="text"
              placeholder="Espressif, Sonoff, Shelly..."
              value={formData.marca_dispositivo}
              onChange={(e) => setFormData({ ...formData, marca_dispositivo: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Cómo llegaste
            </label>
            <select
              value={formData.origen}
              onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-mono font-bold"
            >
              <option value="web">Web / Google</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="presencial">En el taller</option>
              <option value="recomendacion">Recomendación</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
              Modo de servicio
            </label>
            <select
              value={formData.modo_servicio}
              onChange={(e) => setFormData({ ...formData, modo_servicio: e.target.value })}
              className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] font-mono font-bold"
            >
              <option value="presencial">Presencial en Rosario</option>
              <option value="envio">Envío por correo</option>
              <option value="online">100% online (código)</option>
            </select>
          </div>
        </div>

        {/* Descripción detallada */}
        <div>
          <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
            Descripción técnica del problema / pedido
          </label>
          <textarea
            rows={4}
            required
            placeholder="Explicá cómo ocurrió el problema, qué fuente de alimentación usás, si el microcontrolador calienta o qué firmware/sensores precisás instalar..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full bg-[#F3EFE6] border-2 border-[#D0C7B6] rounded-lg px-4 py-3 text-xs sm:text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#8C8474]"
          />
        </div>

        {/* Subida real de Foto / Archivo */}
        <div>
          <label className="block text-xs font-bold text-[#191C21] mb-1.5 font-mono uppercase">
            Fotos de la placa o archivo de log (Guardado en Supabase)
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.txt,.ino,.cpp,.log"
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D0C7B6] hover:border-[#FF5500] rounded-xl p-6 text-center bg-[#F3EFE6] cursor-pointer transition-colors group"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-[#736B5E] group-hover:text-[#FF5500] transition-colors mb-2" />
              <p className="text-xs font-bold text-[#191C21]">
                Hacé clic para seleccionar una foto de tu placa o circuito
              </p>
              <p className="text-[10px] text-[#736B5E] mt-1 font-mono">
                Soporta JPG, PNG, WEBP, LOG o INO (hasta 15MB)
              </p>
            </div>
          ) : (
            <div className="bg-[#EAE3D5] p-3 rounded-xl border-2 border-[#D0C7B6] flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3 min-w-0">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-[#D0C7B6]"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#FF5500] shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-[#191C21] truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-[#736B5E]">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {uploadingFile ? "Subiendo a Supabase..." : "✓ Listo para adjuntar"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-[#C62828] hover:bg-[#D0C7B6] rounded-lg transition-colors"
                title="Quitar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Logística Rosario */}
        <div className="p-4 bg-[#EAE3D5] rounded-xl border border-[#D0C7B6] text-xs text-[#524B3E] space-y-1">
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
          disabled={loading || uploadingFile}
          className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider border border-[#D94800]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Guardando en Supabase...
            </span>
          ) : (
            <>
              <Wrench className="w-4 h-4 -rotate-45" />
              Generar Orden e Ingresar Placa a Taller
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
