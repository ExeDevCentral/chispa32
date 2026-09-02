"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const WORKSHOP_FAQS = [
  {
    q: "¿Qué microcontroladores y marcas de domótica reciben en taller?",
    a: "Recibimos toda la línea Espressif (ESP32 clásico, ESP32-S2, ESP32-S3, ESP32-C3, ESP8266, NodeMCU, Wemos D1 Mini), dispositivos Sonoff, Shelly y relés inteligentes basados en ESP. También brindamos soporte para placas Arduino y STM32.",
  },
  {
    q: "¿Dónde se realiza la entrega mano a mano en Rosario?",
    a: "Coordinamos puntos de entrega en zonas estratégicas de Rosario (Centro, Av. Pellegrini o Pichincha) de acuerdo a los turnos de guardia. También podés enviarla por cadetería urbana.",
  },
  {
    q: "¿Cómo funciona para envíos desde otras ciudades de Argentina?",
    a: "Nos despachás la placa por Andreani o Correo Argentino a nuestra sucursal de recepción en Rosario. Al finalizar las pruebas en banco, te la reenviamos en caja protegida con sobre antiestático.",
  },
  {
    q: "¿Qué sucede si el chip tiene una quemadura irreversible?",
    a: "Si el SoC sufrió una sobretensión que destruyó el silicio internamente, te adjuntamos el informe de banco en el ticket explicando la causa técnica y solo se abona el costo básico de diagnóstico.",
  },
  {
    q: "¿Puedo pedir soporte solo de código o firmware sin enviar la placa física?",
    a: "Sí. Para problemas de caídas de WiFi, desbordes de memoria Heap, configuración de Home Assistant / ESPHome o código C++ en PlatformIO, el trabajo se realiza 100% online compartiendo los archivos en la orden.",
  },
  {
    q: "¿Cuáles son las formas de pago?",
    a: "Transferencia bancaria / CBU / Alias en pesos argentinos y MercadoPago (dinero en cuenta, tarjetas de débito/crédito).",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE3D5] text-[#191C21] rounded font-mono text-xs font-bold tracking-wide border border-[#D0C7B6]">
            <span>Consultas operativas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191C21] mt-3 tracking-tight">
            Preguntas frecuentes de taller
          </h2>
          <p className="text-[#595245] mt-2 text-sm sm:text-base font-medium">
            Detalles sobre logística, garantías de banco y métodos de trabajo.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 font-sans">
          {WORKSHOP_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-[#191C21] hover:text-[#FF5500] transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C8474] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#FF5500]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#595245] border-t border-[#EAE3D5] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
