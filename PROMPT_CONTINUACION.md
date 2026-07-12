# 📝 PROMPT DE CONTINUACIÓN - REACTIVE CLINIC

**Copia esto completo si necesitas continuar en otro chat:**

---

## 🎯 PROYECTO: Sistema de Pago para ReActive Clinic

### Stack Tecnológico:
- **Framework:** Next.js 16 con React + TypeScript
- **Styling:** Tailwind CSS (responsive)
- **Base de Datos:** Supabase (PostgreSQL) - SINCRONIZADO EN TIEMPO REAL
- **Auth:** localStorage + Supabase Auth (en desarrollo)
- **Deploy:** Vercel (https://fisiotips.com)

### Credenciales de Acceso:
- **Admin:** reactive.admin@clinic.com / reactive.admin1
- **Martina (Fisio):** martuvz@gmail.com / reactive.fisio3
- **Igal Villa (Socio):** fisiogialvilla@gmail.com / reactive.socio1

---

## ✅ LO QUE YA ESTÁ HECHO:

### 1. Autenticación
- Login con email/contraseña
- Roles: Admin, Fisio, Socio
- Contraseña auto-generada (reactive.fisio#, reactive.socio#)
- localStorage + próximas mejoras con Supabase Auth

### 2. Dashboard Admin (`/panel-pagos/admin`)
- **Filtro dinámico de meses:** Todos + Ene-Dic (auto-detecta mes actual)
- **Cálculo de pagos:**
  - Socios: $350/sesión (fijo)
  - Fisios: $250/paciente ($450 si 3+ en la misma hora) + domicilios
  - Domicilio A: +$700
  - Domicilio B: +$1,000
- **Control de sesiones:** Pacientes A-Z, compradas/disponibles/realizadas
- **Botones navegación:** Pacientes, Comprobantes, Contratos, Nuevo Usuario

### 3. Gestionar Usuarios (`/panel-pagos/admin/usuarios`)
- Crear usuarios (auto-genera contraseña)
- ✏️ **Editar usuario (ADMIN):** email, nombre, rol, contraseña, teléfono, banco, cuenta, sucursal
- Ver todos los datos
- Copiar contraseña

### 4. Mi Perfil (`/panel-pagos/perfil`)
- **Para Fisios/Socios:**
  - Editar: email, teléfono
  - Datos bancarios opcionales: banco, nro_cuenta, sucursal
  - NO pueden cambiar contraseña (solo admin)
- **Botón "Mi Perfil" en Registrar Sesiones**

### 5. Registro de Sesiones (`/panel-pagos/registro`)
- Fecha con calendario
- Pacientes dropdown (A-Z, sin precios)
- Tipo atención: Clínica, Domicilio A, Domicilio B
- Clínicas: Shangrila, Lagomar
- Horarios (Desde/Hasta) - solo si clínica
- Observaciones
- **Botón "Mi Perfil"** en header

### 6. Gestionar Pacientes (`/panel-pagos/admin/pacientes`)
- Pacientes A-Z
- Dos modos: "Agregar nuevo" + "Agregar sesiones"
- ✏️ **Botón Editar:** cambiar sesiones compradas/disponibles
- 🗑️ **Botón Eliminar:** con confirmación
- Notas visibles para fisios (📌 icono)
- Modal de edición responsive

### 7. Contratos (`/panel-pagos/admin/contratos`)
- PDF con términos de pago
- Campos editable: nombre, cédula, teléfono, fecha firma
- Régimen de pago visible
- Firma digital (upload)

### 8. Responsive Design
- ✅ Desktop (1920px) + Tablet + Móvil (375px)
- Botones, tablas, modales responsivos
- Sin inconsistencias entre dispositivos

### 9. Datos de Seed (Cargado)
- **Pacientes:** 49 pacientes (de junio/julio con histórico)
- **Sesiones Igal:** 78 sesiones junio 2026 (socio: $27,300)
- **Sesiones Martina:** 15 sesiones julio 2026 (fisio)
- Almacenados en: `/lib/seed-pacientes.ts`, `/lib/seed-registros-igal.ts`, `/lib/seed-registros-martina.ts`

---

## 🚀 LO QUE FALTA (PRÓXIMO PASO):

### Conectar Supabase
1. **Crear proyecto en supabase.com** (GRATIS)
2. **Copiar credenciales** a `.env.local`
3. **Ejecutar schema SQL** (archivo `supabase-schema.sql` ya creado)
4. **Actualizar código** para usar @supabase/supabase-js
5. **Instalar:** `npm install @supabase/supabase-js`
6. **Publicar:** `npm run build` → `vercel --prod`

**Archivo de setup:** Existe `SETUP_SUPABASE.md` en la carpeta con instrucciones paso a paso.

### Funcionalidades pendientes:
- [ ] Botón "Detalles" en Cálculo de Pagos (modal con datos del usuario + sesiones)
- [ ] Edición de sesiones desde admin (corregir datos mal cargados)
- [ ] Foto de perfil para usuarios
- [ ] Comprobantes de pago (descarga PDF)
- [ ] Notificaciones por email (Resend API)

---

## 📁 ESTRUCTURA DE CARPETAS:

```
app/
├── panel-pagos/
│   ├── page.tsx (LOGIN)
│   ├── perfil/ → page.tsx (MI PERFIL - NUEVO)
│   ├── registro/ → page.tsx (REGISTRAR SESIONES)
│   └── admin/
│       ├── page.tsx (DASHBOARD)
│       ├── usuarios/ → page.tsx (GESTIONAR USUARIOS)
│       ├── pacientes/ → page.tsx (GESTIONAR PACIENTES)
│       ├── contratos/ → page.tsx (CONTRATOS)
│       └── comprobantes/ → page.tsx
│
├── api/panel-pagos/
│   ├── login/route.ts
│   ├── registros/route.ts
│   └── contratos/route.ts
│
lib/
├── seed-pacientes.ts (49 pacientes)
├── seed-registros-igal.ts (78 sesiones)
└── seed-registros-martina.ts (15 sesiones)

.env.local (CREDENCIALES - CREAR)
supabase-schema.sql (SCHEMA - EJECUTAR EN SUPABASE)
SETUP_SUPABASE.md (INSTRUCCIONES)
```

---

## 🔧 COMANDOS ÚTILES:

```bash
# Desarrollo local
npm run dev

# Build
npm run build

# Publicar producción
vercel --prod

# Instalar Supabase
npm install @supabase/supabase-js
```

---

## 💡 PRÓXIMAS MEJORAS (Después de Supabase):

1. **Botón "Detalles"** en Admin Dashboard
   - Ver usuario completo (datos personales + bancarios)
   - Ver todas sus sesiones cargadas
   - Editar sesiones directamente
   - Ver pacientes atendidos

2. **Sincronización en tiempo real**
   - Cambios en PC aparecen al instante en celular
   - Notificaciones si otro admin edita

3. **Foto de perfil**
   - Upload foto en Mi Perfil
   - Mostrar en dashboard

4. **Auditoría**
   - Quién editó qué y cuándo
   - Historial de cambios

5. **Reportes**
   - PDF de pago por usuario
   - Excel con datos de sesiones

---

## 📞 INFORMACIÓN DEL PROYECTO:

- **Sitio web:** https://fisiotips.com
- **Repo:** fisiotips-web (carpeta local)
- **Host:** Vercel
- **Email dueño:** jcazenave12@gmail.com
- **Última actualización:** [FECHA ACTUAL]
- **Estado:** EN DESARROLLO - Falta conectar Supabase

---

## 🎯 CUANDO REGRESES:

1. Di: "Continuar con Supabase ReActive"
2. Pega este prompt
3. Yo continuaré desde donde se dejó

**IMPORTANTE:** Guarda este prompt en un lugar seguro para la próxima sesión.

