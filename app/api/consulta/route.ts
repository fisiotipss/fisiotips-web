import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sucursales } from "@/content/site-copy";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

const processedRequests = new Map<string, number>();
const ipRequests = new Map<string, number>();
const activePendingPayments = new Map<string, number>();

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
      telefonoEmergencia: campoTexto(formData, "telefonoEmergencia"),
      edad: campoTexto(formData, "edad"),
      deporte: campoTexto(formData, "deporte"),
      ubicacion: campoTexto(formData, "ubicacion"),
      demandaFisica: campoTexto(formData, "demandaFisica"),
      sucursal: campoTexto(formData, "sucursal"),
      motivoConsulta: campoTexto(formData, "motivoConsulta"),
      tratamientosPrevios: campoTexto(formData, "tratamientosPrevios"),
    };

    const camposObligatorios: (keyof typeof datos)[] = [
      "nombre",
      "telefonoEmergencia",
      "edad",
      "deporte",
      "ubicacion",
      "demandaFisica",
      "sucursal",
      "motivoConsulta",
    ];
    const faltante = camposObligatorios.find((campo) => !datos[campo]);
    if (faltante) {
      return NextResponse.json(
        { error: `Falta completar el campo "${faltante}".` },
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

    activePendingPayments.set(emailKey, now);
    if (activePendingPayments.size > 500) {
      const oldestKey = activePendingPayments.keys().next().value as string;
      if (oldestKey) activePendingPayments.delete(oldestKey);
    }

    const archivo = formData.get("estudios");
    let attachment: { filename: string; content: string } | undefined;

    if (archivo instanceof File && archivo.size > 0) {
      if (archivo.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "El archivo adjunto supera el tamaño máximo permitido (8 MB)." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await archivo.arrayBuffer());
      attachment = { filename: archivo.name, content: buffer.toString("base64") };
    }

    // Enviar email con los datos del formulario. El pago se completa aparte,
    // en el link de Mercado Pago al que redirige el formulario.
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const filas = [
        ["Nombre completo", datos.nombre],
        ["Teléfono de emergencia", datos.telefonoEmergencia || "—"],
        ["Edad", datos.edad],
        ["Deporte", datos.deporte],
        ["Ciudad / país", datos.ubicacion],
        ["Nivel de esfuerzo físico laboral", datos.demandaFisica],
        [
          "Sucursal más conveniente",
          sucursales.find((s) => s.value === datos.sucursal)?.label || datos.sucursal,
        ],
        ["Motivo de consulta", datos.motivoConsulta],
        ["Tratamientos previos y resultados", datos.tratamientosPrevios || "—"],
      ];

      const html = `
        <h2>Nueva evaluación reservada — ${datos.nombre}</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${filas
            .map(
              ([label, valor]) =>
                `<tr><td style="font-weight:600;border:1px solid #eee">${label}</td><td style="border:1px solid #eee">${valor}</td></tr>`
            )
            .join("")}
        </table>
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM || "Fisiotips <onboarding@resend.dev>",
        to: process.env.NOTIFY_EMAIL,
        subject: `Nueva evaluación reservada — ${datos.nombre}`,
        html,
        attachments: attachment ? [attachment] : undefined,
      });
    } else {
      console.warn("RESEND_API_KEY o NOTIFY_EMAIL no configurados; se omite el envío de email.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en /api/consulta:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud. Intentá nuevamente en unos minutos." },
      { status: 500 }
    );
  }
}
