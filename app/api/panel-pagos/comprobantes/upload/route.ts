import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fisioId = formData.get("fisioId") as string;
    const mes = formData.get("mes") as string;
    const email = formData.get("email") as string;

    if (!file || !fisioId || !mes || !email) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.includes("pdf") && !file.type.includes("image")) {
      return NextResponse.json(
        { error: "Solo se permiten PDFs o imágenes" },
        { status: 400 }
      );
    }

    // En producción, esto sería:
    // 1. Guardar archivo en Supabase Storage
    // 2. Obtener URL pública
    // 3. Guardar registro en BD
    // 4. Enviar email

    // Por ahora, simular la respuesta:
    const mockUrl = `https://storage.example.com/comprobantes/${fisioId}/${mes}.pdf`;

    return NextResponse.json({
      success: true,
      url: mockUrl,
      mensaje: "Comprobante cargado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 }
    );
  }
}
