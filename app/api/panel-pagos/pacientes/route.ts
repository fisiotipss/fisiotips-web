import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado" },
        { status: 500 }
      );
    }

    const { nombre, apellido, lesion, tipo, sesiones_compradas, sesiones_disponibles } = await request.json();

    if (!nombre || !apellido || !lesion || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pacientes")
      .insert([
        {
          nombre,
          apellido,
          lesion,
          tipo,
          sesiones_compradas: sesiones_compradas || 0,
          sesiones_disponibles: sesiones_disponibles || 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al crear paciente" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al crear paciente" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado" },
        { status: 500 }
      );
    }

    const id = request.nextUrl.searchParams.get("id");
    const { sesiones_compradas, sesiones_disponibles } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pacientes")
      .update({ sesiones_compradas, sesiones_disponibles })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al actualizar paciente" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al actualizar paciente" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado" },
        { status: 500 }
      );
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al eliminar paciente" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al eliminar paciente" },
      { status: 500 }
    );
  }
}
