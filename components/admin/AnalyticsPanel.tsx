"use client";

import { useMemo } from "react";
import { Ticket } from "@/types";
import { formatCurrencyARS } from "@/lib/utils";
import {
  TrendingUp, Cpu, Clock, Users, Wallet, Package, MapPin, Route, X, Wrench,
} from "lucide-react";

interface AnalyticsPanelProps {
  tickets: Ticket[];
}

function daysBetween(from?: string, to?: string): number | null {
  if (!from || !to) return null;
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (isNaN(a) || isNaN(b) || b < a) return null;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function AnalyticsPanel({ tickets }: AnalyticsPanelProps) {
  const stats = useMemo(() => {
    const entregados = tickets.filter((t) => t.estado === "entregado");
    const enBanco = tickets.filter(
      (t) =>
        t.estado !== "entregado" &&
        t.estado !== "cancelado"
    );
    const cancelados = tickets.filter((t) => t.estado === "cancelado");

    const ingresos = entregados.reduce((acc, t) => acc + (t.presupuesto || 0), 0);
    const costos = entregados.reduce((acc, t) => acc + (t.costo_repuestos || 0), 0);
    const margen = ingresos - costos;

    // Tiempo promedio de resolución (días) desde fecha_ingreso hasta fecha_entrega
    const resoluciones = entregados
      .map((t) => daysBetween(t.fecha_ingreso || t.created_at, t.fecha_entrega))
      .filter((d): d is number => d !== null);
    const tiempoPromedio =
      resoluciones.length > 0
        ? resoluciones.reduce((a, b) => a + b, 0) / resoluciones.length
        : null;

    // Chips más comunes
    const chipCount = new Map<string, number>();
    tickets.forEach((t) => {
      chipCount.set(t.tipo_chip, (chipCount.get(t.tipo_chip) || 0) + 1);
    });
    const topChips = [...chipCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Tipos de trabajo más comunes
    const workCount = new Map<string, number>();
    tickets.forEach((t) => {
      const wt = t.tipo_trabajo || "sin_clasificar";
      workCount.set(wt, (workCount.get(wt) || 0) + 1);
    });
    const topWorks = [...workCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Origen
    const origenCount = new Map<string, number>();
    tickets.forEach((t) => {
      const o = t.origen || "web";
      origenCount.set(o, (origenCount.get(o) || 0) + 1);
    });
    const topOrigenes = [...origenCount.entries()].sort((a, b) => b[1] - a[1]);

    // Modo de servicio
    const modoCount = new Map<string, number>();
    tickets.forEach((t) => {
      const m = t.modo_servicio || "presencial";
      modoCount.set(m, (modoCount.get(m) || 0) + 1);
    });
    const topModos = [...modoCount.entries()].sort((a, b) => b[1] - a[1]);

    // Clientes recurrentes (mismo email con >1 pedido)
    const emailCount = new Map<string, { nombre: string; count: number }>();
    tickets.forEach((t) => {
      const k = (t.user_email || "anon").trim().toLowerCase();
      const cur = emailCount.get(k) || { nombre: t.user_nombre || k, count: 0 };
      cur.count += 1;
      emailCount.set(k, cur);
    });
    const recurrentes = [...emailCount.entries()]
      .filter(([, v]) => v.count > 1)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    return {
      total: tickets.length,
      entregados: entregados.length,
      enBanco: enBanco.length,
      cancelados: cancelados.length,
      ingresos,
      costos,
      margen,
      tiempoPromedio,
      topChips,
      topWorks,
      topOrigenes,
      topModos,
      recurrentes,
    };
  }, [tickets]);

  const tasaExito =
    stats.total > 0 ? Math.round((stats.entregados / stats.total) * 100) : 0;

  const labelWork: Record<string, string> = {
    flasheo: "Flasheo / Firmware",
    desbrickeado: "Desbrickeado",
    debug: "Debug / Código",
    reparacion_hw: "Reparación HW",
    wled: "WLED",
    domotica: "Domótica",
    otro: "Otro",
    sin_clasificar: "Sin clasificar",
  };

  const labelOrigen: Record<string, string> = {
    web: "Web / Google",
    whatsapp: "WhatsApp",
    presencial: "En taller",
    recomendacion: "Recomendación",
  };

  const labelModo: Record<string, string> = {
    presencial: "Presencial",
    envio: "Envío",
    online: "Online",
  };

  const cardBase =
    "bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-5 shadow-sm";

  const cardInfo =
    "bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-5 shadow-sm";

  return (
    <div className="space-y-8">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide">
            <TrendingUp className="w-3.5 h-3.5 text-[#FF5500]" /> Total pedidos
          </div>
          <p className="text-3xl font-black text-[#191C21] mt-2">{stats.total}</p>
        </div>
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#2E7D32] uppercase tracking-wide">
            <Package className="w-3.5 h-3.5" /> Entregados
          </div>
          <p className="text-3xl font-black text-[#2E7D32] mt-2">{stats.entregados}</p>
        </div>
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#FF5500] uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" /> En banco
          </div>
          <p className="text-3xl font-black text-[#FF5500] mt-2">{stats.enBanco}</p>
        </div>
        <div className={cardBase}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#C62828] uppercase tracking-wide">
            <X className="w-3.5 h-3.5" /> Cancelados
          </div>
          <p className="text-3xl font-black text-[#C62828] mt-2">{stats.cancelados}</p>
        </div>
      </div>

      {/* Facturación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide mb-3">
            <Wallet className="w-3.5 h-3.5 text-[#FF5500]" /> Ingresos (entregados)
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#191C21]">
            {formatCurrencyARS(stats.ingresos)}
          </p>
        </div>
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide mb-3">
            <Package className="w-3.5 h-3.5 text-[#736B5E]" /> Costos repuestos
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#191C21]">
            {formatCurrencyARS(stats.costos)}
          </p>
        </div>
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#2E7D32] uppercase tracking-wide mb-3">
            <TrendingUp className="w-3.5 h-3.5" /> Margen bruto
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#2E7D32]">
            {formatCurrencyARS(stats.margen)}
          </p>
        </div>
      </div>

      {/* Tiempo y tasa de éxito */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide mb-3">
            <Clock className="w-3.5 h-3.5 text-[#FF5500]" /> Tiempo promedio resolución
          </div>
          <p className="text-2xl font-black text-[#191C21]">
            {stats.tiempoPromedio !== null
              ? `${stats.tiempoPromedio.toFixed(1)} días`
              : "Sin datos aún"}
          </p>
          <p className="text-[10px] text-[#736B5E] mt-1 font-mono">
            desde ingreso hasta entrega
          </p>
        </div>
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide mb-3">
            <Cpu className="w-3.5 h-3.5 text-[#FF5500]" /> Tasa de éxito
          </div>
          <p className="text-2xl font-black text-[#FF5500]">{tasaExito}%</p>
          <p className="text-[10px] text-[#736B5E] mt-1 font-mono">
            entregados / total de pedidos
          </p>
        </div>
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#736B5E] uppercase tracking-wide mb-3">
            <Users className="w-3.5 h-3.5 text-[#FF5500]" /> Clientes recurrentes
          </div>
          <p className="text-2xl font-black text-[#191C21]">{stats.recurrentes.length}</p>
          <p className="text-[10px] text-[#736B5E] mt-1 font-mono">
            con más de 1 pedido
          </p>
        </div>
      </div>

      {/* Chips más comunes */}
      <div className={cardInfo}>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#191C21] uppercase tracking-wide mb-4">
          <Cpu className="w-4 h-4 text-[#FF5500]" /> Chips más frecuentes
        </div>
        {stats.topChips.length === 0 ? (
          <p className="text-xs text-[#736B5E]">Todavía no hay pedidos registrados.</p>
        ) : (
          <div className="space-y-2">
            {stats.topChips.map(([chip, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={chip}>
                  <div className="flex justify-between text-xs font-bold text-[#191C21] mb-1">
                    <span>{chip}</span>
                    <span className="text-[#736B5E]">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-[#EAE3D5] rounded overflow-hidden">
                    <div className="h-full bg-[#FF5500]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tipo de trabajo / Origen / Modo + recurrentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#191C21] uppercase tracking-wide mb-4">
            <Wrench className="w-4 h-4 text-[#FF5500]" /> Tipo de trabajo
          </div>
          {stats.topWorks.length === 0 ? (
            <p className="text-xs text-[#736B5E]">Sin datos.</p>
          ) : (
            <div className="space-y-1.5">
              {stats.topWorks.map(([k, n]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-[#191C21] font-semibold">{labelWork[k] || k}</span>
                  <span className="text-[#736B5E] font-mono">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardInfo}>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#191C21] uppercase tracking-wide mb-4">
            <MapPin className="w-4 h-4 text-[#FF5500]" /> Origen / Modo
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {stats.topOrigenes.map(([k, n]) => (
                <span key={k} className="px-2.5 py-1 bg-[#EAE3D5] rounded-lg text-[11px] font-mono font-bold text-[#191C21]">
                  {labelOrigen[k] || k} · {n}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {stats.topModos.map(([k, n]) => (
                <span key={k} className="px-2.5 py-1 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-lg text-[11px] font-mono font-bold text-[#E64A00]">
                  {labelModo[k] || k} · {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clientes recurrentes */}
      <div className={cardInfo}>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#191C21] uppercase tracking-wide mb-4">
          <Route className="w-4 h-4 text-[#FF5500]" /> Clientes recurrentes
        </div>
        {stats.recurrentes.length === 0 ? (
          <p className="text-xs text-[#736B5E]">
            Aún no hay clientes con más de un pedido. A medida que crezca el volumen aparecerán acá.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stats.recurrentes.map(([, v]) => (
              <div key={v.nombre} className="flex justify-between items-center bg-[#F3EFE6] rounded-lg px-3 py-2 text-sm">
                <span className="font-semibold text-[#191C21]">{v.nombre}</span>
                <span className="text-[#736B5E] font-mono">{v.count} pedidos</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
