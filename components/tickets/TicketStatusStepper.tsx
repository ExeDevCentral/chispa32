import { Check, Clock, AlertTriangle, Cpu, Wrench, CheckCircle2 } from "lucide-react";
import { TicketStatus } from "@/types";

const STAGES: { key: TicketStatus; label: string; shortLabel: string; icon: typeof Clock }[] = [
  { key: "recibido", label: "1. Placa Recibida", shortLabel: "Recibida", icon: Clock },
  { key: "en_diagnostico", label: "2. Banco de Diagnóstico", shortLabel: "Diagnóstico", icon: Cpu },
  { key: "en_reparacion", label: "3. Flasheo / Reparación", shortLabel: "Reparación", icon: Wrench },
  { key: "resuelto", label: "4. Validada en Banco", shortLabel: "Validada", icon: CheckCircle2 },
  { key: "entregado", label: "5. Entregada al Cliente", shortLabel: "Entregada", icon: Check },
];

export function TicketStatusStepper({ currentStatus }: { currentStatus: TicketStatus }) {
  const currentIdx = STAGES.findIndex((s) => s.key === currentStatus);
  const isWaiting = currentStatus === "esperando_cliente";
  const isCancelled = currentStatus === "cancelado";

  return (
    <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] p-5 sm:p-6 rounded-xl font-mono">
      
      {/* Alerta si espera respuesta del cliente */}
      {isWaiting && (
        <div className="mb-6 flex items-center gap-3 p-3.5 bg-[#FFF4E5] border-2 border-[#FFB300] rounded-lg text-[#8C5800] text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-[#FF9800]" />
          <span>
            <strong>ESPERANDO CONFIRMACIÓN DEL CLIENTE:</strong> Revisá el chat para confirmar el presupuesto o instrucciones de taller.
          </span>
        </div>
      )}

      {isCancelled && (
        <div className="mb-6 flex items-center gap-3 p-3.5 bg-[#FFEBEE] border-2 border-[#E53935] rounded-lg text-[#C62828] text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>ORDEN CANCELADA O CERRADA EN TALLER.</span>
        </div>
      )}

      {/* Pipeline Stepper */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-[#D6CEC0] -translate-y-1/2 z-0" />
        
        <div className="flex items-center justify-between relative z-10">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentIdx || currentStatus === "entregado";
            const isCurrent = stage.key === currentStatus || (isWaiting && stage.key === "en_diagnostico");
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                    isDone
                      ? "bg-[#2E7D32] text-white shadow-sm border border-[#1B5E20]"
                      : isCurrent
                      ? "bg-[#FF5500] text-white ring-4 ring-[#FF5500]/20 shadow-md animate-pulse border border-[#D94800]"
                      : "bg-[#EAE3D5] text-[#8C8474] border-2 border-[#D0C7B6]"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>

                <span
                  className={`text-[10px] sm:text-xs mt-2 font-bold text-center max-w-[70px] sm:max-w-[110px] uppercase tracking-tight ${
                    isCurrent
                      ? "text-[#FF5500]"
                      : isDone
                      ? "text-[#191C21]"
                      : "text-[#8C8474]"
                  }`}
                >
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{stage.shortLabel}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
