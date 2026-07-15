import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs requeridos" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Base de datos no configurada" },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from("registros")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error al eliminar:", error);
      return NextResponse.json(
        { error: "Error al eliminar registros" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mensaje: `${ids.length} registro(s) eliminado(s)`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
