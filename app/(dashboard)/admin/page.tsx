"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu, Send, MessageCircle, Search, Lock, ArrowRight, Save,
  Tag, MessageSquare, ExternalLink, Star, Plus, Trash2, Edit2, Check,
  X, Image as ImageIcon, DollarSign, Shield, Copy, Sparkles, Eye,
  EyeOff, Globe, Activity, ClipboardList, BarChart3
} from "lucide-react";
import { useTicketStore } from "@/lib/ticket-store";
import { useCurrentUser } from "@/lib/auth";
import {
  getReviews, deleteReviewInDB, toggleReviewApproval,
  getWorkshopPrices, saveWorkshopPrice,
  getQuickResponses, saveQuickResponse, deleteQuickResponseInDB,
  getQuickLinks, saveQuickLink, deleteQuickLinkInDB,
} from "@/lib/supabase-service";
import { TicketStatus, Review, WorkshopPrice, QuickResponse, QuickLink } from "@/types";
import { formatDate, formatCurrencyARS } from "@/lib/utils";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

const PRIORITY_BORDER: Record<string, string> = {
  urgente: "border-l-red-600",
  alta:    "border-l-[#FF5500]",
  media:   "border-l-[#D6CEC0]",
  baja:    "border-l-[#D6CEC0]",
};

const STATUS_COLOR: Record<TicketStatus, string> = {
  recibido: "bg-[#EAE3D5] text-[#524B3E]",
  en_diagnostico: "bg-[#FFF8E1] text-[#E65100]",
  en_reparacion: "bg-[#FFF3E0] text-[#BF360C]",
  esperando_cliente: "bg-[#E3F2FD] text-[#0D47A1]",
  resuelto: "bg-[#E8F5E9] text-[#1B5E20]",
  entregado: "bg-[#E8F5E9] text-[#2E7D32]",
  cancelado: "bg-[#FFEBEE] text-[#B71C1C]",
};

const TABS = [
  { id: "tickets",     label: "Órdenes & Placas",       icon: ClipboardList },
  { id: "precios",     label: "Tarifario & Precios",     icon: Tag },
  { id: "respuestas",  label: "Respuestas WhatsApp",     icon: MessageSquare },
  { id: "links",       label: "Links de Taller",         icon: ExternalLink },
  { id: "comentarios", label: "Reseñas & Marquee",       icon: Sparkles },
] as const;

type Tab = typeof TABS[number]["id"];

