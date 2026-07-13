"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoMark from "@/components/LogoMark";

export default function PanelLogin() {
  const router = useRouter();
  // Force Vercel redeploy - responsive mobile
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/panel-pagos/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email o contraseña incorrectos");
        return;
      }

      localStorage.setItem("panelAuth", JSON.stringify(data));

      if (data.role === "admin") {
        router.push("/panel-pagos/admin");
      } else {
        router.push("/panel-pagos/registro");
      }
    } catch (err) {
      setError("Error al conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <a
        href="https://fisiotips.com"
        className="absolute top-4 left-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
      >
        ← Volver a Fisiotips
      </a>

      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0f5c4d] mb-2">ReActive</h1>
            <p className="text-sm text-gray-600">Panel de control de sesiones</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#2563eb] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#2563eb] focus:bg-white"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Contraseña asignada por administrador
          </p>
        </div>

        <div className="mt-6 p-4 bg-[#eef4f6] rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> Usa reactive.admin@clinic.com / reactive.admin1
          </p>
        </div>
      </div>
    </div>
  );
}
