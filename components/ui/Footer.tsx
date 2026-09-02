import Link from "next/link";
import { Wrench, MapPin, Mail, MessageSquare, Terminal, Lock } from "lucide-react";
import { whatsappUrl, WORKSHOP_EMAIL } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-[#FAF8F3]/90 backdrop-blur-sm text-[#595245] text-xs font-mono">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#FF5500] text-white flex items-center justify-center font-black">
                <Wrench className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-extrabold text-lg text-[#191C21] tracking-tight">
                CHISPA<span className="text-[#FF5500]">32</span>
              </span>
              <span className="text-[9px] bg-[#EAE3D5] text-[#595245] px-2 py-0.5 rounded border border-[#D0C7B6]">
                Taller electrónico
              </span>
            </div>
            <p className="text-[#595245] text-xs leading-relaxed max-w-md font-sans">
              Banco de servicio técnico para microcontroladores ESP32, ESP8266 e IoT. Recuperación de flash SPI, bootloaders dañados y programación para domótica local en Rosario, Argentina.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#736B5E]">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Rosario, Santa Fe — recepción local y envíos a todo el país</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#FF5500]">
              Trabajos de banco
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/#servicios" className="hover:text-[#191C21] transition-colors">Desbrickeado ESP32 / S3</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#191C21] transition-colors">ESPHome y Tasmota</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#191C21] transition-colors">Controladoras WLED</Link></li>
              <li><Link href="/#servicios" className="hover:text-[#191C21] transition-colors">FreeRTOS y memory leaks</Link></li>
              <li><Link href="/#opiniones" className="hover:text-[#191C21] transition-colors">Opiniones de clientes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-xs tracking-wide text-[#FF5500]">
              Canales de guardia
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <a 
                  href={whatsappUrl("Hola Chispa32 — tengo una consulta para el taller")}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#191C21] hover:text-[#FF5500] transition-colors font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#2E7D32]" />
                  WhatsApp técnico directo
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${WORKSHOP_EMAIL}`} 
                  className="inline-flex items-center gap-1.5 text-[#595245] hover:text-[#191C21] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF5500]" />
                  {WORKSHOP_EMAIL}
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#EAE3D5] border border-[#D0C7B6] text-[10px] text-[#E64A00]">
                  <Terminal className="w-3 h-3" />
                  Diagnóstico asistido por IA
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#736B5E]">
          <p>© {new Date().getFullYear()} Chispa32 Workshop. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#736B5E] hover:text-[#FF5500] transition-colors"
              title="Acceso restringido técnico"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso a banco de trabajo</span>
            </Link>
            <div className="flex items-center gap-1">
              <span>Taller de electrónica embebida · Rosario</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
