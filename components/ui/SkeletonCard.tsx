/**
 * Skeleton loaders para el dashboard de tickets.
 * Usá <TicketCardSkeleton /> para el panel cliente/admin
 * y <MetricCardSkeleton /> para los contadores superiores.
 */

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#EAE3D5] rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-[#FAF8F3]/60 to-transparent" />
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 flex items-center justify-between shadow-sm">
      <div className="space-y-2.5">
        <Shimmer className="h-2.5 w-28 rounded" />
        <Shimmer className="h-8 w-12 rounded" />
      </div>
      <Shimmer className="w-11 h-11 rounded-lg" />
    </div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-2.5 flex-1">
          {/* Badges row */}
          <div className="flex items-center gap-2">
            <Shimmer className="h-5 w-20 rounded" />
            <Shimmer className="h-5 w-24 rounded" />
            <Shimmer className="h-4 w-16 rounded" />
          </div>
          {/* Título */}
          <Shimmer className="h-5 w-3/4 rounded" />
          {/* Descripción */}
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-2/3 rounded" />
        </div>
        {/* Badge/stepper placeholder */}
        <div className="shrink-0 border-t sm:border-t-0 border-[#EAE3D5] pt-2 sm:pt-0">
          <Shimmer className="h-6 w-28 rounded" />
        </div>
      </div>
    </div>
  );
}

export function AdminTicketCardSkeleton() {
  return (
    <div className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Shimmer className="h-5 w-20 rounded" />
            <Shimmer className="h-5 w-28 rounded" />
            <Shimmer className="h-5 w-20 rounded" />
          </div>
          <Shimmer className="h-5 w-3/4 rounded" />
          <Shimmer className="h-3.5 w-full rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="h-9 w-32 rounded-lg" />
          <Shimmer className="h-9 w-24 rounded-lg" />
          <Shimmer className="h-9 w-20 rounded-lg" />
        </div>
      </div>
      {/* Nota interna */}
      <Shimmer className="h-16 w-full rounded-lg" />
    </div>
  );
}
