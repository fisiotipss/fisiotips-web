import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { randomUUID } from "crypto";
import { consulta } from "@/content/site-copy";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

function campoTexto(formData: FormData, nombre: string) {
  const valor = formData.get(nombre);
  return typeof valor === "string" ? valor.trim() : "";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const datos = {
      nombre: campoTexto(formData, "nombre"),
      telefonoEmergencia: campoTexto(formData, "telefonoEmergencia"),
      edad: campoTexto(formData, "edad"),
      deporte: campoTexto(formData, "deporte"),
      ubicacion: campoTexto(formData, "ubicacion"),
      demandaFisica: campoTexto(formData, "demandaFisica"),
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
      "motivoConsulta",
    ];
    const faltante = camposObligatorios.find((campo) => !datos[campo]);
    if (faltante) {
      return NextResponse.json(
        { error: `Falta completar el campo "${faltante}".` },
        { status: 400 }
      );
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

    const referenciaExterna = randomUUID();

    // 1. Enviar email con los datos del formulario (siempre, no depende del pago).
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const filas = [
        ["Nombre completo", datos.nombre],
        ["Teléfono de emergencia", datos.telefonoEmergencia],
        ["Edad", datos.edad],
        ["Deporte", datos.deporte],
        ["Ciudad / país", datos.ubicacion],
        ["Nivel de esfuerzo físico laboral", datos.demandaFisica],
        ["Motivo de consulta", datos.motivoConsulta],
        ["Tratamientos previos y resultados", datos.tratamientosPrevios || "—"],
        ["Referencia", referenciaExterna],
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

    // 2. Crear preferencia de pago en Mercado Pago.
    let initPoint: string | undefined;

    if (process.env.MP_ACCESS_TOKEN) {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
      const preference = new Preference(client);

      const baseUrl = process.env.SITE_URL || req.nextUrl.origin;

      const result = await preference.create({
        body: {
          items: [
            {
              id: "consulta-inicial",
              title: "Evaluación inicial de fisioterapia — Joaquín Cazenave",
              quantity: 1,
              unit_price: consulta.precio,
              currency_id: consulta.moneda,
            },
          ],
          external_reference: referenciaExterna,
          back_urls: {
            success: `${baseUrl}/gracias`,
            failure: `${baseUrl}/pago-fallido`,
            pending: `${baseUrl}/gracias`,
          },
          auto_return: "approved",
          notification_url: process.env.MP_WEBHOOK_URL || `${baseUrl}/api/mp-webhook`,
        },
      });

      initPoint = result.init_point;
    } else {
      console.warn("MP_ACCESS_TOKEN no configurado; se omite la creación de la preferencia de pago.");
    }

    return NextResponse.json({ ok: true, initPoint, referenciaExterna });
  } catch (error) {
    console.error("Error en /api/consulta:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud. Intentá nuevamente en unos minutos." },
      { status: 500 }
    );
  }
}
