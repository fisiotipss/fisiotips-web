# 🔧 GUÍA DE CAMBIOS - REACTIVE CLINIC

## Para USAR el Sistema (Usuario Final)

### Acceder a la plataforma:
```
https://fisiotips.com/panel-pagos
```

### Credenciales:
- **Admin:** reactive.admin@clinic.com / reactive.admin1
- **Martina (Fisio):** martuvz@gmail.com / reactive.fisio3  
- **Igal Villa (Socio):** fisiogialvilla@gmail.com / reactive.socio1

---

## Para HACER CAMBIOS en el Código/Sistema (Desarrollador)

### 1️⃣ HACER CAMBIOS EN EL SITIO WEB

#### **Cambiar UI/Páginas:**
```bash
# 1. Edita el archivo .tsx correspondiente
# Ejemplos:
C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web\app\panel-pagos\admin\page.tsx
C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web\app\panel-pagos\perfil\page.tsx

# 2. Compila localmente para verificar
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
npm run dev

# 3. Abre http://localhost:3000 en el navegador

# 4. Verifica los cambios

# 5. Compila para producción
npm run build

# 6. Publica
vercel --prod
```

#### **Cambiar estilos Tailwind:**
```bash
# Los estilos usan Tailwind CSS
# Ejemplo: className="bg-[#0f5c4d] text-white"

# Cambios comunes:
- Colores: bg-[#0f5c4d], text-white, etc
- Espaciado: p-6, m-4, gap-3, etc
- Responsive: md:flex, sm:hidden, etc

# No necesita recompilación, Tailwind auto-genera
```

#### **Cambiar datos de SEED (precargados):**
```bash
# Archivos de datos iniciales:
/lib/seed-pacientes.ts        # 49 pacientes
/lib/seed-registros-igal.ts   # 78 sesiones Igal
/lib/seed-registros-martina.ts # 15 sesiones Martina

# 1. Edita el archivo .ts
# 2. npm run build
# 3. vercel --prod

# El sistema cargará los nuevos datos automáticamente
```

---

### 2️⃣ CAMBIOS EN LA BASE DE DATOS (Supabase)

#### **Crear nuevas TABLAS:**
```bash
# 1. Accede a Supabase: https://supabase.com/dashboard
# 2. Ve a: SQL Editor → New Query
# 3. Escribe tu SQL (o importa desde supabase-schema.sql)
# 4. Click "Run"

# El código React automáticamente podrá usar la tabla
```

#### **Agregar/Editar USUARIOS:**

**Opción A: Desde la interfaz (RECOMENDADO)**
```
1. Ingresa como admin: reactive.admin@clinic.com / reactive.admin1
2. Ve a: Gestionar Usuarios
3. Click: "+ Crear usuario" o "Editar"
4. Rellena datos
5. Click: Guardar
```

**Opción B: SQL directo (si Supabase está conectado)**
```bash
# En Supabase → SQL Editor:

INSERT INTO usuarios (email, nombre, rol, password) VALUES
('nuevo@email.com', 'Nuevo Usuario', 'fisio', 'reactive.fisio5');

-- O editar:
UPDATE usuarios SET telefono = '+598 99 123 456' WHERE email = 'nuevo@email.com';
```

#### **Agregar PACIENTES:**

**Opción A: Interfaz (RECOMENDADO)**
```
1. Login como admin
2. Ve a: Gestionar Pacientes
3. Click: "Agregar nuevo paciente"
4. Rellena nombre, lesión, sesiones
5. Click: Guardar
```

**Opción B: SQL directo**
```bash
# En Supabase → SQL Editor:

INSERT INTO pacientes (nombre, apellido, lesion, tipo, sesiones_compradas, sesiones_disponibles) VALUES
('Juan', 'García', 'LCA', 'clinica', 10, 10);
```

#### **Registrar SESIONES:**

**Opción A: Interfaz (RECOMENDADO)**
```
1. Login como fisio
2. Ve a: Registrar sesión
3. Selecciona: fecha, paciente, tipo, clínica/domicilio
4. Click: Registrar sesión
```

**Opción B: SQL directo**
```bash
INSERT INTO registros (email, fecha, paciente, tipo, clinica, hora_desde, hora_hasta) VALUES
('martuvz@gmail.com', '2026-07-15', 'Juan García', 'clinica', 'lagomar', '08:00', '09:00');
```

---

### 3️⃣ CAMBIOS EN LA LÓGICA (Funcionalidades)

#### **Cambiar cálculo de PAGOS:**
Archivo: `/app/panel-pagos/admin/page.tsx`

