import { createClient } from "@/lib/supabase/client";
import { Ticket, TicketStatus, TicketMessage, Review, WorkshopPrice, QuickResponse, QuickLink } from "@/types";
import { INITIAL_TICKETS } from "./mock-data";

// Fallback seed data for reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    user_id: "usr-demo-1",
    user_email: "martin.iot@gmail.com",
    user_nombre: "Martín R.",
    rating: 5,
    comentario: "Excelente servicio en Rosario. Recuperaron un lote de 4 ESP32-S3 que se habían brickeado tras un fallo en OTA. En 24hs estaban listas.",
    chip_o_servicio: "ESP32-S3 Flash Recovery",
    aprobado: true,
    destacado: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-2",
    user_id: "usr-demo-2",
    user_email: "lucas.domotica@outlook.com",
    user_nombre: "Lucas Domótica",
    rating: 5,
    comentario: "Me flashearon 6 módulos Sonoff Dual R3 con Tasmota y calibraron los relés para Home Assistant. Impecable el soporte por WhatsApp.",
    chip_o_servicio: "Sonoff / Tasmota",
    aprobado: true,
    destacado: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev-3",
    user_id: "usr-demo-3",
    user_email: "german.maker@gmail.com",
    user_nombre: "Germán B.",
    rating: 5,
    comentario: "Tenía un memory leak en FreeRTOS que me volvía loco con reinicios cada 2 horas. Diagnóstico preciso y código optimizado. 100% recomendado.",
    chip_o_servicio: "Debugging FreeRTOS",
    aprobado: true,
    destacado: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "rev-4",
    user_id: "usr-demo-4",
    user_email: "estudio.luces@gmail.com",
    user_nombre: "Estudio Luces Led",
    rating: 5,
    comentario: "Armaron dos controladoras WLED para tiras WS2812B con level shifters de 3.3V a 5V. Funcionando sin un solo parpadeo.",
    chip_o_servicio: "Controlador WLED",
    aprobado: true,
    destacado: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export const INITIAL_PRICES: WorkshopPrice[] = [
  {
    id: "price-1",
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
    order: 1,
    active: true,
  },
  {
    id: "price-2",
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
    order: 2,
    active: true,
  },
  {
    id: "price-3",
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
    order: 3,
    active: true,
  },
];

export const INITIAL_QUICK_RESPONSES: QuickResponse[] = [
  {
    id: "qr-1",
    titulo: "Recepción de Placa",
    categoria: "Recepción",
    texto: "¡Hola {cliente}! 👋 Confirmamos el ingreso de tu {chip} al banco de trabajo de Chispa32 (Orden #{orden}). En las próximas 24/48hs te pasamos el reporte de diagnóstico con sonda UART.",
    variables: ["{cliente}", "{chip}", "{orden}"],
  },
  {
    id: "qr-2",
    titulo: "Diagnóstico Listo",
    categoria: "Diagnóstico",
    texto: "Hola {cliente}, ya concluimos el diagnóstico de la Orden #{orden} ({chip}). El informe técnico y presupuesto está listo. ¿Avanzamos con la reparación/flasheo?",
    variables: ["{cliente}", "{chip}", "{orden}"],
  },
  {
    id: "qr-3",
    titulo: "Placa Lista para Retiro",
    categoria: "Entrega",
    texto: "¡Buenas noticias {cliente}! Tu placa {chip} (Orden #{orden}) pasó todos los tests en banco y quedó 100% operativa. Podés coordinar el retiro en Rosario en nuestro punto de encuentro.",
    variables: ["{cliente}", "{chip}", "{orden}"],
  },
  {
    id: "qr-4",
    titulo: "Coordinación de Envío",
    categoria: "Logística",
    texto: "Hola {cliente}, para despachar tu placa por correo precisamos: Nombre completo, DNI, Dirección y Código Postal. Te enviaremos el número de tracking apenas salga.",
    variables: ["{cliente}"],
  },
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
  {
    id: "ql-1",
    titulo: "ESP Web Tools (Flasher en navegador)",
    url: "https://esphome.github.io/esp-web-tools/",
    categoria: "Herramientas",
    descripcion: "Flashear ESP32/ESP8266 directo desde Chrome vía WebSerial",
  },
  {
    id: "ql-2",
    titulo: "Espressif Flash Download Tool",
    url: "https://www.espressif.com/en/support/download/other-tools",
    categoria: "Herramientas",
    descripcion: "Software oficial para erase de flash y quemado de binarios",
  },
  {
    id: "ql-3",
    titulo: "ESPHome Official Documentation",
    url: "https://esphome.io/",
    categoria: "Documentación",
    descripcion: "Referencia de componentes, sensores y configs YAML",
  },
  {
    id: "ql-4",
    titulo: "WLED Releases & Web Installer",
    url: "https://install.wled.me/",
    categoria: "Firmware",
    descripcion: "Instalador web de WLED para tiras NeoPixel y WS2812B",
  },
];

