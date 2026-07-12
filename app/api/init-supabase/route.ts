import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  // Proteger endpoint con token simple
  if (token !== process.env.INIT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    console.log("Inicializando Supabase...");

    // Las tablas deben crearse manualmente en Supabase SQL Editor
    // Este endpoint solo inserta datos

    // Insertar usuarios reales
    const usuarios = [
      {
        email: "reactive.admin@clinic.com",
        nombre: "Administrador",
        rol: "admin",
        password: "reactive.admin1",
      },
      {
        email: "martuvz@gmail.com",
        nombre: "Martina",
        rol: "Fisio",
        password: "reactive.fisio3",
      },
      {
        email: "fisioigalvilla@gmail.com",
        nombre: "Igal Villa",
        rol: "Socio",
        password: "reactive.socio1",
      },
      {
        email: "manu.lara.01@gmail.com",
        nombre: "Manuela",
        rol: "Fisio",
        password: "reactive.fisio2",
      },
    ];

    for (const user of usuarios) {
      await supabase.from("usuarios").upsert([user], {
        onConflict: "email",
      });
    }

    // Insertar pacientes
    const pacientes = [
      {
        nombre: "Gabriel",
        apellido: "Castillo",
        lesion: "Entrenamiento",
        tipo: "clinica",
        sesiones_compradas: 10,
        sesiones_disponibles: 10,
      },
      {
        nombre: "Carlos",
        apellido: "Caneva",
        lesion: "Entrenamiento",
        tipo: "clinica",
        sesiones_compradas: 10,
        sesiones_disponibles: 10,
      },
      {
        nombre: "Natalia",
        apellido: "Polero",
        lesion: "Entrenamiento",
        tipo: "clinica",
        sesiones_compradas: 10,
        sesiones_disponibles: 10,
      },
      {
        nombre: "Joaquín",
        apellido: "Cabrera",
        lesion: "Post op LCA",
        tipo: "clinica",
        sesiones_compradas: 10,
        sesiones_disponibles: 8,
      },
      {
        nombre: "Marcelo",
        apellido: "Aurrecochea",
        lesion: "Hombro + cadera",
        tipo: "clinica",
        sesiones_compradas: 15,
        sesiones_disponibles: 0,
      },
    ];

    for (const pac of pacientes) {
      await supabase.from("pacientes").insert([pac]);
    }

    return NextResponse.json({
      success: true,
      message: "Supabase inicializado correctamente",
      usuarios: usuarios.length,
      pacientes: pacientes.length,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
