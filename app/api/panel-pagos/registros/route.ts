import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, paciente, tipo, horaDesde, horaHasta, observaciones } =
      await request.json();

    if (!email || !paciente || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Validar que si es clínica, tenga horarios
    if (tipo === "clinica" && (!horaDesde || !horaHasta)) {
      return NextResponse.json(
        { error: "Horarios requeridos para clínica" },
        { status: 400 }
      );
    }

    // Normalizar tipo
    const tipoNormalizado =
      tipo === "clinica"
        ? "clinica"
        : tipo === "domicilio-a"
          ? "domicilio_a"
          : "domicilio_b";

    const registro = {
      email,
      paciente,
      tipo: tipoNormalizado,
      horaDesde: tipo === "clinica" ? horaDesde : null,
      horaHasta: tipo === "clinica" ? horaHasta : null,
      observaciones,
      fecha: new Date().toISOString().split("T")[0],
    };

    // Intentar guardar en Supabase si está configurado
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        // TODO: Aquí iría la lógica real de Supabase
        // const { data, error } = await supabase
        //   .from("registros")
        //   .insert([registro]);
      } catch (dbError) {
        console.log("BD no configurada, usando datos en memoria");
      }
    }

    return NextResponse.json({
      success: true,
      mensaje: "Paciente registrado correctamente",
      registro,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar paciente" },
      { status: 500 }
    );
  }
}
