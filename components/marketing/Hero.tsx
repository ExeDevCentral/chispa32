import Link from "next/link";
import { Wrench, ArrowRight, ShieldCheck, Zap, Terminal, Activity, CheckSquare, Gauge } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F3EFE6] py-14 sm:py-20 text-[#191C21] bg-blueprint-grid border-b-2 border-[#D6CEC0]">
      
      {/* Marcadores de regla milimetrada en esquinas */}
      <div className="absolute top-3 left-4 font-mono text-[10px] text-[#A69E8F] tracking-widest hidden md:block">
        [TALLER ELECTRÓNICO ROSARIO — BANCO #01]
      </div>
      <div className="absolute top-3 right-4 font-mono text-[10px] text-[#A69E8F] tracking-widest hidden md:block">
        ESPRESSIF ESP32 / S2 / S3 / C3 / ESP8266
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Badge Stamped estilo etiqueta técnica de taller */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#EAE3D5] border-2 border-[#C8BFA $\to$ #C8BFA] border-[#C8BFA8] text-[#191C21] text-xs font-mono font-bold mb-6 uppercase tracking-wider shadow-sm">
            <span className="w-2.5 h-2.5 bg-[#FF5500] rounded-sm" />
            Servicio Técnico Embebido • Reparación & Reflasheo en Rosario
          </div>

          {/* Heading Principal */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl text-[#191C21] uppercase leading-[1.05]">
            Taller de reparación y reflasheo de microcontroladores{" "}
            <span className="bg-[#191C21] text-[#FAF8F3] px-3 py-0.5 inline-block transform -rotate-1 rounded-sm border-b-4 border-[#FF5500]">
              ESP32 & IoT
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#524B3E] max-w-2xl font-medium leading-relaxed">
            ¿Placa brickeada, bootloader roto, firmware trabado o código que se cuelga? 
            Diagnóstico a bajo nivel con banco de pruebas UART, recuperación de flash SPI y puesta a punto.
          </p>

          {/* Botones de Acción de Taller */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-mono">
            <Link
              href="/panel/nuevo-ticket"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:-translate-y-0.5 uppercase tracking-wider border border-[#D94800]"
            >
              <Wrench className="w-5 h-5 -rotate-45" />
              Ingresar Placa a Taller
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/5493410000000?text=Hola%20Chispa32!%20Tengo%20una%20placa%20ESP32%20con%20problemas%20para%20revisar%20en%20taller"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#191C21] hover:bg-[#2C3038] text-[#FAF8F3] font-bold text-sm sm:text-base transition-all shadow-md hover:-translate-y-0.5 uppercase tracking-wider"
            >
              <Terminal className="w-5 h-5 text-[#FF5500]" />
              Consulta Rápida de Guardia
            </a>
          </div>

          {/* Tarjeta de Banco de Pruebas (Osciloscopio / Monitor Serial Físico) */}
          <div className="mt-12 w-full max-w-2xl bg-[#191C21] border-4 border-[#2D323B] rounded-xl p-5 shadow-xl text-left font-mono text-xs text-[#EAE3D5] relative">
            
            {/* Header del instrumento */}
            <div className="flex items-center justify-between border-b border-[#343A46] pb-3 mb-3 text-[11px]">
              <div className="flex items-center gap-2 text-[#9FA6B2]">
                <Gauge className="w-4 h-4 text-[#FF5500]" />
                <span className="font-bold text-[#FAF8F3]">BANCO_PRUEBAS_01 // UART 115200 BAUD</span>
              </div>
              <span className="text-[#38D39F] font-bold bg-[#1C3329] px-2 py-0.5 rounded text-[10px] border border-[#235840]">
                VOLTAJE VIN: 5.04V [OK]
              </span>
            </div>

            {/* Readout de banco */}
            <div className="space-y-1 text-[11px] sm:text-xs">
              <p className="text-[#8C94A0]">&gt; Conectando sonda lógica a GPIO0 / EN / TX0 / RX0...</p>
              <p className="text-[#FFB300]">&gt; Chip ID detectado: ESP32-D0WD-V3 (4MB Flash SPI)</p>
              <p className="text-[#FF6B6B] font-bold">&gt; ERROR SÍNTOMA: Bootloader checksum mismatch / Crash 0x10 (RTCWDT)</p>
              <p className="text-[#FAF8F3] bg-[#2D323B] p-2 rounded my-2 border-l-2 border-[#FF5500]">
                🔧 <strong className="text-[#FF9E79]">ACCIÓN TALLER CHISPA32:</strong> Erase físico de particiones flash → Carga de bootloader limpio con esptool → Calibración de strapping pins.
              </p>
              <p className="text-[#38D39F] font-bold">&gt; RESULTADO: Placa 100% recuperada y validada en banco.</p>
            </div>
          </div>

          {/* Badges de Garantía de Taller */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl border-t-2 border-[#D6CEC0] pt-6 text-[#524B3E] text-xs sm:text-sm font-mono font-bold">
            <div className="flex items-center justify-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#FF5500]" /> Test en Banco Físico
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" /> Diagnóstico 24/48hs
            </div>
            <div className="flex items-center justify-center gap-2">
              <Wrench className="w-4 h-4 text-[#FF5500]" /> Tasmota • ESPHome
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#191C21]">🇦🇷 Rosario</span> Recepción Local
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
