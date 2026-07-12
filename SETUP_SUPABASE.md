# 🚀 SETUP SUPABASE - REACTIVE CLINIC

## PASO 1: Crear Proyecto Supabase (GRATIS)

1. Ir a: https://supabase.com
2. Click en "Sign Up" (usa tu email: jcazenave12@gmail.com)
3. Crear nueva organización: "ReActive Clinic"
4. Crear proyecto:
   - Nombre: `reactive-clinic-db`
   - Región: (elige la más cercana)
   - Password: (guarda en lugar seguro)
5. Esperar a que se cree (2-3 minutos)

## PASO 2: Obtener Credenciales

1. En Supabase, ir a: Settings → API
2. Copiar:
   - **Project URL** → Variable `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Variable `SUPABASE_SERVICE_KEY`

3. Pegar en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## PASO 3: Crear Tablas en Supabase

1. En Supabase, ir a: SQL Editor
2. Click en "+ New Query"
3. Copiar contenido de `supabase-schema.sql` (en la carpeta del proyecto)
4. Ejecutar query
5. ✓ Tablas creadas

## PASO 4: Insertar Datos Iniciales

En SQL Editor, ejecutar:

```sql
-- Admin
INSERT INTO usuarios (email, nombre, rol, password) VALUES
('reactive.admin@clinic.com', 'Administrador', 'admin', 'reactive.admin1');

-- Usuarios
INSERT INTO usuarios (email, nombre, rol, password, telefono) VALUES
('martuvz@gmail.com', 'Martina', 'fisio', 'reactive.fisio3', ''),
('fisiogialvilla@gmail.com', 'Igal Villa', 'socio', 'reactive.socio1', '');

-- Pacientes (primeros 5 de ejemplo)
INSERT INTO pacientes (nombre, apellido, lesion, tipo, sesiones_compradas, sesiones_disponibles) VALUES
('Gabriel', 'Castillo', 'Entrenamiento', 'clinica', 10, 10),
('Carlos', 'Caneva', 'Entrenamiento', 'clinica', 10, 10),
('Natalia', 'Polero', 'Entrenamiento', 'clinica', 10, 10),
('Joaquín', 'Cabrera', 'Post op LCA', 'clinica', 10, 8),
('Marcelo', 'Aurrecochea', 'Hombro congelado + prótesis cadera', 'clinica', 15, 0);
```

## PASO 5: Instalar Dependencia

```bash
npm install @supabase/supabase-js
```

## PASO 6: Compilar y Publicar

```bash
npm run build
vercel --prod
```

---

## 📋 CREDENCIALES DE ACCESO (después de crear):

| Usuario | Email | Contraseña |
|---------|-------|-----------|
| Admin | reactive.admin@clinic.com | reactive.admin1 |
| Martina (Fisio) | martuvz@gmail.com | reactive.fisio3 |
| Igal Villa (Socio) | fisiogialvilla@gmail.com | reactive.socio1 |

---

## ✅ Verificar que funciona:

1. Ingresar desde PC con admin
2. Crear usuario nuevo
3. Ingresar desde celular con ese usuario
4. Verificar que aparezca en ambos dispositivos
5. Editar perfil desde celular
6. Verificar que los cambios aparezcan en la PC

---

## 🔑 URL de Acceso:

**Producción:** https://fisiotips.com/panel-pagos
**Local (desarrollo):** http://localhost:3000/panel-pagos

