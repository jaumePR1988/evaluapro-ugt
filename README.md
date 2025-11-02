# EvalúaPro UGT - Plataforma de Valoración de Puestos de Trabajo

Plataforma completa para la valoración de puestos de trabajo según el Manual del Tribunal Laboral de Catalunya (TLC) para la Unión General de Trabajadores (UGT).

## Características Principales

### Frontend (Next.js + TypeScript + Tailwind CSS)
- **Páginas Públicas:**
  - Página de inicio con información del servicio
  - Formulario de solicitud de valoración con carga de archivos
  - Página "Quiénes Somos" con información del técnico certificado

- **Panel de Administración:**
  - Dashboard con métricas y gestión de solicitudes
  - Asistente de valoración paso a paso siguiendo el Manual TLC
  - Sistema de evaluación con 15 subfactores configurables
  - Cálculo automático de puntuación y grupo profesional

### Backend (Supabase)
- **Base de Datos:**
  - 7 tablas principales: profiles, site_content, evaluation_factors, group_limits, requests, request_files, evaluations
  - 15 subfactores del Manual TLC completamente poblados
  - Equivalencias para convenios de 6, 7 y 8 grupos profesionales
  - Políticas RLS (Row Level Security) configuradas

- **Storage:**
  - Bucket "solicitud-archivos" para almacenar archivos PDF/DPT
  - Límite de 10MB por archivo

## Estructura del Proyecto

```
evaluapro-ugt/
├── app/
│   ├── page.tsx                      # Página de inicio
│   ├── solicitar/page.tsx             # Formulario de solicitud
│   ├── quienes-somos/page.tsx         # Información del técnico
│   ├── admin/
│   │   ├── dashboard/page.tsx         # Dashboard administrativo
│   │   └── evaluar/[id]/page.tsx      # Asistente de valoración
│   ├── layout.tsx                     # Layout principal
│   └── globals.css                    # Estilos globales
├── lib/
│   └── supabase.ts                    # Cliente Supabase y tipos
├── public/
│   └── ugt-logo.jpg                   # Logo UGT
├── .env.local                         # Variables de entorno
├── next.config.js                     # Configuración Next.js
├── tailwind.config.ts                 # Configuración Tailwind
└── package.json

```

## Configuración e Instalación

### 1. Instalar Dependencias

```bash
npm install
# o
pnpm install
# o
yarn install
```

### 2. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado con las credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://ebiqbjgrmjdkwlckmpuj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key incluida]
```

### 3. Ejecutar el Proyecto

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Base de Datos - Estructura Completa

### Tabla: evaluation_factors
Contiene los 15 subfactores del Manual TLC:
- Factor A (Conocimientos): A.1, A.2, A.3.a, A.3.b
- Factor B (Iniciativa): B
- Factor C (Autonomía): C
- Factor D (Responsabilidades): D.1.a/b, D.2.a/b, D.3.a/b
- Factor E (Mando): E
- Factor F (Complejidad): F.1, F.2

### Tabla: group_limits
Equivalencias de puntuación a grupos profesionales:
- 6 grupos: Grupo 1 (>416), Grupo 6 (≤156)
- 7 grupos: Grupo 1 (>428), Grupo 7 (≤148)
- 8 grupos: Grupo 1 (>436), Grupo 8 (≤142)

## Flujo de Valoración

### Paso 1: Datos Iniciales
El técnico completa:
- Empresa y puesto a valorar
- Personas afectadas
- Convenio colectivo
- Tipo de puesto: Directo (producción) o Indirecto (administrativo/técnico)
- Número de grupos del convenio: 6, 7 u 8

### Paso 2: Valoración de Factores
- Se muestran los 8 subfactores relevantes según el tipo de puesto
- Para cada subfactor, el técnico selecciona el grado correspondiente
- Cada grado tiene puntos asociados automáticamente

### Paso 3: Resultado Final
- Cálculo automático de puntuación total
- Conversión a grupo profesional según equivalencias
- Detalle de todas las puntuaciones
- Opción de guardar la valoración

## Características de Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Solo técnicos autenticados pueden acceder al panel de administración
- Contenido público solo lectura para páginas informativas
- Validación de tipos de archivo en uploads

## Tecnologías Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript
- **Estilos:** Tailwind CSS con tema personalizado UGT (color principal: #D32F2F)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Iconos:** Lucide React
- **Deploy:** Vercel (recomendado)

## Próximas Mejoras Sugeridas

1. **Integración Google Drive API:**
   - Generación automática de informes en formato DOCX
   - Organización por carpetas de empresa
   - Plantilla personalizada con datos de valoración

2. **Sistema de Notificaciones:**
   - Edge Function para enviar emails cuando hay nuevas solicitudes
   - Notificaciones a usuarios sobre el estado de su solicitud

3. **Autenticación:**
   - Sistema de login con Supabase Auth
   - Restringir acceso a dominio @ugt.es
   - Gestión de roles (admin/técnico)

4. **Exportación de Datos:**
   - Export a CSV/Excel de todas las valoraciones
   - Estadísticas y gráficos de métricas

## Contacto

Para más información sobre EvalúaPro UGT, contactar con:
- Email: contacto@evaluapro-ugt.es
- Teléfono: +34 900 000 000

---

© 2025 EvalúaPro UGT - Unión General de Trabajadores
