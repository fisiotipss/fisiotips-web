import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { email, nombre, mes, monto, pdfUrl } = await request.json();

    if (!email || !nombre || !mes || !monto) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Enviar email con Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || "ReActive <onboarding@resend.dev>",
      to: email,
      subject: `Comprobante de pago - ${mes}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Hola ${nombre},</h2>
          <p>Adjunto encontrarás el comprobante de pago por tus servicios en ReActive.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Período:</strong> ${mes}</p>
            <p><strong>Monto:</strong> $${monto.toLocaleString()}</p>
          </div>

          <p>Si tienes alguna pregunta sobre tu pago, no dudes en contactarnos.</p>

          <p>Saludos,<br/>Equipo ReActive</p>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: "Error al enviar email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mensaje: "Comprobante enviado al email correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
