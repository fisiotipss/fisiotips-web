import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const runtime = "nodejs";

// Mercado Pago llama a esta URL cada vez que cambia el estado de un pago en tu cuenta
// (configurado en tu panel de Mercado Pago > Notificaciones > Webhooks).
// Documentación: https://www.mercadopago.com.uy/developers/es/docs/checkout-pro/additional-content/notifications/webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const searchParams = req.nextUrl.searchParams;

    const paymentId =
      body?.data?.id || searchParams.get("data.id") || searchParams.get("id");
    const tipo = body?.type || searchParams.get("type") || searchParams.get("topic");

    if (tipo !== "payment" || !paymentId || !process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ ok: true });
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const info = await payment.get({ id: paymentId });

    if (info.status === "approved" && process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || "Fisiotips <onboarding@resend.dev>",
        to: process.env.NOTIFY_EMAIL,
        subject: `💰 Pago recibido — ${info.transaction_amount} ${info.currency_id}`,
        html: `
          <h2>¡Pago confirmado!</h2>
          <p><strong>Monto:</strong> ${info.transaction_amount} ${info.currency_id}</p>
          <p><strong>Pagador:</strong> ${info.payer?.first_name || ""} ${info.payer?.last_name || ""} (${info.payer?.email || "sin email"})</p>
          <p><strong>Estado:</strong> ${info.status}</p>
          <p><strong>Fecha:</strong> ${info.date_approved || info.date_created}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en /api/mp-webhook:", error);
    // Devolvemos 200 igual para que Mercado Pago no reintente indefinidamente por errores no recuperables.
    return NextResponse.json({ ok: false });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
