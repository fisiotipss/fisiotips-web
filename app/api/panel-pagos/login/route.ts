import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "reactive.admin@clinic.com";
const ADMIN_PASSWORD = "reactive.admin1";

// Mock usuarios (en producción sería una BD)
const usuarios = [
  {
    email: "ariel@reactive.com",
    password: "reactive.fisio1",
    role: "fisio",
    name: "Ariel Martínez",
  },
  {
    email: "ivonne@reactive.com",
    password: "reactive.fisio2",
    role: "fisio",
    name: "Ivonne Rodríguez",
  },
  {
    email: "carlos@reactive.com",
    password: "reactive.socio1",
    role: "socio",
    name: "Carlos López",
  },
  {
    email: "sandra@reactive.com",
    password: "reactive.socio2",
    role: "socio",
    name: "Sandra García",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    // Validar admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        email,
        role: "admin",
        name: "Administrador",
      });
    }

    // Validar usuarios
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (!usuario) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      email: usuario.email,
      role: usuario.role,
      name: usuario.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
