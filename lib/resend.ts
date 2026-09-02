/**
 * Servicio de Email vía Resend para Chispa32
 * Se usa para enviar el reporte detallado de taller al cliente al entregar la placa.
 *
 * Config requerida (env vars):
 *  - RESEND_API_KEY
 *  - RESEND_FROM_EMAIL  (remitente verificado en Resend, ej: "Chispa32 <taller@chispa32.com>")
 */

const RESEND_API_URL = "https://api.resend.com/emails";

export interface DeliveryReportData {
  ticketNumber: number | string;
  clienteNombre: string;
  para: string; // email del cliente
  tipoChip: string;
  titulo: string;
  descripcion: string;
  presupuesto?: number;
  notaInterna?: string;
  mensajes?: { remitente: string; rol: string; texto: string; fecha: string }[];
  fechaEntrega?: string;
  sitioUrl?: string;
}

export async function sendDeliveryReport(
  data: DeliveryReportData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Chispa32 <taller@chispa32.com>";

  if (!apiKey) {
    console.log("[Resend Mock / No Config] Reporte de entrega no enviado:", data.ticketNumber);
    return { success: true };
  }

  const presupuestoTexto = data.presupuesto != null
    ? `$ ${data.presupuesto.toLocaleString("es-AR")} ARS`
    : "A confirmar";

  const mensajesHtml = (data.mensajes || [])
    .map(
      (m) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #EAE3D5;vertical-align:top;">
            <div style="color:#736B5E;font-size:11px;font-family:monospace;">
              ${m.rol === "admin" ? "🔧 Técnico" : "👤 Cliente"} · ${m.fecha}
            </div>
            <div style="color:#191C21;font-size:13px;margin-top:2px;">${esc(m.texto)}</div>
          </td>
        </tr>
      `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F3EFE6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EFE6;padding:24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FAF8F3;border:2px solid #191C21;border-top:6px solid #FF5500;border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;background-color:#191C21;color:#FAF8F3;text-align:center;">
              <div style="font-size:22px;font-weight:900;letter-spacing:1px;">⚡ CHISPA<span style="color:#FF5500;">32</span></div>
              <div style="font-size:11px;color:#FF9E79;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Taller Electrónico · Rosario</div>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <h1 style="margin:0 0 6px 0;font-size:20px;color:#191C21;">¡Tu placa está lista y entregada! 🎉</h1>
              <p style="margin:0;color:#595245;font-size:14px;line-height:1.5;">
                Hola <strong style="color:#191C21;">${esc(data.clienteNombre)}</strong>, te dejamos el
                reporte detallado del trabajo realizado sobre tu orden
                <strong style="color:#FF5500;">#${esc(String(data.ticketNumber))}</strong>.
              </p>
            </td>
          </tr>

          <!-- Datos del trabajo -->
          <tr>
            <td style="padding:16px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EFE6;border:1px solid #D6CEC0;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;width:40%;color:#736B5E;font-size:12px;font-weight:700;">N° de Orden</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#191C21;font-size:13px;font-weight:900;">#${esc(String(data.ticketNumber))}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#736B5E;font-size:12px;font-weight:700;">Equipo / Chip</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#191C21;font-size:13px;">${esc(data.tipoChip)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#736B5E;font-size:12px;font-weight:700;">Trabajo realizado</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#191C21;font-size:13px;">${esc(data.titulo)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#736B5E;font-size:12px;font-weight:700;">Detalle / Síntoma</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#191C21;font-size:13px;">${esc(data.descripcion)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#736B5E;font-size:12px;font-weight:700;">Presupuesto</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #EAE3D5;color:#FF5500;font-size:15px;font-weight:900;">${esc(presupuestoTexto)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;color:#736B5E;font-size:12px;font-weight:700;">Fecha de entrega</td>
                  <td style="padding:14px 18px;color:#191C21;font-size:13px;">${esc(data.fechaEntrega || "Hoy")}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${data.notaInterna ? `
          <!-- Nota técnica -->
          <tr>
            <td style="padding:0 32px 16px 32px;">
              <div style="padding:14px 18px;background-color:#FFF8E1;border-left:4px solid #FFB300;border-radius:8px;">
                <div style="font-size:11px;color:#8a6d00;font-weight:900;margin-bottom:4px;letter-spacing:1px;text-transform:uppercase;">🔎 Informe del banco de pruebas</div>
                <div style="color:#191C21;font-size:13px;line-height:1.5;">${esc(data.notaInterna)}</div>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Bitácora / Mensajes -->
          ${data.mensajes && data.mensajes.length > 0 ? `
          <tr>
            <td style="padding:8px 32px 16px 32px;">
              <div style="font-size:12px;color:#736B5E;font-weight:900;margin-bottom:4px;letter-spacing:1px;text-transform:uppercase;">📋 Bitácora de la orden</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #EAE3D5;">
                ${mensajesHtml}
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Confirmación -->
          <tr>
            <td style="padding:0 32px 8px 32px;text-align:center;">
              <div style="display:inline-block;padding:10px 20px;background-color:#E8F5E9;border:1px solid #2E7D32;color:#2E7D32;border-radius:8px;font-size:13px;font-weight:900;text-transform:uppercase;">✓ Placa TESTEADA y validada en banco</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;background-color:#191C21;color:#A69E8F;font-size:11px;line-height:1.6;">
              💬 ¿Consultas? Respondenos por WhatsApp o escribí en tu panel en Chispa32.
              <br><strong style="color:#FF9E79;">Chispa32 · Taller de reparación y reflasheo ESP32/IoT</strong>
              <br>Rosario, Santa Fe, Argentina.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  const text = `
REPORTE DE TALLER — CHISPA32
Orden #${data.ticketNumber}
Hola ${data.clienteNombre}, tu placa está lista y entregada.

EQUIPO: ${data.tipoChip}
TRABAJO REALIZADO: ${data.titulo}
DETALLE: ${data.descripcion}
PRESUPUESTO: ${presupuestoTexto}
FECHA DE ENTREGA: ${data.fechaEntrega || "Hoy"}

${data.notaInterna ? `INFORME DE BANCO:\n${data.notaInterna}\n` : ""}
${data.mensajes && data.mensajes.length > 0 ? `BITÁCORA:\n${data.mensajes.map((m) => `- ${m.rol === "admin" ? "Técnico" : "Cliente"}: ${m.texto}`).join("\n")}\n` : ""}

✓ Placa testeada y validada en banco.
Chispa32 · Taller ESP32/IoT · Rosario
`.trim();

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [data.para],
        subject: `✅ Tu placa #${data.ticketNumber} fue entregada — Reporte del taller Chispa32`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[Resend Error]:", res.status, errBody);
      return { success: false, error: errBody };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido al enviar email";
    console.error("[Resend Fetch Exception]:", msg);
    return { success: false, error: msg };
  }
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
