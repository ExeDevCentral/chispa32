"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, AlertTriangle, CheckCircle, Terminal, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

interface DiagnosticCase {
  id: string;
  symptom: string;
  category: string;
  diagnosis: string;
  solution: string;
  recommendedService: string;
  suggestedAction: string;
  riskLevel: "Bajo" | "Medio" | "Alto";
}

const DIAGNOSTIC_CASES: DiagnosticCase[] = [
  {
    id: "boot-loop",
    symptom: "El ESP32 se reinicia constantemente cada pocos segundos (Boot Loop)",
    category: "Crash / Bootloader",
    diagnosis: "Generalmente provocado por disparo del detector Brownout (fuente insuficiente de 3.3V), memoria flash corrupta tras OTA incompleto o error de Watchdog Timer (WDT).",
    solution: "Limpieza profunda de particiones SPIFFS/NVS, reflasheo del bootloader a bajo nivel y ajuste de condensador electrolítico en riel VIN.",
    recommendedService: "Diagnóstico & Desbrickeado ESP32",
    suggestedAction: "Traer o enviar placa para flasheo con programador UART dedicado.",
    riskLevel: "Medio",
  },
  {
    id: "no-com-port",
    symptom: "La computadora no reconoce el puerto COM / USB al conectar la placa",
    category: "Hardware & Driver",
    diagnosis: "Falla frecuente en el chip conversor USB-Serial (CH340, CP2102 o FTDI), cable micro-USB solo de carga sin líneas de datos, o diodo de protección en corto.",
    solution: "Revisión de líneas D+/D- con osciloscopio/multímetro, reemplazo de regulador AMS1117 o bypass con adaptador FTDI externo.",
    recommendedService: "Diagnóstico & Desbrickeado ESP32",
    suggestedAction: "Probar primero con cable de datos comprobado antes de abrir ticket.",
    riskLevel: "Medio",
  },
  {
    id: "esptool-timeout",
    symptom: "Tira error 'A fatal error occurred: Failed to connect to ESP32: Timed out waiting for packet header'",
    category: "Flasheo & Strapping",
    diagnosis: "El ESP32 no logra entrar en modo Download (UART Bootloader). Suele ocurrir cuando el pin GPIO0 no pasa a GND en el momento adecuado o hay periféricos en pines de strapping (GPIO2/12/15).",
    solution: "Inserción manual de capacitor de 10uF entre pin EN y GND, o reprogramación forzada manteniendo botón BOOT.",
    recommendedService: "Diagnóstico & Desbrickeado ESP32",
    suggestedAction: "Podemos desoldar o puentear la secuencia de auto-reset si el botón falló.",
    riskLevel: "Bajo",
  },
  {
    id: "heap-freeze",
    symptom: "El código funciona bien al principio pero se congela tras varias horas de uso",
    category: "Memoria & FreeRTOS",
    diagnosis: "Fuga de memoria Heap (Memory Leak) producida por manipulación intensiva del objeto String en C++, o bloqueo de tareas FreeRTOS sin yield()/vTaskDelay().",
    solution: "Auditoría estática de código, reemplazo de Strings dinámicos por buffers estáticos char[], e instrumentación con esp_get_free_heap_size().",
    recommendedService: "Portabilidad & Debugging de Código",
    suggestedAction: "Subir código fuente .ino / .cpp en el ticket para análisis.",
    riskLevel: "Bajo",
  },
  {
    id: "sonoff-tasmota",
    symptom: "Tengo un módulo Sonoff / Shelly / relé Tuya y quiero que funcione local con Home Assistant",
    category: "Domótica & Firmware",
    diagnosis: "El firmware de fábrica depende de servidores chinos y tiene latencia. Requiere apertura y soldadura momentánea de pines TX/RX/3V3/GND para cargar ESPHome o Tasmota.",
    solution: "Flasheo limpio de ESPHome con entidad de relé, sensor de corriente y reconexión rápida MQTT sin nubes externas.",
    recommendedService: "Reflasheo & Configuración IoT",
    suggestedAction: "Coordinar entrega de módulos en Rosario o soporte remoto.",
    riskLevel: "Bajo",
  },
];

export function DiagnosticTool() {
  const [selectedCase, setSelectedCase] = useState<DiagnosticCase>(DIAGNOSTIC_CASES[0]);

  return (
    <section id="diagnostico" className="py-20 bg-[#090D16] border-t border-slate-800 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Herramienta Interactiva
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Autodiagnóstico Express de tu Microcontrolador
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Seleccioná el síntoma que tiene tu placa para ver el diagnóstico preliminar y la solución técnica recomendada.
          </p>
        </div>

        {/* Diagnostic Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Selector de Síntomas */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold px-1">
              ¿Qué le ocurre a tu placa?
            </h3>
            {DIAGNOSTIC_CASES.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${
                    isSelected
                      ? "bg-slate-900 border-amber-500/80 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <Cpu className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                  <div>
                    <span className="font-semibold block text-slate-200">{c.symptom}</span>
                    <span className="text-[10px] font-mono text-cyan-400/80 mt-1 inline-block">
                      Categoría: {c.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Resultado del Diagnóstico */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-slate-200 text-sm sm:text-base">
                  Informe de Diagnóstico Preliminar
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                selectedCase.riskLevel === "Alto" 
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}>
                Dificultad: {selectedCase.riskLevel}
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                  🔍 Causa Raíz Probable:
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  {selectedCase.diagnosis}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Solución Técnica Aplicable:
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  {selectedCase.solution}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Servicio Sugerido:</span>
                  <span className="text-sm font-semibold text-amber-400">
                    {selectedCase.recommendedService}
                  </span>
                </div>

                <Link
                  href={`/panel/nuevo-ticket?sintoma=${encodeURIComponent(selectedCase.symptom)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20"
                >
                  Abrir Ticket con este Problema
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
