# 🔐 SUPABASE - CREDENCIALES Y SETUP COMPLETADO

## ✅ PROYECTO CREADO

**Organización:** ReActive Clinic (FREE)
**Proyecto:** reactive-clinic-db
**URL:** https://qfachcgdxvdpdbbbsrir.supabase.co
**Region:** East US (Ohio)
**Estado:** Healthy ✓

---

## 📋 CREDENCIALES PARA .env.local

### Accede a Supabase Dashboard:
1. Ve a: https://supabase.com/dashboard/project/qfachcgdxvdpdbbbsrir/settings/api-keys
2. Copia los siguientes valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qfachcgdxvdpdbbbsrir.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_IrdXed7-0ZUsHv8x41cv8g_DLx8t...
# ^ Haz click en el copy button al lado de "Publishable key"

SUPABASE_SERVICE_KEY=sb_secret_PsRVT...
# ^ Haz click en el eye icon para revelar, luego copy button
```

### Crea/Actualiza tu .env.local:
```bash
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
# Abre o crea el archivo .env.local y pega las credenciales arriba
```

---

## 🔧 PRÓXIMO PASO: EJECUTAR SETUP SQL

Una vez que tengas las credenciales en .env.local:

### Opción A: Desde Supabase Dashboard (MÁS FÁCIL)
1. Ve a: https://supabase.com/dashboard/project/qfachcgdxvdpdbbbsrir/sql
2. Haz click en "+ New" para crear una nueva query
3. Copia y pega TODO el contenido de `supabase-schema.sql`
4. Haz click en "Run"
5. Las tablas se crearán automáticamente

### Opción B: Desde Terminal (Con @supabase/supabase-js)
```bash
npm install @supabase/supabase-js
npx ts-node scripts/setup-supabase.ts
```

---

## 📊 INSERTAR DATOS INICIALES

Después de crear las tablas, en SQL Editor ejecuta:

```sql
-- Admin user
INSERT INTO usuarios (email, nombre, rol, password) VALUES
('reactive.admin@clinic.com', 'Administrador', 'admin', 'reactive.admin1');

-- Usuarios
INSERT INTO usuarios (email, nombre, rol, password, telefono) VALUES
('martuvz@gmail.com', 'Martina', 'Fisio', 'reactive.fisio3', ''),
('fisioigalvilla@gmail.com', 'Igal Villa', 'Socio', 'reactive.socio1', ''),
('manu.lara.01@gmail.com', 'Manuela', 'Fisio', 'reactive.fisio2', '');

-- Pacientes (ej: 5 primeros)
INSERT INTO pacientes (nombre, apellido, lesion, tipo, sesiones_compradas, sesiones_disponibles) VALUES
('Gabriel', 'Castillo', 'Entrenamiento', 'clinica', 10, 10),
('Carlos', 'Caneva', 'Entrenamiento', 'clinica', 10, 10),
('Natalia', 'Polero', 'Entrenamiento', 'clinica', 10, 10),
('Joaquín', 'Cabrera', 'Post op LCA', 'clinica', 10, 8),
('Marcelo', 'Aurrecochea', 'Hombro congelado + prótesis cadera', 'clinica', 15, 0);
```

---

## 🚀 CONECTAR LA APP

Una vez que tienes .env.local con credenciales y las tablas creadas:

```bash
npm install @supabase/supabase-js  # Si no está instalado

npm run build
vercel --prod
```

---

## ✨ CREDENCIALES DE ACCESO

Usa estas para login en https://fisiotips.com/panel-pagos:

| Usuario | Email | Contraseña |
|---------|-------|-----------|
| **Admin** | reactive.admin@clinic.com | reactive.admin1 |
| **Martina** | martuvz@gmail.com | reactive.fisio3 |
| **Igal Villa** | fisioigalvilla@gmail.com | reactive.socio1 |
| **Manuela** | manu.lara.01@gmail.com | reactive.fisio2 |

---

## 📝 NOTAS

- Las credenciales en `.env.local` son **SECRETAS** - no las compartas ni las subas a Git
- `NEXT_PUBLIC_SUPABASE_URL` es pública (está en el nombre)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` es pública pero solo permite lectura/escritura en tablas con RLS habilitado
- `SUPABASE_SERVICE_KEY` es PRIVADA - solo en servidor (.env.local, nunca en código)

---

**Estado:** Proyecto Supabase creado y listo para conectar ✓
**Próximo paso:** Copiar credenciales al .env.local y ejecutar setup SQL