// LocalStorage helpers for resilient fallback
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage set error:", e);
  }
}

// -------------------------------------------------------------
// TICKETS SERVICE
// -------------------------------------------------------------
export async function getTickets(): Promise<Ticket[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*, ticket_messages(*)")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: Ticket[] = data.map((t) => ({
        id: t.id,
        ticket_number: t.ticket_number,
        user_id: t.user_id,
        user_nombre: t.user_nombre,
        user_email: t.user_email,
        user_whatsapp: t.user_whatsapp,
        tipo_chip: t.tipo_chip,
        titulo: t.titulo,
        descripcion: t.descripcion,
        estado: t.estado,
        prioridad: t.prioridad,
        presupuesto: t.presupuesto ? Number(t.presupuesto) : undefined,
        nota_interna: t.nota_interna,
        adjunto_url: t.adjunto_url,
        messages: ((t.ticket_messages as unknown as TicketMessage[]) || []).map((m) => ({
          id: m.id,
          ticket_id: m.ticket_id,
          sender_id: m.sender_id,
          sender_name: m.sender_name,
          sender_role: m.sender_role,
          mensaje: m.mensaje,
          created_at: m.created_at,
        })),
        created_at: t.created_at,
        updated_at: t.updated_at,
      }));
      setLocal("chispa32_tickets_cache", mapped);
      return mapped;
    }
  } catch (e) {
    console.warn("Supabase fetch error, fallback to cache:", e);
  }

  return getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
}

export async function createTicketInDB(ticketData: Omit<Ticket, "id" | "ticket_number" | "created_at" | "updated_at">): Promise<Ticket> {
  const supabase = createClient();
  const now = new Date().toISOString();
  
  const currentList = getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
  const nextNumber = currentList.length > 0 ? Math.max(...currentList.map((t) => t.ticket_number)) + 1 : 101;

  const newTicketObj: Ticket = {
    ...ticketData,
    id: `tk-${Date.now()}`,
    ticket_number: nextNumber,
    created_at: now,
    updated_at: now,
    messages: ticketData.messages || [],
  };

  try {
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        user_id: ticketData.user_id && ticketData.user_id.startsWith("usr-") ? null : ticketData.user_id,
        user_nombre: ticketData.user_nombre,
        user_email: ticketData.user_email,
        user_whatsapp: ticketData.user_whatsapp,
        tipo_chip: ticketData.tipo_chip,
        titulo: ticketData.titulo,
        descripcion: ticketData.descripcion,
        estado: ticketData.estado,
        prioridad: ticketData.prioridad,
        presupuesto: ticketData.presupuesto || 0,
        nota_interna: ticketData.nota_interna || "",
        adjunto_url: ticketData.adjunto_url || "",
      })
      .select()
      .single();

    if (!error && data) {
      newTicketObj.id = data.id;
      newTicketObj.ticket_number = data.ticket_number;
    }
  } catch (e) {
    console.warn("Supabase insert ticket error, using local state:", e);
  }

  // Update local cache
  const updated = [newTicketObj, ...currentList];
  setLocal("chispa32_tickets_cache", updated);
  setLocal("chispa32_tickets_etapa1", updated);

  return newTicketObj;
}

