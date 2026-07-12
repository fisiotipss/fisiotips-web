import { NextRequest, NextResponse } from "next/server";

interface ContratoData {
  email: string;
  nombre: string;
  cedula: string;
  telefono: string;
  fechaFirma: string;
  archivoUrl?: string;
  fechaSubida: string;
}

const contratos: ContratoData[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nombre, cedula, telefono, fechaFirma } = body;

    if (!email || !nombre) {
      return NextResponse.json(
        { error: "Email y nombre son requeridos" },
        { status: 400 }
      );
    }

    const contratoExistente = contratos.findIndex((c) => c.email === email);

    const nuevoContrato: ContratoData = {
      email,
      nombre,
      cedula,
      telefono,
      fechaFirma,
      fechaSubida: new Date().toISOString(),
    };

    if (contratoExistente >= 0) {
      contratos[contratoExistente] = nuevoContrato;
    } else {
      contratos.push(nuevoContrato);
    }

    return NextResponse.json({
      success: true,
      message: "Contrato guardado correctamente",
      contrato: nuevoContrato,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    const contrato = contratos.find((c) => c.email === email);

    if (!contrato) {
      return NextResponse.json(
        { error: "Contrato no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(contrato);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
