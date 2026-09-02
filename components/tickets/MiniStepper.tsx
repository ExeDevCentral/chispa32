import { TicketStatus } from "@/types";

const STEPS: { key: TicketStatus; label: string }[] = [
  { key: "recibido",      label: "Recibida" },
  { key: "en_diagnostico", label: "Diagnóstico" },
  { key: "en_reparacion", label: "Reparación" },
  { key: "resuelto",      label: "Validada" },
  { key: "entregado",     label: "Entregada" },
];

// Mapeo de estados especiales al paso visual más cercano
const STATUS_TO_IDX: Record<TicketStatus, number> = {
  recibido:          0,
  en_diagnostico:    1,
  esperando_cliente: 1, // se muestra en diagnóstico pero con color diferente
  en_reparacion:     2,
  resuelto:          3,
  entregado:         4,
  cancelado:         -1,
};

interface MiniStepperProps {
  status: TicketStatus;
  /** Si true, muestra las etiquetas de texto bajo cada punto */
  showLabels?: boolean;
}

export function MiniStepper({ status, showLabels = false }: MiniStepperProps) {
  const currentIdx = STATUS_TO_IDX[status];
  const isWaiting = status === "esperando_cliente";
  const isCancelled = status === "cancelado";

  if (isCancelled) {
    return (
      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
        Cancelada
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Barra de pasos */}
      <div className="flex items-center gap-0.5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex items-center gap-0.5">
              {/* Punto del paso */}
              <div
                title={step.label}
                className={`
                  rounded-sm transition-all duration-300
                  ${showLabels ? "w-2 h-2" : "w-3 h-2.5"}
                  ${
                    isDone
                      ? "bg-[#2E7D32]"
                      : isCurrent
                      ? isWaiting
                        ? "bg-[#FF9800] animate-pulse"
                        : "bg-[#FF5500] ring-2 ring-[#FF5500]/30"
                      : "bg-[#D6CEC0]"
                  }
                `}
              />
              {/* Conector entre pasos */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 transition-all duration-300 ${showLabels ? "w-2" : "w-2"} ${
                    isDone ? "bg-[#2E7D32]" : "bg-[#D6CEC0]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Etiqueta del estado actual */}
      <span
        className={`text-[10px] font-mono font-bold uppercase leading-none ${
          isWaiting
            ? "text-[#E65100]"
            : currentIdx >= STEPS.length - 1
            ? "text-[#2E7D32]"
            : currentIdx >= 0
            ? "text-[#FF5500]"
            : "text-[#8C8474]"
        }`}
      >
        {isWaiting
          ? "Esperando confirmación"
          : currentIdx >= 0
          ? STEPS[currentIdx].label
          : status}
      </span>
    </div>
  );
}
