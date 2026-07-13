import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const email = request.nextUrl.searchParams.get("email");
    let query = supabase.from("usuarios").select("*");

    if (email) {
      query = query.eq("email", email);
    } else {
      query = query.order("nombre");
    }

    const { data, error } = await query;

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

    const { email, nombre, rol, password } = await request.json();

    if (!email || !nombre || !rol || !password) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ email, nombre, rol, password }])
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al crear usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
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

    const { email, nombre, telefono, banco, nro_cuenta, sucursal } =
      await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update({ nombre, telefono, banco, nro_cuenta, sucursal })
      .eq("email", email)
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al actualizar usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
