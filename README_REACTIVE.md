# 🏥 REACTIVE CLINIC - Sistema de Pago

## 📊 ESTADO ACTUAL

✅ **Completamente funcional en PC y móvil (375px)**

---

## 🔐 CREDENCIALES DE ACCESO

| Rol | Email | Contraseña | Función |
|-----|-------|-----------|---------|
| **Admin** | reactive.admin@clinic.com | reactive.admin1 | Control total del sistema |
| **Martina (Fisio)** | martuvz@gmail.com | reactive.fisio3 | Registra sesiones |
| **Igal Villa (Socio)** | fisiogialvilla@gmail.com | reactive.socio1 | Registra sesiones |

**URL:** https://fisiotips.com/panel-pagos

---

## ✨ FUNCIONALIDADES IMPLEMENTADAS

### Para ADMIN
- ✅ Dashboard con filtro dinámico de meses (auto-detecta mes actual)
- ✅ Crear usuarios con contraseña auto-generada
- ✅ **Editar usuarios:** email, nombre, rol, contraseña, teléfono, banco, cuenta, sucursal
- ✅ Ver datos de todos los usuarios
- ✅ Ver sesiones de cada usuario
- ✅ Editar sesiones (paciente, horario, sucursal, domicilio)
- ✅ Gestionar pacientes (crear, editar sesiones, eliminar)
- ✅ Cálculo automático de pagos
- ✅ Contratos con PDF descargable

### Para FISIOS/SOCIOS
- ✅ Registrar sesiones por paciente
- ✅ **Mi Perfil:** Editar email, teléfono, datos bancarios
- ✅ Ver datos personales
- ✅ NO pueden cambiar contraseña (solo admin)
- ✅ Ver sus propias sesiones

### Datos Bancarios
- ✅ Campos opcionales: banco, número de cuenta, sucursal
- ✅ Visibles solo para el propietario y admin
- ✅ Completamente privados

---

## 📱 RESPONSIVE DESIGN

✅ **PC, Tablet, Móvil (375px)** - Todo sincronizado (será después de Supabase)

---

## 💰 CÁLCULO DE PAGOS

### Socios
- **$350 por sesión** (fijo, sin importar pacientes por hora)

### Fisios
- **$250 por paciente** (en clínica)
- **$450 por hora** (si hay 3+ pacientes en la misma hora)
- **Domicilio A:** +$700 por sesión
- **Domicilio B:** +$1,000 por sesión

---

## 🚀 PRÓXIMO PASO: CONECTAR SUPABASE

**Para sincronizar datos en tiempo real (PC ↔ Celular):**

1. **Crear proyecto gratis en:** https://supabase.com
2. **Copiar credenciales a `.env.local`**
3. **Ejecutar SQL schema** (archivo incluido: `supabase-schema.sql`)
4. **Instalar:** `npm install @supabase/supabase-js`
5. **Publicar:** `npm run build` → `vercel --prod`

**Instrucciones completas:** Archivo `SETUP_SUPABASE.md`

---

## 📋 DATOS PRECARGADOS

- ✅ 49 pacientes (con histórico de junio/julio)
- ✅ 78 sesiones Igal Villa (Socio) - Junio 2026
- ✅ 15 sesiones Martina (Fisio) - Julio 2026
- ✅ Cálculos de pago ya generados

---

## 🎯 ÚLTIMAS MEJORAS AGREGADAS (Esta sesión)

1. ✅ Gestionar Usuarios mejorado con edición completa
2. ✅ Nueva pantalla "Mi Perfil" para usuarios
3. ✅ Datos bancarios opcionales (banco, cuenta, sucursal)
4. ✅ Botón "Mi Perfil" en Registrar Sesiones
5. ✅ Modal de edición responsive
6. ✅ Todo responsive (PC + móvil)

---

## 🔍 PARA VERIFICAR QUE FUNCIONA

**En PC:**
1. Ingresa con admin: reactive.admin@clinic.com / reactive.admin1
2. Ve a Gestionar Usuarios
3. Crea usuario nuevo (autogenera contraseña)
4. Edítalo (cambiar email, agregar teléfono)

**En Celular:**
1. Ingresa con ese usuario nuevo
2. Ve a Mi Perfil (👤 arriba a la derecha)
3. Agrega teléfono y datos bancarios
4. Guarda

**Después de Supabase:** Los cambios se verán en ambos dispositivos automáticamente

---

## 📁 ARCHIVOS IMPORTANTES

```
SETUP_SUPABASE.md         ← Instrucciones para Supabase
PROMPT_CONTINUACION.md    ← Copiar para próximo chat
supabase-schema.sql       ← SQL a ejecutar en Supabase
.env.local                ← Credenciales Supabase (crear)
```

---

## 💡 NOTAS

- Actualmente usa `localStorage` (datos locales por dispositivo)
- Después de Supabase, será sincronizado en tiempo real
- Contraseña solo cambia admin
- Datos bancarios son opcionales pero visibles para admin
- Sistema completamente responsive
- Sin bugs conocidos

---

## 🆘 SI NECESITAS CONTINUAR EN OTRO CHAT

1. **Copia el contenido de:** `PROMPT_CONTINUACION.md`
2. **Di:** "Continuar con Supabase ReActive"
3. **Pega el prompt completo**
4. Yo continuaré desde donde se dejó

---

**Versión:** Beta 1.0  
**Última actualización:** 2026-07-10  
**Estado:** Listo para Supabase

