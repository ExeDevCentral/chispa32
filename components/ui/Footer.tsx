import Link from "next/link";
import { Wrench, MapPin, Mail, MessageSquare, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-4 border-[#191C21] bg-[#191C21] text-[#A69E8F] text-xs font-mono">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Brand de Taller */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#FF5500] text-white flex items-center justify-center font-black">
                <Wrench className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                CHISPA<span className="text-[#FF5500]">32</span>
              </span>
              <span className="text-[9px] bg-[#2C3038] text-[#FAF8F3] px-2 py-0.5 rounded uppercase">
                TALLER ELECTRÓNICO
              </span>
            </div>
            <p className="text-[#B5AC9E] text-xs leading-relaxed max-w-md font-sans">
              Banco de servicio técnico para microcontroladores ESP32, ESP8266 y desarrollo IoT. Recuperación de particiones flash, bootloaders dañados y programación para domótica local en Rosario, Argentina.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#FF9E79]">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Rosario, Santa Fe (Atención en punto de encuentro y envíos a todo el país)</span>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-[#FF5500]">
              Trabajos de Banco
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/#servicios" className="hover:text-white transition-colors">Desbrickeado ESP32 / S3</Link></li>
              <li><Link href="/#servicios" className="hover:text-white transition-colors">ESPHome & Tasmota</Link></li>
              <li><Link href="/#servicios" className="hover:text-white transition-colors">Controladoras WLED</Link></li>
              <li><Link href="/#servicios" className="hover:text-white transition-colors">FreeRTOS & Memory Leaks</Link></li>
              <li><Link href="/#servicios" className="hover:text-white transition-colors">Consultoría Maker 1 a 1</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-[#FF5500]">
              Canales de Guardia
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <a 
                  href="https://wa.me/5493410000000?text=Hola%20Chispa32!%20Tengo%20una%20consulta%20para%20el%20taller"
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FAF8F3] hover:text-[#38D39F] transition-colors font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#38D39F]" />
                  WhatsApp Técnico Directo
                </a>
              </li>
              <li>
                <a 
                  href="mailto:taller@chispa32.com" 
                  className="inline-flex items-center gap-1.5 text-[#B5AC9E] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF9E79]" />
                  taller@chispa32.com
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#272B33] border border-[#3A404D] text-[10px] text-[#FFB300]">
                  <Terminal className="w-3 h-3" />
                  Instrumental & IA de Diagnóstico
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2C3038] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#736B5E]">
          <p>© {new Date().getFullYear()} CHISPA32 WORKSHOP. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Taller de electrónica embebida en Rosario</span>
            <span className="text-[#FF5500]">⚡</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