export async function updateTicketStatusInDB(ticketId: string, status: TicketStatus) {
  const supabase = createClient();
  try {
    await supabase.from("tickets").update({ estado: status, updated_at: new Date().toISOString() }).eq("id", ticketId);
  } catch (e) {
    console.warn("Supabase update status error:", e);
  }
  
  const list = getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
  const updated = list.map((t) => (t.id === ticketId ? { ...t, estado: status, updated_at: new Date().toISOString() } : t));
  setLocal("chispa32_tickets_cache", updated);
  setLocal("chispa32_tickets_etapa1", updated);
}

export async function updateTicketNoteInDB(ticketId: string, note: string) {
  const supabase = createClient();
  try {
    await supabase.from("tickets").update({ nota_interna: note, updated_at: new Date().toISOString() }).eq("id", ticketId);
  } catch (e) {
    console.warn("Supabase update note error:", e);
  }

  const list = getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
  const updated = list.map((t) => (t.id === ticketId ? { ...t, nota_interna: note, updated_at: new Date().toISOString() } : t));
  setLocal("chispa32_tickets_cache", updated);
  setLocal("chispa32_tickets_etapa1", updated);
}

export async function updateTicketBudgetInDB(ticketId: string, budget: number) {
  const supabase = createClient();
  try {
    await supabase.from("tickets").update({ presupuesto: budget, updated_at: new Date().toISOString() }).eq("id", ticketId);
  } catch (e) {
    console.warn("Supabase update budget error:", e);
  }

  const list = getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
  const updated = list.map((t) => (t.id === ticketId ? { ...t, presupuesto: budget, updated_at: new Date().toISOString() } : t));
  setLocal("chispa32_tickets_cache", updated);
  setLocal("chispa32_tickets_etapa1", updated);
}

export async function addTicketMessageInDB(
  ticketId: string,
  messageText: string,
  senderId: string,
  senderName: string,
  senderRole: "cliente" | "admin"
): Promise<TicketMessage> {
  const supabase = createClient();
  const now = new Date().toISOString();
  const newMsg: TicketMessage = {
    id: `msg-${Date.now()}`,
    ticket_id: ticketId,
    sender_id: senderId,
    sender_name: senderName,
    sender_role: senderRole,
    mensaje: messageText,
    created_at: now,
  };

  try {
    const { data, error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticketId,
        sender_id: senderId,
        sender_name: senderName,
        sender_role: senderRole,
        mensaje: messageText,
      })
      .select()
      .single();

    if (!error && data) {
      newMsg.id = data.id;
    }
  } catch (e) {
    console.warn("Supabase message insert error:", e);
  }

  const list = getLocal<Ticket[]>("chispa32_tickets_cache", INITIAL_TICKETS);
  const updated = list.map((t) => (t.id === ticketId ? { ...t, messages: [...(t.messages || []), newMsg], updated_at: now } : t));
  setLocal("chispa32_tickets_cache", updated);
  setLocal("chispa32_tickets_etapa1", updated);

  return newMsg;
}

// -------------------------------------------------------------
// FILE / PHOTO UPLOADER
// -------------------------------------------------------------
export async function uploadPhotoFile(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("ticket-attachments")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("ticket-attachments").getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (e) {
    console.warn("Storage upload error, using local data URL fallback:", e);
  }

  // Fallback to FileReader base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// REVIEWS SERVICE (MARQUEE & DASHBOARD)
// -------------------------------------------------------------
export async function getReviews(): Promise<Review[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setLocal("chispa32_reviews_cache", data);
      return data;
    }
  } catch (e) {
    console.warn("Supabase fetch reviews error, fallback:", e);
  }

  return getLocal<Review[]>("chispa32_reviews_cache", INITIAL_REVIEWS);
}