```javascript
// Busca la función calcularDatos()
// Para cambiar tarifas, modifica estos valores:

// Línea ~100:
if (rol === "socio") {
  totalPago = regs.length * 350  // ← Cambiar $350 aquí
}

// Para fisios (línea ~120):
if (count >= 3) {
  pagoClin += 450  // ← Cambiar $450 aquí
} else {
  pagoClin += count * 250  // ← Cambiar $250 aquí
}

// Domicilios (línea ~130):
const pago = domA.length * 700  // ← Cambiar $700 para Domicilio A
const pago = domB.length * 1000 // ← Cambiar $1000 para Domicilio B
```

#### **Cambiar campos de usuario:**
Archivo: `/app/panel-pagos/admin/usuarios/page.tsx`

```javascript
// Para agregar nuevo campo (ej: "experiencia"):
// 1. Agregar en Supabase tabla "usuarios" columna nueva
// 2. En componente, agregar:

<div>
  <label>Experiencia</label>
  <input
    value={editForm.experiencia || ""}
    onChange={(e) => setEditForm({ ...editForm, experiencia: e.target.value })}
  />
</div>

// 3. Guardar: handleSaveEdit() automáticamente guardará
```

---

### 4️⃣ FLUJO COMPLETO DE UN CAMBIO

**Ejemplo: Cambiar tarifa de Fisios de $250 a $300**

```bash
# 1. Abre archivo
nano app/panel-pagos/admin/page.tsx

# 2. Busca "pagoClin += count * 250"
# 3. Cambia a "pagoClin += count * 300"

# 4. Verifica localmente
npm run dev
# Abre http://localhost:3000
# Prueba dashboard → verifica que cálculos cambien

# 5. Compila
npm run build

# 6. Publica
vercel --prod

# ¡Listo! El cambio está en vivo
```

---

## 📊 ESTRUCTURA DE CARPETAS (para referencia rápida)

```
app/panel-pagos/
├── page.tsx                    ← Login
├── perfil/page.tsx            ← Mi Perfil (usuarios)
├── registro/page.tsx          ← Registrar sesiones (fisios)
└── admin/
    ├── page.tsx               ← Dashboard pagos
    ├── usuarios/page.tsx      ← Gestionar usuarios
    ├── pacientes/page.tsx     ← Gestionar pacientes
    ├── contratos/page.tsx     ← Contratos
    └── comprobantes/page.tsx  ← Comprobantes

api/panel-pagos/
├── login/route.ts             ← API login
├── registros/route.ts         ← API sesiones
└── contratos/route.ts         ← API contratos

lib/
├── seed-pacientes.ts          ← 49 pacientes (datos iniciales)
├── seed-registros-igal.ts     ← 78 sesiones Igal
├── seed-registros-martina.ts  ← 15 sesiones Martina
└── supabase.ts                ← Cliente Supabase
```

---

## 🆘 AYUDA RÁPIDA

### Cambios no aparecen:
```bash
# 1. Limpia cache
rm -rf .next

# 2. Recompila
npm run build

# 3. Verifica conexión Supabase en .env.local
```

### Usuario no puede acceder:
```bash
# 1. Verifica en Supabase tabla "usuarios"
# 2. Confirma email y contraseña coinciden
# 3. Si Supabase no está conectado, verifica .env.local
```

### Datos no se sincronizan:
```bash
# 1. Verifica que Supabase esté conectado (.env.local)
# 2. Comprueba RLS policies en Supabase
# 3. Abre 2 navegadores, edita en uno, recarga el otro
```

---

## 🔐 CREDENCIALES SUPABASE (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
```

(Se obtienen de: Supabase Dashboard → Settings → API)

---

## 📝 RESUMEN COMANDO DEPLOY

```bash
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
npm run build    # Compila
vercel --prod    # Publica en producción
```

**¡Listo en 2-3 minutos!**

---

## 🎯 PRÓXIMOS CAMBIOS COMUNES

- Agregar nuevo usuario: Admin → Gestionar Usuarios → Crear
- Cambiar tarifa: Edita `/app/panel-pagos/admin/page.tsx` línea ~100-130
- Agregar paciente: Admin → Gestionar Pacientes → Agregar nuevo
- Editar datos bancarios: El usuario va a Mi Perfil → Edita
- Cambiar colores: Busca en .tsx `bg-[#0f5c4d]` y reemplaza

---

**Version:** 2.0 (Con Supabase conectado)  
**Última actualización:** 2026-07-10  
**Estado:** Producción ✅
