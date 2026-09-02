import { NextResponse } from "next/server";
import { sendDeliveryReport } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await sendDeliveryReport({
      ticketNumber: body.ticketNumber,
      clienteNombre: body.clienteNombre,
      para: body.para,
      tipoChip: body.tipoChip,
      titulo: body.titulo,
      descripcion: body.descripcion,
      presupuesto: body.presupuesto,
      notaInterna: body.notaInterna,
      mensajes: body.mensajes,
      fechaEntrega: body.fechaEntrega,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Error al enviar el reporte" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar el reporte";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
