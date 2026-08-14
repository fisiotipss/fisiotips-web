import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const runtime = "nodejs";

const processedPayments = new Map<string, number>();
const paymentsByPayer = new Map<string, Array<{ paymentId: string; time: number; amount: number }>>();

function isPaymentAlreadyProcessed(paymentId: string): boolean {
  const now = Date.now();
  const lastProcessed = processedPayments.get(paymentId);

  if (lastProcessed && now - lastProcessed < 300000) {
    return true;
  }

  processedPayments.set(paymentId, now);

  if (processedPayments.size > 500) {
    const oldestKey = processedPayments.keys().next().value as string;
    if (oldestKey) processedPayments.delete(oldestKey);
  }

  return false;
}

function detectDuplicatePayment(payerId: string, amount: number): boolean {
  const now = Date.now();
  if (!paymentsByPayer.has(payerId)) {
    paymentsByPayer.set(payerId, []);
  }

  const payerPayments = paymentsByPayer.get(payerId)!;
  const recentDuplicate = payerPayments.some(
    (p) => now - p.time < 600000 && Math.abs(p.amount - amount) < 1
  );

  if (!recentDuplicate) {
    payerPayments.push({ paymentId: "", time: now, amount });
    if (payerPayments.length > 10) payerPayments.shift();
  }

  return recentDuplicate;
}

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

    if (isPaymentAlreadyProcessed(paymentId)) {
      return NextResponse.json({ ok: true });
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const info = await payment.get({ id: paymentId });

    if (info.status === "approved" && process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      const payerId = info.payer?.email || "unknown";
      const isDuplicate = detectDuplicatePayment(payerId, info.transaction_amount || 0);

      const resend = new Resend(process.env.RESEND_API_KEY);
      const subject = isDuplicate
        ? `⚠️ PAGO DUPLICADO DETECTADO — ${info.transaction_amount} ${info.currency_id}`
        : `💰 Pago recibido — ${info.transaction_amount} ${info.currency_id}`;

      const duplicateWarning = isDuplicate
        ? `<p style="color: red;"><strong>⚠️ ALERTA:</strong> Este pago podría ser un duplicado del mismo usuario en los últimos 10 minutos.</p>`
        : "";

      await resend.emails.send({
        from: process.env.RESEND_FROM || "Fisiotips <onboarding@resend.dev>",
        to: process.env.NOTIFY_EMAIL,
        subject,
        html: `
          <h2>${isDuplicate ? "⚠️ Pago Duplicado Detectado" : "¡Pago confirmado!"}</h2>
          ${duplicateWarning}
          <p><strong>Monto:</strong> ${info.transaction_amount} ${info.currency_id}</p>
          <p><strong>Pagador:</strong> ${info.payer?.first_name || ""} ${info.payer?.last_name || ""} (${info.payer?.email || "sin email"})</p>
          <p><strong>Estado:</strong> ${info.status}</p>
          <p><strong>Fecha:</strong> ${info.date_approved || info.date_created}</p>
          ${isDuplicate ? "<p style='color: red;'><strong>Verificar si este pago duplicado debe ser reembolsado.</strong></p>" : ""}
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
