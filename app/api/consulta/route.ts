import { NextRequest, NextResponse } from "next/server";
import { consulta } from "@/content/site-copy";

export const runtime = "nodejs";

const processedRequests = new Map<string, number>();
const ipRequests = new Map<string, number>();
const activePendingPayments = new Map<string, number>();

const PREFERENCIAS_HORARIAS = ["manana", "tarde", "ambas"];

function deduplicateRequest(deduplicationId: string): boolean {
  const now = Date.now();
  const lastProcessed = processedRequests.get(deduplicationId);

  if (lastProcessed && now - lastProcessed < 60000) {
    return false;
  }

  processedRequests.set(deduplicationId, now);

  if (processedRequests.size > 1000) {
    const oldestKey = processedRequests.keys().next().value as string;
    if (oldestKey) processedRequests.delete(oldestKey);
  }

  return true;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = ipRequests.get(ip);

  if (lastRequest && now - lastRequest < 60000) {
    return false;
  }

  ipRequests.set(ip, now);

  if (ipRequests.size > 500) {
    const oldestKey = ipRequests.keys().next().value as string;
    if (oldestKey) ipRequests.delete(oldestKey);
  }

  return true;
}

function campoTexto(formData: FormData, nombre: string) {
  const valor = formData.get(nombre);
  return typeof valor === "string" ? valor.trim() : "";
}

// Mercado Pago guarda estos datos junto al pago. El webhook los lee al aprobarse el pago
// y recién ahí se envía el correo con la información. Si no se paga, no llega nada.
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Aguardá un minuto e intentá nuevamente." },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    const deduplicationId = formData.get("deduplication_id");
    if (typeof deduplicationId === "string" && !deduplicateRequest(deduplicationId)) {
      return NextResponse.json(
        { error: "Solicitud duplicada detectada. Aguardá un momento e intentá nuevamente." },
        { status: 429 }
      );
    }

    const datos = {
      nombre: campoTexto(formData, "nombre"),
      telefono: campoTexto(formData, "telefonoEmergencia"),
      edad: campoTexto(formData, "edad"),
      deporte: campoTexto(formData, "deporte"),
      ubicacion: campoTexto(formData, "ubicacion"),
      demandaFisica: campoTexto(formData, "demandaFisica"),
      preferenciaHoraria: campoTexto(formData, "preferenciaHoraria"),
      motivoConsulta: campoTexto(formData, "motivoConsulta"),
      tratamientosPrevios: campoTexto(formData, "tratamientosPrevios"),
    };

    const camposObligatorios: (keyof typeof datos)[] = [
      "nombre",
      "telefono",
      "edad",
      "deporte",
      "ubicacion",
      "demandaFisica",
      "preferenciaHoraria",
      "motivoConsulta",
    ];
    const faltante = camposObligatorios.find((campo) => !datos[campo]);
    if (faltante) {
      return NextResponse.json(
        { error: `Falta completar el campo "${faltante}".` },
        { status: 400 }
      );
    }

    if (!PREFERENCIAS_HORARIAS.includes(datos.preferenciaHoraria)) {
      return NextResponse.json(
        { error: "Elegí una preferencia horaria válida." },
        { status: 400 }
      );
    }

    const emailKey = datos.nombre.toLowerCase();
    const now = Date.now();
    const lastPayment = activePendingPayments.get(emailKey);

    if (lastPayment && now - lastPayment < 300000) {
      return NextResponse.json(
        { error: "Ya hay un pago pendiente para este usuario. Esperá a que se procese o contactanos." },
        { status: 429 }
      );
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("MP_ACCESS_TOKEN no configurado; no se puede crear el pago.");
      return NextResponse.json(
        { error: "El pago no está disponible en este momento. Intentá más tarde." },
        { status: 500 }
      );
    }

    activePendingPayments.set(emailKey, now);
    if (activePendingPayments.size > 500) {
      const oldestKey = activePendingPayments.keys().next().value as string;
      if (oldestKey) activePendingPayments.delete(oldestKey);
    }

    const origin = req.nextUrl.origin;
    const preferencia = {
      items: [
        {
          title: "Evaluación de 1 hora y media",
          quantity: 1,
          unit_price: consulta.precioUYU,
          currency_id: "UYU",
        },
      ],
      payer: { name: datos.nombre },
      metadata: {
        nombre: datos.nombre,
        telefono: datos.telefono,
        edad: datos.edad,
        deporte: datos.deporte,
        ubicacion: datos.ubicacion,
        demanda_fisica: datos.demandaFisica,
        preferencia_horaria: datos.preferenciaHoraria,
        motivo_consulta: datos.motivoConsulta.slice(0, 500),
        tratamientos_previos: datos.tratamientosPrevios.slice(0, 500),
      },
      back_urls: {
        success: `${origin}/gracias`,
        pending: `${origin}/gracias`,
        failure: `${origin}/pago-fallido`,
      },
      auto_return: "approved",
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencia),
    });

    if (!res.ok) {
      console.error("Error creando preferencia de Mercado Pago:", res.status, await res.text());
      return NextResponse.json(
        { error: "No se pudo iniciar el pago. Intentá nuevamente en unos minutos." },
        { status: 500 }
      );
    }

    const data = await res.json();
    if (!data.init_point) {
      console.error("Preferencia de Mercado Pago sin init_point:", data);
      return NextResponse.json(
        { error: "No se pudo iniciar el pago. Intentá nuevamente en unos minutos." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, redirectUrl: data.init_point });
  } catch (error) {
    console.error("Error en /api/consulta:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud. Intentá nuevamente en unos minutos." },
      { status: 500 }
    );
  }
}
