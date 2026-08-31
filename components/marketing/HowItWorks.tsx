import { ClipboardCheck, Truck, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const WORKSHOP_STEPS = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Ingreso de la Orden",
    desc: "Cargás la orden online con el modelo de chip (ESP32, S3, ESP8266) y la descripción de la falla. Podés adjuntar foto o log de error.",
  },
  {
    step: "02",
    icon: Truck,
    title: "Recepción en Rosario o Envío",
    desc: "Coordinamos entrega física en punto de encuentro en Rosario (Centro, Pellegrini o Pichincha) o nos despachás la encomienda por correo.",
  },
  {
    step: "03",
    icon: Cpu,
    title: "Banco de Prueba & Flasheo",
    desc: "Conectamos la placa a instrumental de testeo, medimos tensiones de 3.3V, recuperamos bootloaders corruptos y cargamos el firmware solicitado.",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Validación Final y Entrega",
    desc: "Realizamos test de boot en frío y prueba de radiofrecuencia (WiFi/MQTT). Te entregamos la placa funcionando y el reporte en tu panel.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-20 bg-[#FAF8F3] border-b-2 border-[#D6CEC0]">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE3D5] text-[#191C21] rounded font-mono text-xs font-bold uppercase tracking-wider border border-[#D0C7B6]">
            <span>PROTOCOLO OPERATIVO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191C21] uppercase mt-3 tracking-tight">
            ¿Cómo Ingresar tu Placa a Taller?
          </h2>
          <p className="text-[#595245] mt-2 text-sm sm:text-base font-medium">
            Flujo de trabajo estructurado y con seguimiento continuo desde tu panel.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKSHOP_STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#F3EFE6] border-2 border-[#D6CEC0] rounded-xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#D6CEC0] pb-3">
                    <span className="text-2xl font-black font-mono text-[#FF5500]">
                      #{s.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#FAF8F3] border border-[#D0C7B6] flex items-center justify-center text-[#191C21]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-[#191C21] text-base mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-[#595245] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D6CEC0] text-[11px] font-mono font-bold text-[#8C8474]">
                  FASE {s.step} DE 04
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/panel/nuevo-ticket"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-xs sm:text-sm transition-all shadow-md uppercase tracking-wider border border-[#D94800]"
          >
            Ingresar Orden de Servicio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