export async function saveReview(review: Omit<Review, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<Review> {
  const supabase = createClient();
  const now = new Date().toISOString();
  const list = getLocal<Review[]>("chispa32_reviews_cache", INITIAL_REVIEWS);

  let resultReview: Review;

  if (review.id) {
    // Edit existing
    resultReview = {
      ...review,
      id: review.id,
      created_at: list.find((r) => r.id === review.id)?.created_at || now,
      updated_at: now,
    } as Review;

    try {
      await supabase
        .from("reviews")
        .update({
          rating: review.rating,
          comentario: review.comentario,
          chip_o_servicio: review.chip_o_servicio,
          user_nombre: review.user_nombre,
          user_avatar: review.user_avatar,
          updated_at: now,
        })
        .eq("id", review.id);
    } catch (e) {
      console.warn("Supabase review update error:", e);
    }

    const updatedList = list.map((r) => (r.id === review.id ? resultReview : r));
    setLocal("chispa32_reviews_cache", updatedList);
  } else {
    // Create new
    resultReview = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: now,
      updated_at: now,
    };

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          user_id: review.user_id,
          user_email: review.user_email,
          user_nombre: review.user_nombre,
          user_avatar: review.user_avatar,
          rating: review.rating,
          comentario: review.comentario,
          chip_o_servicio: review.chip_o_servicio,
          aprobado: review.aprobado !== undefined ? review.aprobado : true,
          destacado: review.destacado !== undefined ? review.destacado : false,
        })
        .select()
        .single();

      if (!error && data) {
        resultReview.id = data.id;
      }
    } catch (e) {
      console.warn("Supabase review insert error:", e);
    }

    const updatedList = [resultReview, ...list];
    setLocal("chispa32_reviews_cache", updatedList);
  }

  return resultReview;
}

export async function deleteReviewInDB(reviewId: string) {
  const supabase = createClient();
  try {
    await supabase.from("reviews").delete().eq("id", reviewId);
  } catch (e) {
    console.warn("Supabase review delete error:", e);
  }

  const list = getLocal<Review[]>("chispa32_reviews_cache", INITIAL_REVIEWS);
  const updated = list.filter((r) => r.id !== reviewId);
  setLocal("chispa32_reviews_cache", updated);
}

export async function toggleReviewApproval(reviewId: string, currentVal: boolean) {
  const supabase = createClient();
  const newVal = !currentVal;
  try {
    await supabase.from("reviews").update({ aprobado: newVal }).eq("id", reviewId);
  } catch (e) {
    console.warn("Supabase review approve toggle error:", e);
  }

  const list = getLocal<Review[]>("chispa32_reviews_cache", INITIAL_REVIEWS);
  const updated = list.map((r) => (r.id === reviewId ? { ...r, aprobado: newVal } : r));
  setLocal("chispa32_reviews_cache", updated);
}

// -------------------------------------------------------------
// WORKSHOP PRICES SERVICE
// -------------------------------------------------------------
export async function getWorkshopPrices(): Promise<WorkshopPrice[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("workshop_prices")
      .select("*")
      .order("order", { ascending: true });

    if (!error && data && data.length > 0) {
      setLocal("chispa32_prices_cache", data);
      return data;
    }
  } catch (e) {
    console.warn("Supabase fetch prices error, fallback:", e);
  }

  return getLocal<WorkshopPrice[]>("chispa32_prices_cache", INITIAL_PRICES);
}

export async function saveWorkshopPrice(priceItem: WorkshopPrice): Promise<WorkshopPrice> {
  const supabase = createClient();
  const list = getLocal<WorkshopPrice[]>("chispa32_prices_cache", INITIAL_PRICES);

  try {
    await supabase
      .from("workshop_prices")
      .upsert({
        id: priceItem.id.startsWith("price-") ? undefined : priceItem.id,
        name: priceItem.name,
        badge: priceItem.badge,
        price: priceItem.price,
        time: priceItem.time,
        description: priceItem.description,
        features: priceItem.features,
        highlight: priceItem.highlight,
        order: priceItem.order,
        active: priceItem.active,
      });
  } catch (e) {
    console.warn("Supabase upsert price error:", e);
  }

  const existingIdx = list.findIndex((p) => p.id === priceItem.id);
  let updatedList: WorkshopPrice[];
  if (existingIdx >= 0) {
    updatedList = list.map((p) => (p.id === priceItem.id ? priceItem : p));
  } else {
    updatedList = [...list, priceItem];
  }
  setLocal("chispa32_prices_cache", updatedList);
  return priceItem;
}