export default function AdminDashboardPage() {
  const { tickets, updateTicketStatus, updateInternalNote, updateBudget } = useTicketStore();
  const { email, nombre, avatarUrl, isAdmin, isLoading: isAuthLoading } = useCurrentUser();
  const { toasts, toast, remove } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("tickets");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [editingBudgets, setEditingBudgets] = useState<Record<string, number>>({});
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const [pricesList, setPricesList] = useState<WorkshopPrice[]>([]);
  const [editingPrice, setEditingPrice] = useState<WorkshopPrice | null>(null);

  const [responsesList, setResponsesList] = useState<QuickResponse[]>([]);
  const [editingResponse, setEditingResponse] = useState<QuickResponse | null>(null);
  const [selectedTicketVar, setSelectedTicketVar] = useState("");

  const [linksList, setLinksList] = useState<QuickLink[]>([]);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);

  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    getWorkshopPrices().then(setPricesList);
    getQuickResponses().then(setResponsesList);
    getQuickLinks().then(setLinksList);
    getReviews().then(setReviewsList);
  }, []);

  // ── Metrics ──
  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => !["resuelto","entregado","cancelado"].includes(t.estado)).length;
  const resolvedTickets = tickets.filter(t => ["resuelto","entregado"].includes(t.estado)).length;
  const totalBudget = tickets.reduce((acc, t) => acc + (t.presupuesto || 0), 0);

  const filteredTickets = tickets.filter(t => {
    const q = searchTerm.toLowerCase();
    const match = t.titulo.toLowerCase().includes(q) || t.tipo_chip.toLowerCase().includes(q) ||
      (t.user_nombre || "").toLowerCase().includes(q) || t.ticket_number.toString().includes(q);
    return filterStatus === "todos" ? match : match && t.estado === filterStatus;
  });

  // ── Ticket Handlers ──
  const handleStatus = async (id: string, status: TicketStatus) => {
    await updateTicketStatus(id, status);
    toast("Estado actualizado", "success");

    // Al entregar la placa, enviamos el reporte detallado al email del cliente
    if (status === "entregado") {
      const ticket = tickets.find((t) => t.id === id);
      if (ticket && ticket.user_email) {
        setEmailStatus("Enviando reporte de entrega...");
        try {
          const res = await fetch("/api/tickets/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ticketNumber: ticket.ticket_number,
              clienteNombre: ticket.user_nombre || "Cliente",
              para: ticket.user_email,
              tipoChip: ticket.tipo_chip,
              titulo: ticket.titulo,
              descripcion: ticket.descripcion,
              presupuesto: ticket.presupuesto,
              notaInterna: ticket.nota_interna,
              mensajes: (ticket.messages || []).map((m) => ({
                remitente: m.sender_name || "",
                rol: m.sender_role || "cliente",
                texto: m.mensaje,
                fecha: formatDate(m.created_at),
              })),
              fechaEntrega: formatDate(new Date().toISOString()),
            }),
          });
          const data = await res.json();
          if (data.success) {
            setEmailStatus("✓ Reporte enviado a " + ticket.user_email);
          } else {
            setEmailStatus("Aviso: no se envió el email (" + (data.error || "config de email") + ")");
          }
        } catch (e) {
          console.error("Error enviando reporte:", e);
          setEmailStatus("No se pudo enviar el reporte por email.");
        }
        setTimeout(() => setEmailStatus(null), 6000);
      }
    }
  };
  const handleNote = async (id: string) => {
    if (editingNotes[id] !== undefined) {
      await updateInternalNote(id, editingNotes[id]);
      toast("Nota técnica guardada", "success");
    }
  };
  const handleBudget = async (id: string) => {
    if (editingBudgets[id] !== undefined) {
      await updateBudget(id, editingBudgets[id]);
      toast("Presupuesto guardado", "success");
    }
  };

  // ── Price Handlers ──
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    const saved = await saveWorkshopPrice(editingPrice);
    setPricesList(prev => { const i = prev.findIndex(p => p.id === saved.id); return i >= 0 ? prev.map(p => p.id === saved.id ? saved : p) : [...prev, saved]; });
    setEditingPrice(null);
    toast("Tarifario actualizado", "success");
  };

  // ── Response Handlers ──
  const handleCopy = (text: string) => {
    let out = text;
    const t = tickets.find(t => t.id === selectedTicketVar) || tickets[0];
    if (t) {
      out = out.replaceAll("{cliente}", t.user_nombre || "Cliente")
               .replaceAll("{chip}", t.tipo_chip || "ESP32")
               .replaceAll("{orden}", t.ticket_number.toString());
    }
    navigator.clipboard.writeText(out);
    toast("¡Copiado al portapapeles!", "success");
  };
  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResponse) return;
    const saved = await saveQuickResponse(editingResponse);
    setResponsesList(prev => { const i = prev.findIndex(r => r.id === saved.id); return i >= 0 ? prev.map(r => r.id === saved.id ? saved : r) : [...prev, saved]; });
    setEditingResponse(null);
    toast("Respuesta guardada", "success");
  };
  const handleDeleteResponse = async (id: string) => {
    await deleteQuickResponseInDB(id);
    setResponsesList(prev => prev.filter(r => r.id !== id));
    toast("Respuesta eliminada", "info");
  };

  // ── Link Handlers ──
  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    const saved = await saveQuickLink(editingLink);
    setLinksList(prev => { const i = prev.findIndex(l => l.id === saved.id); return i >= 0 ? prev.map(l => l.id === saved.id ? saved : l) : [...prev, saved]; });
    setEditingLink(null);
    toast("Enlace guardado", "success");
  };
  const handleDeleteLink = async (id: string) => {
    await deleteQuickLinkInDB(id);
    setLinksList(prev => prev.filter(l => l.id !== id));
    toast("Enlace eliminado", "info");
  };

  // ── Review Handlers ──
  const handleToggleApproval = async (id: string, current: boolean) => {
    await toggleReviewApproval(id, current);
    setReviewsList(prev => prev.map(r => r.id === id ? { ...r, aprobado: !current } : r));
    toast(`Reseña ${!current ? "aprobada" : "ocultada"}`, "success");
  };
  const handleDeleteReview = async (id: string) => {
    await deleteReviewInDB(id);
    setReviewsList(prev => prev.filter(r => r.id !== id));
    toast("Reseña eliminada", "info");
  };

  // ── GATE DE ACCESO: solo el super admin puede ver el dashboard ──
  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F3EFE6] font-mono">
        <div className="flex items-center gap-3 text-[#595245]">
          <div className="w-5 h-5 rounded-full border-2 border-[#FF5500] border-t-transparent animate-spin" />
          <span>Verificando acceso al banco...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F3EFE6] p-6 font-sans">
        <div className="max-w-md w-full text-center bg-[#FAF8F3] border-4 border-[#191C21] rounded-2xl p-10 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#FFEBEE] border-2 border-[#C62828] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#C62828]" />
          </div>
          <h1 className="text-2xl font-black uppercase text-[#191C21] tracking-tight mb-2">
            Acceso restringido
          </h1>
          <p className="text-sm text-[#595245] leading-relaxed mb-6">
            Este panel es solo para el administrador del taller Chispa32. Si ingresaste con
            otra cuenta de Google, no tenés permisos para ver el banco de administración.
          </p>
          <div className="bg-[#F3EFE6] border border-[#D0C7B6] rounded-xl px-4 py-3 mb-6 text-xs font-mono text-[#736B5E]">
            {email ? `Sesión: ${email}` : "No hay una sesión activa"}
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold rounded-xl uppercase tracking-wider text-xs transition-all"
          >
            <ArrowRight className="w-4 h-4" /> Volver al sitio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#191C21] font-sans">
      
      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO HEADER SUPER ADMIN */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b-4 border-[#FF5500] bg-[#FAF8F3]/80 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-[#FF5500]/[0.06] blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto px-6 sm:px-8 py-10 sm:py-14 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping" />
                <span className="text-[11px] font-mono font-bold text-[#FF5500] bg-[#EAE3D5] px-3 py-1 rounded-full tracking-wide border border-[#D0C7B6]">
                  Panel de control — online
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.0] text-[#191C21]">
                Banco de
                <span className="block text-[#FF5500]">administración</span>
              </h1>
              <p className="text-base text-[#595245] font-sans max-w-lg">
                Control de órdenes, tarifario, comunicaciones, documentación y reseñas del taller Chispa32.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">
              {/* Admin badge */}
              <div className="flex items-center gap-3 bg-[#FAF8F3] border-2 border-[#FF5500] px-5 py-3 rounded-2xl shadow-sm">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={nombre} className="w-10 h-10 rounded-full border-2 border-[#FF5500]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FF5500] flex items-center justify-center font-black text-lg text-white">
                    {nombre.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-black text-[#191C21] text-sm">{nombre}</p>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-[#FF5500]" />
                    <span className="text-[10px] font-mono text-[#FF5500] font-bold">Super admin</span>
                  </div>
                </div>
              </div>

              <Link href="/" className="text-xs font-mono font-bold text-[#736B5E] hover:text-[#191C21] transition-colors flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Ver sitio público
              </Link>
              <Link href="/panel/nuevo-ticket" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-xs rounded-xl tracking-wide transition-all border border-[#D94800] shadow-lg">
                <Plus className="w-4 h-4" /> Ingresar placa
              </Link>
            </div>
          </div>

          {/* ── METRICS ROW ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {[
              { label: "Órdenes total", value: totalTickets, color: "text-[#191C21]",      icon: ClipboardList },
              { label: "En banco activo", value: activeTickets, color: "text-[#FF5500]", icon: Activity },
              { label: "Resueltas", value: resolvedTickets, color: "text-[#2E7D32]",   icon: Check },
              { label: "Facturado ARS",  value: formatCurrencyARS(totalBudget), color: "text-[#E64A00]", icon: BarChart3, isText: true },
            ].map(({ label, value, color, icon: Icon, isText }) => (
              <div key={label} className="bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <p className="text-[10px] font-mono font-bold text-[#736B5E] tracking-wide mb-1">{label}</p>
                  <p className={`font-black leading-none ${color} ${isText ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"}`}>{value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-[#EAE3D5] flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TAB NAV */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#D6CEC0] shadow-sm">
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl overflow-x-auto">
          <div className="flex items-center gap-1 py-2">
            {TABS.map(({ id, label, icon: Icon }) => {
              const counts: Record<Tab, number | null> = {
                tickets: filteredTickets.length,
                precios: pricesList.length,
                respuestas: responsesList.length,
                links: linksList.length,
                comentarios: reviewsList.length,
              };
              const count = counts[id];
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-mono font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
                    activeTab === id
                      ? "bg-[#FF5500] text-white shadow-lg"
                      : "text-[#736B5E] hover:text-[#191C21] hover:bg-[#EAE3D5]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${activeTab === id ? "bg-white/20 text-white" : "bg-[#EAE3D5] text-[#736B5E]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Estado de envío de reportes por email */}
      {emailStatus && (
        <div className="container mx-auto px-6 sm:px-8 max-w-7xl pt-4">
          <div className="p-3 rounded-xl border-2 border-[#FF5500] bg-[#EAE3D5] text-xs text-[#191C21] font-mono font-bold flex items-center gap-2">
            {emailStatus.startsWith("✓") ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Send className="w-4 h-4 text-[#FF5500]" />}
            <span>{emailStatus}</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTENT AREA */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 sm:px-8 py-10 sm:py-14 max-w-7xl space-y-8">

        {/* ── TAB 1: TICKETS ── */}
        {activeTab === "tickets" && (
          <div className="space-y-8">
            {/* Filter */}
            <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between bg-[#FAF8F3] p-5 rounded-2xl border border-[#D6CEC0]">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#736B5E]" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, chip, #orden..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[#EAE3D5] border border-[#D0C7B6] rounded-xl pl-11 pr-4 py-3 text-sm text-[#191C21] focus:outline-none focus:border-[#FF5500] placeholder:text-[#736B5E]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                {["todos","recibido","en_diagnostico","en_reparacion","esperando_cliente","resuelto"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-lg uppercase transition-all ${filterStatus === s ? "bg-[#FF5500] text-white" : "bg-[#EAE3D5] text-[#595245] hover:bg-[#EAE3D5] hover:text-[#191C21]"}`}
                  >
                    {s === "todos" ? "Todos" : s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Cards */}
            {filteredTickets.length === 0 ? (
              <div className="bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-16 text-center text-[#736B5E] font-mono text-sm">
                No hay órdenes con este filtro.
              </div>
            ) : (
              <div className="space-y-5">
                {filteredTickets.map(t => {
                  const cleanPhone = (t.user_whatsapp || "").replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(t.user_nombre || "")}!%20Te%20escribo%20desde%20Chispa32%20por%20la%20Orden%20%23${t.ticket_number}`;
                  const priorityBorder = PRIORITY_BORDER[t.prioridad] ?? "border-l-[#343A46]";
                  const statusCls = STATUS_COLOR[t.estado] ?? "bg-[#EAE3D5] text-[#595245]";

                  return (
                    <div key={t.id} className={`bg-[#FAF8F3] border border-[#D6CEC0] border-l-4 ${priorityBorder} rounded-2xl p-6 sm:p-8 transition-all hover:border-[#FF5500] hover:border-l-4 hover:${priorityBorder} space-y-6`}>
                      
                      {/* Top Row */}
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                            <span className="font-black text-[#FF5500] bg-[#EAE3D5] px-3 py-1 rounded-lg border border-[#D0C7B6]">
                              ORDEN #{t.ticket_number}
                            </span>
                            <span className="text-[#595245] font-bold">👤 {t.user_nombre}</span>
                            <span className="text-[#595245] flex items-center gap-1">
                              <Cpu className="w-3.5 h-3.5 text-[#FF5500]" /> {t.tipo_chip}
                            </span>
                            <span className="text-[#736B5E]">•</span>
                            <span className="text-[#736B5E]">{formatDate(t.created_at)}</span>
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${statusCls}`}>
                              {t.estado.replace("_", " ")}
                            </span>
                          </div>
                          <h3 className="font-black text-base sm:text-lg text-[#191C21]">{t.titulo}</h3>
                          <p className="text-sm text-[#595245] leading-relaxed">{t.descripcion}</p>
                          
                          {t.adjunto_url && (
                            <button
                              onClick={() => setPhotoModal(t.adjunto_url!)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EAE3D5] hover:bg-[#EAE3D5] text-xs font-mono font-bold text-[#595245] hover:text-[#191C21] rounded-lg border border-[#D0C7B6] transition-colors mt-1"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-[#FF5500]" />
                              Ver foto adjunta del cliente
                            </button>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 xl:shrink-0">
                          <div>
                            <label className="block text-[10px] text-[#736B5E] font-mono font-bold uppercase mb-1.5">Fase:</label>
                            <select
                              value={t.estado}
                              onChange={e => handleStatus(t.id, e.target.value as TicketStatus)}
                              className="bg-[#EAE3D5] border border-[#D0C7B6] text-[#191C21] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF5500] font-mono font-bold"
                            >
                              <option value="recibido">1. Recibido</option>
                              <option value="en_diagnostico">2. En Diagnóstico</option>
                              <option value="en_reparacion">3. En Reparación</option>
                              <option value="esperando_cliente">4. Esperando Cliente</option>
                              <option value="resuelto">5. Resuelto</option>
                              <option value="entregado">6. Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </div>
                          {cleanPhone && (
                            <div>
                              <span className="block text-[10px] text-transparent font-mono mb-1.5">-</span>
                              <a href={waUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-[#191C21] hover:bg-[#2C3038] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all border border-[#191C21] tracking-wide">
                                <MessageCircle className="w-4 h-4 text-[#38D39F]" /> WhatsApp
                              </a>
                            </div>
                          )}
                          <div>
                            <span className="block text-[10px] text-transparent font-mono mb-1.5">-</span>
                            <Link href={`/panel/tickets/${t.id}`} className="px-4 py-2.5 bg-[#EAE3D5] hover:bg-[#D0C7B6] text-[#191C21] text-xs font-bold rounded-lg flex items-center gap-2 transition-all border border-[#D0C7B6] tracking-wide">
                              Bitácora <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Budget + Internal Note */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#EAE3D5]">
                        <div className="bg-[#F3EFE6] rounded-xl p-4 border border-[#EAE3D5]">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-mono font-bold text-[#FFB300] uppercase flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" /> Presupuesto ARS
                            </label>
                            <button onClick={() => handleBudget(t.id)} className="text-[10px] text-[#FF5500] hover:underline font-bold font-mono">
                              Guardar
                            </button>
                          </div>
                          <input
                            type="number"
                            value={editingBudgets[t.id] !== undefined ? editingBudgets[t.id] : t.presupuesto || 0}
                            onChange={e => setEditingBudgets({ ...editingBudgets, [t.id]: Number(e.target.value) })}
                            className="w-full bg-[#FAF8F3] border border-[#D6CEC0] text-[#191C21] rounded-lg px-3 py-2 text-sm font-black font-mono"
                          />
                        </div>

                        <div className="md:col-span-3 bg-[#F3EFE6] rounded-xl p-4 border border-[#EAE3D5]">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-mono font-bold text-red-400 uppercase flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Nota Técnica Privada (Solo Admin)
                            </label>
                            <button onClick={() => handleNote(t.id)} className="inline-flex items-center gap-1 text-[10px] bg-[#EAE3D5] hover:bg-[#D0C7B6] text-[#191C21] px-2.5 py-1 rounded-lg font-mono font-bold transition-colors">
                              <Save className="w-3 h-3 text-[#FF5500]" /> Guardar
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Voltajes medidos, componentes, instrucciones de banco..."
                            value={editingNotes[t.id] !== undefined ? editingNotes[t.id] : t.nota_interna || ""}
                            onChange={e => setEditingNotes({ ...editingNotes, [t.id]: e.target.value })}
                            className="w-full bg-[#FAF8F3] border border-[#D6CEC0] text-[#191C21] rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-[#FF5500] placeholder:text-[#736B5E]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PRECIOS ── */}
        {activeTab === "precios" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#191C21]">Tarifario oficial</h2>
                <p className="text-sm text-[#736B5E] font-mono mt-1">Modificá precios, tiempos y características visibles en la landing.</p>
              </div>
              <button onClick={() => setEditingPrice({ id: `price-${Date.now()}`, name: "Nuevo Trabajo", badge: "SERVICIO", price: 10000, time: "24 a 48 hs", description: "Descripción...", features: [], highlight: false, order: pricesList.length + 1, active: true })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-sm rounded-xl uppercase shadow-lg">
                <Plus className="w-4 h-4" /> Agregar Paquete
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pricesList.map(p => (
                <div key={p.id} className={`bg-[#FAF8F3] border-2 ${p.highlight ? "border-[#FF5500]" : "border-[#D6CEC0]"} rounded-2xl p-7 flex flex-col justify-between relative`}>
                  {p.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5500] text-white text-[10px] font-black uppercase px-4 py-1 rounded-full font-mono">★ {p.badge || "DESTACADO"}</div>}
                  <div>
                    {!p.highlight && <span className="text-[10px] font-mono font-bold bg-[#EAE3D5] text-[#595245] px-2.5 py-1 rounded-lg uppercase">{p.badge}</span>}
                    <h3 className="font-black text-xl text-[#191C21] mt-3">{p.name}</h3>
                    <p className="text-xs text-[#736B5E] mt-2 leading-relaxed">{p.description}</p>
                    <div className="mt-5 pt-4 border-t border-[#D6CEC0]">
                      <p className="text-4xl font-black text-[#191C21]">{formatCurrencyARS(p.price)}</p>
                      <p className="text-xs text-[#FF5500] font-bold mt-1 font-mono">⏱ {p.time}</p>
                    </div>
                    <ul className="mt-5 space-y-2">
                      {(p.features || []).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#595245] font-mono">
                          <Check className="w-3.5 h-3.5 text-[#FF5500] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => setEditingPrice(p)} className="mt-7 w-full py-3 bg-[#EAE3D5] hover:bg-[#D0C7B6] text-[#191C21] font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: RESPUESTAS RÁPIDAS ── */}
        {activeTab === "respuestas" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#191C21]">Respuestas rápidas WhatsApp</h2>
                <p className="text-sm text-[#736B5E] font-mono mt-1">Plantillas con variables dinámicas para responder en 1 clic.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select value={selectedTicketVar} onChange={e => setSelectedTicketVar(e.target.value)}
                  className="bg-[#FAF8F3] border border-[#D6CEC0] text-sm text-[#191C21] font-mono rounded-xl px-4 py-3 font-bold">
                  <option value="">Seleccioná una orden para las variables...</option>
                  {tickets.map(t => <option key={t.id} value={t.id}>#{t.ticket_number} — {t.user_nombre} ({t.tipo_chip})</option>)}
                </select>
                <button onClick={() => setEditingResponse({ id: `qr-${Date.now()}`, titulo: "Nueva Plantilla", categoria: "General", texto: "Hola {cliente}, te escribo de Chispa32 por la orden #{orden}.", variables: ["{cliente}", "{orden}"] })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-sm rounded-xl uppercase shadow-lg">
                  <Plus className="w-4 h-4" /> Nueva Respuesta
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {responsesList.map(r => (
                <div key={r.id} className="bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold bg-[#EAE3D5] text-[#595245] px-2.5 py-1 rounded-lg uppercase">{r.categoria}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingResponse(r)} className="p-1.5 text-[#736B5E] hover:text-[#191C21] transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteResponse(r.id)} className="p-1.5 text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="font-black text-[#191C21] text-base mb-3">{r.titulo}</h4>
                    <p className="text-sm text-[#595245] bg-[#F3EFE6] p-4 rounded-xl border border-[#EAE3D5] font-mono leading-relaxed whitespace-pre-wrap">{r.texto}</p>
                  </div>
                  <button onClick={() => handleCopy(r.texto)} className="mt-5 w-full py-3.5 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold text-sm rounded-xl flex items-center justify-center gap-2 tracking-wide transition-all border border-[#191C21]">
                    <Copy className="w-4 h-4 text-[#38D39F]" /> Copiar y enviar por WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: LINKS ── */}
        {activeTab === "links" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#191C21]">Links y herramientas de taller</h2>
                <p className="text-sm text-[#736B5E] font-mono mt-1">Accesos directos a web flashers, firmware, datasheets y documentación.</p>
              </div>
              <button onClick={() => setEditingLink({ id: `ql-${Date.now()}`, titulo: "Nuevo Enlace", url: "https://", categoria: "Herramientas", descripcion: "" })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-bold text-sm rounded-xl uppercase shadow-lg">
                <Plus className="w-4 h-4" /> Agregar Link
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {linksList.map(l => (
                <div key={l.id} className="bg-[#FAF8F3] border border-[#D6CEC0] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold bg-[#EAE3D5] text-[#595245] px-2.5 py-1 rounded-lg uppercase">{l.categoria}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingLink(l)} className="p-1.5 text-[#736B5E] hover:text-[#191C21]"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteLink(l.id)} className="p-1.5 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="font-black text-[#191C21] text-base">{l.titulo}</h4>
                    <p className="text-sm text-[#736B5E] mt-2">{l.descripcion}</p>
                    <p className="text-[11px] text-[#736B5E] font-mono mt-2 truncate">{l.url}</p>
                  </div>
                  <a href={l.url} target="_blank" rel="noreferrer" className="mt-5 w-full py-3.5 bg-[#191C21] hover:bg-[#2C3038] text-white font-mono font-bold text-sm rounded-xl flex items-center justify-center gap-2 tracking-wide transition-all border border-[#191C21]">
                    <ExternalLink className="w-4 h-4 text-[#FF5500]" /> Abrir en nueva pestaña
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: RESEÑAS ── */}
        {activeTab === "comentarios" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#191C21]">Moderación de reseñas</h2>
              <p className="text-sm text-[#736B5E] font-mono mt-1">Aprobá o remové comentarios que aparecen en el Marquee de la página principal.</p>
            </div>

            <div className="space-y-4">
              {reviewsList.map(rev => (
                <div key={rev.id} className={`bg-[#FAF8F3] border ${rev.aprobado ? "border-[#2E7D32]/50" : "border-[#D6CEC0]"} rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5`}>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                      {rev.user_avatar && <img src={rev.user_avatar} alt={rev.user_nombre} className="w-8 h-8 rounded-full" />}
                      <span className="font-black text-[#191C21]">{rev.user_nombre}</span>
                      <span className="text-[#736B5E]">{rev.user_email}</span>
                      <span className="text-[#736B5E]">•</span>
                      <span className="text-[#736B5E]">{formatDate(rev.created_at)}</span>
                      {rev.chip_o_servicio && <span className="bg-[#EAE3D5] text-[#595245] px-2 py-0.5 rounded-lg">{rev.chip_o_servicio}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-[#FFB300]">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? "fill-[#FFB300]" : "text-[#343A46]"}`} />)}
                    </div>
                    <p className="text-sm text-[#595245] italic">&ldquo;{rev.comentario}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <button onClick={() => handleToggleApproval(rev.id, rev.aprobado)} className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${rev.aprobado ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] hover:bg-[#C8E6C9]" : "bg-[#EAE3D5] text-[#736B5E] hover:text-[#191C21] hover:bg-[#D0C7B6]"}`}>
                      {rev.aprobado ? <><Eye className="w-3.5 h-3.5" /> Visible en Banner</> : <><EyeOff className="w-3.5 h-3.5" /> Oculto</>}
                    </button>
                    <button onClick={() => handleDeleteReview(rev.id)} className="p-2.5 bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2] rounded-xl transition-colors border border-[#EF9A9A]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Photo Modal ── */}
      {photoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-2xl p-4">
            <button onClick={() => setPhotoModal(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-[#EAE3D5] text-[#191C21] hover:bg-[#FF5500] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <p className="text-[10px] font-mono font-bold text-[#FF5500] uppercase mb-3 tracking-wider">Foto / Archivo Adjunto del Cliente</p>
            <div className="flex items-center justify-center max-h-[80vh] overflow-hidden rounded-xl bg-black">
              <img src={photoModal} alt="Adjunto" className="max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* ── Price Modal ── */}
      {editingPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSavePrice} className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-2xl max-w-lg w-full p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4">
              <h3 className="font-black text-xl text-[#191C21] uppercase">Editar Paquete</h3>
              <button type="button" onClick={() => setEditingPrice(null)} className="p-2 text-[#736B5E] hover:text-[#191C21]"><X className="w-5 h-5" /></button>
            </div>
            {[
              { label: "Nombre del Servicio", key: "name", type: "text" },
              { label: "Badge / Etiqueta", key: "badge", type: "text" },
              { label: "Precio ARS", key: "price", type: "number" },
              { label: "Tiempo de Banco", key: "time", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">{label}</label>
                <input type={type} required value={String(editingPrice[key as keyof WorkshopPrice])}
                   onChange={e => setEditingPrice({ ...editingPrice, [key]: type === "number" ? Number(e.target.value) : e.target.value } as WorkshopPrice)}
                   className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#FF5500]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">Descripción</label>
              <textarea rows={2} value={editingPrice.description} onChange={e => setEditingPrice({ ...editingPrice, description: e.target.value })}
                className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl p-3 text-sm focus:outline-none focus:border-[#FF5500]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">Características (una por línea)</label>
              <textarea rows={4} value={(editingPrice.features || []).join("\n")}
                onChange={e => setEditingPrice({ ...editingPrice, features: e.target.value.split("\n").filter(f => f.trim()) })}
                className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#FF5500]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#595245] font-mono">
              <input type="checkbox" checked={editingPrice.highlight} onChange={e => setEditingPrice({ ...editingPrice, highlight: e.target.checked })} />
              Marcar como Paquete Destacado
            </label>
            <button type="submit" className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-black rounded-xl uppercase tracking-wider text-sm">
              Guardar en Supabase
            </button>
          </form>
        </div>
      )}

      {/* ── Response Modal ── */}
      {editingResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveResponse} className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-2xl max-w-lg w-full p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4">
              <h3 className="font-black text-xl text-[#191C21] uppercase">Editar Respuesta</h3>
              <button type="button" onClick={() => setEditingResponse(null)} className="p-2 text-[#736B5E] hover:text-[#191C21]"><X className="w-5 h-5" /></button>
            </div>
            {[{ label: "Título", key: "titulo" }, { label: "Categoría", key: "categoria" }].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">{label}</label>
                <input required value={String(editingResponse[key as keyof QuickResponse])} onChange={e => setEditingResponse({ ...editingResponse, [key]: e.target.value } as QuickResponse)}
                   className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#FF5500]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">Mensaje (usá {`{cliente}`}, {`{chip}`}, {`{orden}`})</label>
              <textarea rows={5} required value={editingResponse.texto} onChange={e => setEditingResponse({ ...editingResponse, texto: e.target.value })}
                className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-[#FF5500]" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-black rounded-xl uppercase tracking-wider text-sm">
              Guardar Respuesta
            </button>
          </form>
        </div>
      )}

      {/* ── Link Modal ── */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSaveLink} className="bg-[#FAF8F3] border-2 border-[#D6CEC0] rounded-2xl max-w-lg w-full p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-4">
              <h3 className="font-black text-xl text-[#191C21] uppercase">Editar Enlace</h3>
              <button type="button" onClick={() => setEditingLink(null)} className="p-2 text-[#736B5E] hover:text-[#191C21]"><X className="w-5 h-5" /></button>
            </div>
            {[{ label: "Título", key: "titulo" }, { label: "URL", key: "url", type: "url" }, { label: "Categoría", key: "categoria" }].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">{label}</label>
                <input required type={type || "text"} value={String(editingLink[key as keyof QuickLink])} onChange={e => setEditingLink({ ...editingLink, [key]: e.target.value } as QuickLink)}
                   className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#FF5500]" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-[#736B5E] uppercase font-mono mb-1.5">Descripción</label>
              <textarea rows={2} value={editingLink.descripcion || ""} onChange={e => setEditingLink({ ...editingLink, descripcion: e.target.value })}
                className="w-full bg-[#F3EFE6] border border-[#D6CEC0] text-[#191C21] rounded-xl p-3 text-sm focus:outline-none focus:border-[#FF5500]" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-mono font-black rounded-xl uppercase tracking-wider text-sm">
              Guardar Enlace
            </button>
          </form>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  );
}
