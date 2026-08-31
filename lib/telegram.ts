/**
 * Servicio de Notificaciones Asincrónicas vía Telegram para Chispa32
 * Permite a Exequiel enterarse al instante de nuevos tickets o respuestas
 * mientras está trabajando en turnos o estudiando.
 */

interface SendTelegramOptions {
  ticketNumber?: number | string;
  ticketId?: string;
  clienteNombre?: string;
  tipoProblema?: string;
  modeloPlaca?: string;
  mensajeTexto?: string;
  appUrl?: string;
}

export async function sendTelegramAlert(
  text: string,
  options?: SendTelegramOptions
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log("[Telegram Alert Mock / No Config]:", text);
    return { success: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Si se pasan opciones de ticket, formateamos botones interactivos
    let replyMarkup = undefined;
    if (options?.ticketId) {
      const baseUrl = options.appUrl || process.env.NEXT_PUBLIC_APP_URL || "https://chispa32.vercel.app";
      const ticketUrl = `${baseUrl}/admin/tickets/${options.ticketId}`;
      replyMarkup = {
        inline_keyboard: [
          [
            { text: `⚡ Ver Ticket #${options.ticketNumber || ""}`, url: ticketUrl }
          ]
        ]
      };
    }

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("[Telegram Error]:", errData);
      return { success: false, error: errData.description };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error desconocido al enviar alerta";
    console.error("[Telegram Fetch Exception]:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Plantilla para notificar cuando un cliente abre un nuevo ticket
 */
export function formatNewTicketAlert(data: {
  ticketNumber: number | string;
  clienteNombre: string;
  modeloPlaca: string;
  tipoProblema: string;
  titulo: string;
  descripcion: string;
  ticketId: string;
}): string {
  return `
⚡ <b>¡NUEVO TICKET EN CHISPA32!</b> #<code>${data.ticketNumber}</code>

👤 <b>Cliente:</b> ${data.clienteNombre}
📟 <b>Placa:</b> ${data.modeloPlaca}
🏷️ <b>Problema:</b> ${data.tipoProblema}
📝 <b>Título:</b> ${data.titulo}

📄 <b>Detalle:</b>
<i>${data.descripcion.slice(0, 200)}${data.descripcion.length > 200 ? "..." : ""}</i>
`.trim();
}

/**
 * Plantilla para notificar cuando un cliente responde o envía mensaje en el ticket
 */
export function formatNewMessageAlert(data: {
  ticketNumber: number | string;
  remitente: string;
  mensaje: string;
  ticketId: string;
}): string {
  return `
💬 <b>Nuevo mensaje en Ticket #${data.ticketNumber}</b>

👤 <b>De:</b> ${data.remitente}
💬 <b>Mensaje:</b>
<i>${data.mensaje}</i>
`.trim();
}
