# Fisiotips - Evaluación de Lesiones Deportivas

Sitio web de Joaquín Cazenave para consultas y evaluaciones de lesiones deportivas de miembro inferior.

## Stack Tecnológico

- **Framework**: Next.js 16 (React)
- **Hosting**: Vercel
- **Pago**: Mercado Pago (integración en formularios)
- **Base de Datos**: Supabase (API)

## Desarrollo Local

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
```

### Deploy a Vercel

```bash
vercel --prod
```

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página de inicio
│   └── api/            # API routes
├── components/         # Componentes React reutilizables
│   ├── ReservaForm.tsx # Formulario de consulta
│   ├── Nav.tsx         # Navegación
│   └── ...
├── content/           # Contenido (textos, datos)
├── public/            # Assets estáticos
└── styles/            # Estilos globales
```

## Formulario de Evaluación

El formulario de consulta incluye:
- Datos personales (nombre, edad, ubicación)
- Información del deporte que realiza
- Nivel de esfuerzo físico (obligatorio)
- Sucursal preferida (obligatorio)
- **Preferencia horaria** (obligatorio) - De mañana, De tarde, Ambas opciones
- Motivo de consulta (obligatorio)
- Tratamientos previos
- Estudios médicos (opcional)

## Contacto

- Email: jcazenave12@gmail.com
- WhatsApp: Incluido en el sitio
