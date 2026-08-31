import Link from "next/link";
import { Check, Wrench, ShieldCheck, Clock } from "lucide-react";
import { formatCurrencyARS } from "@/lib/utils";

const WORKSHOP_TIERS = [
  {
    name: "Diagnóstico & Flasheo Simple",
    badge: "TRABAJO BÁSICO",
    price: 8500,
    time: "24 a 48 hs de banco",
    description: "Para placas que no bootean, quedaron trabadas en un ciclo de reset o requieren erase completo de memoria flash.",
    features: [
      "Lectura de registros y sonda por UART",
      "Erase físico de memoria SPI Flash",
      "Restauración de bootloader original",
      "Test de consumo y riel de 3.3V",
      "Informe técnico de salida",
    ],
    highlight: false,
  },
  {
    name: "Flasheo & Nodo Domótico",
    badge: "MÁS SOLICITADO",
    price: 12000,
    time: "24 a 48 hs de banco",
    description: "Para módulos Sonoff, Shelly o placas que querés dejar integradas localmente en Home Assistant o WLED.",
    features: [
      "Todo lo incluido en Flasheo Simple",
      "Carga de ESPHome, Tasmota o WLED",
      "Generación de archivo .yaml a medida",
      "Configuración de sensores y relés",
      "Calibración de broker MQTT local",
      "Guía de conexión para tu red",
    ],
    highlight: true,
  },
  {
    name: "Debugging de Código & FreeRTOS",
    badge: "PROYECTO COMPLEJO",
    price: 18000,
    time: "48 a 72 hs",
    description: "Para estudiantes o desarrolladores con código que se cuelga, caídas de memoria Heap o migración a PlatformIO.",
    features: [
      "Auditoría técnica de código fuente",
      "Detección y corrección de Memory Leaks",
      "Migración de Arduino a PlatformIO / ESP-IDF",
      "Separación de tareas en FreeRTOS",
      "Rutina de Auto-Reconnect WiFi probada",
      "Garantía de funcionamiento de código",
    ],
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="precios" className="py-16 sm:py-20 bg-[#F3EFE6] border-b-2 border-[#D6CEC0]">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE3D5] text-[#191C21] rounded font-mono text-xs font-bold uppercase tracking-wider border border-[#D0C7B6]">
            <span>TARIFARIO OFICIAL DE TALLER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191C21] uppercase mt-3 tracking-tight">
            Valores Transparentes en Pesos Argentinos
          </h2>
          <p className="text-[#595245] mt-2 text-sm sm:text-base font-medium">
            Presupuesto claro antes de tocar la placa. Si el microcontrolador sufrió un daño físico irreparable, solo se abona el diagnóstico básico.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-sans">
          {WORKSHOP_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 flex flex-col justify-between transition-all duration-200 ${
                tier.highlight
                  ? "bg-[#FAF8F3] border-4 border-[#FF5500] shadow-xl relative scale-100 lg:-translate-y-2"
                  : "bg-[#FAF8F3] border-2 border-[#D6CEC0] hover:border-[#A89E8D]"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5500] text-white text-[11px] font-black uppercase px-4 py-1 rounded shadow-sm font-mono tracking-wider">
                  ★ {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between border-b border-[#D6CEC0] pb-4">
                  <h3 className="font-extrabold text-lg text-[#191C21]">{tier.name}</h3>
                  {!tier.highlight && (
                    <span className="text-[10px] font-mono font-bold text-[#6B6355] bg-[#EAE3D5] px-2 py-0.5 rounded uppercase">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#595245] mt-3 min-h-[36px] leading-relaxed">
                  {tier.description}
                </p>

                <div className="mt-6 border-b border-[#D6CEC0] pb-6 font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#191C21]">
                      {formatCurrencyARS(tier.price)}
                    </span>
                    <span className="text-xs text-[#736B5E]">/ placa</span>
                  </div>
                  <p className="text-xs text-[#FF5500] font-bold mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Tiempo: {tier.time}
                  </p>
                </div>

                <ul className="mt-6 space-y-3 font-mono text-xs text-[#332E27]">
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D6CEC0]">
                <Link
                  href={`/panel/nuevo-ticket?paquete=${encodeURIComponent(tier.name)}`}
                  className={`w-full py-3.5 rounded-lg font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                    tier.highlight
                      ? "bg-[#FF5500] hover:bg-[#E64D00] text-white shadow-md border border-[#D94800]"
                      : "bg-[#191C21] hover:bg-[#2D323B] text-[#FAF8F3]"
                  }`}
                >
                  <Wrench className="w-4 h-4 -rotate-45" />
                  Solicitar este trabajo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Garantía de Taller */}
        <div className="mt-12 p-6 rounded-xl bg-[#FAF8F3] border-2 border-[#D6CEC0] max-w-2xl mx-auto flex items-center gap-4 text-xs text-[#524B3E]">
          <ShieldCheck className="w-9 h-9 text-[#2E7D32] shrink-0" />
          <p>
            <strong className="text-[#191C21] font-bold">Compromiso de Taller:</strong> Todas las reparaciones y flasheos salen probadas en banco con test de boot en frío. Si la placa sufrió quemadura irreversible de silicio, se te entrega el informe técnico detallado.
          </p>
        </div>

      </div>
    </section>
  );
}