// -------------------------------------------------------------
// QUICK RESPONSES SERVICE
// -------------------------------------------------------------
export async function getQuickResponses(): Promise<QuickResponse[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("quick_responses").select("*");
    if (!error && data && data.length > 0) {
      setLocal("chispa32_quick_responses_cache", data);
      return data;
    }
  } catch (e) {
    console.warn("Supabase fetch quick responses error, fallback:", e);
  }

  return getLocal<QuickResponse[]>("chispa32_quick_responses_cache", INITIAL_QUICK_RESPONSES);
}

export async function saveQuickResponse(item: QuickResponse): Promise<QuickResponse> {
  const supabase = createClient();
  const list = getLocal<QuickResponse[]>("chispa32_quick_responses_cache", INITIAL_QUICK_RESPONSES);

  try {
    await supabase.from("quick_responses").upsert({
      id: item.id.startsWith("qr-") ? undefined : item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      texto: item.texto,
      variables: item.variables || [],
    });
  } catch (e) {
    console.warn("Supabase upsert quick response error:", e);
  }

  const idx = list.findIndex((r) => r.id === item.id);
  const updatedList = idx >= 0 ? list.map((r) => (r.id === item.id ? item : r)) : [...list, item];
  setLocal("chispa32_quick_responses_cache", updatedList);
  return item;
}

export async function deleteQuickResponseInDB(id: string) {
  const supabase = createClient();
  try {
    await supabase.from("quick_responses").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase delete response error:", e);
  }
  const list = getLocal<QuickResponse[]>("chispa32_quick_responses_cache", INITIAL_QUICK_RESPONSES);
  setLocal("chispa32_quick_responses_cache", list.filter((r) => r.id !== id));
}

// -------------------------------------------------------------
// QUICK LINKS SERVICE
// -------------------------------------------------------------
export async function getQuickLinks(): Promise<QuickLink[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("quick_links").select("*");
    if (!error && data && data.length > 0) {
      setLocal("chispa32_quick_links_cache", data);
      return data;
    }
  } catch (e) {
    console.warn("Supabase fetch quick links error, fallback:", e);
  }

  return getLocal<QuickLink[]>("chispa32_quick_links_cache", INITIAL_QUICK_LINKS);
}

export async function saveQuickLink(item: QuickLink): Promise<QuickLink> {
  const supabase = createClient();
  const list = getLocal<QuickLink[]>("chispa32_quick_links_cache", INITIAL_QUICK_LINKS);

  try {
    await supabase.from("quick_links").upsert({
      id: item.id.startsWith("ql-") ? undefined : item.id,
      titulo: item.titulo,
      url: item.url,
      categoria: item.categoria,
      descripcion: item.descripcion || "",
    });
  } catch (e) {
    console.warn("Supabase upsert quick link error:", e);
  }

  const idx = list.findIndex((l) => l.id === item.id);
  const updatedList = idx >= 0 ? list.map((l) => (l.id === item.id ? item : l)) : [...list, item];
  setLocal("chispa32_quick_links_cache", updatedList);
  return item;
}

export async function deleteQuickLinkInDB(id: string) {
  const supabase = createClient();
  try {
    await supabase.from("quick_links").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase delete link error:", e);
  }
  const list = getLocal<QuickLink[]>("chispa32_quick_links_cache", INITIAL_QUICK_LINKS);
  setLocal("chispa32_quick_links_cache", list.filter((l) => l.id !== id));
}
