import { NextResponse } from "next/server";
import { sendTelegramAlert, formatNewTicketAlert, formatNewMessageAlert } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "message") {
      const alertText = formatNewMessageAlert({
        ticketNumber: body.ticketNumber,
        remitente: body.remitente,
        mensaje: body.mensaje,
        ticketId: body.ticketId,
      });

      const result = await sendTelegramAlert(alertText, {
        ticketNumber: body.ticketNumber,
        ticketId: body.ticketId,
      });

      return NextResponse.json(result);
    } else {
      // Nuevo Ticket
      const alertText = formatNewTicketAlert({
        ticketNumber: body.ticketNumber,
        clienteNombre: body.clienteNombre,
        modeloPlaca: body.modeloPlaca,
        tipoProblema: body.tipoProblema,
        titulo: body.titulo,
        descripcion: body.descripcion,
        ticketId: body.ticketId,
      });

      const result = await sendTelegramAlert(alertText, {
        ticketNumber: body.ticketNumber,
        ticketId: body.ticketId,
      });

      return NextResponse.json(result);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar notificación";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
