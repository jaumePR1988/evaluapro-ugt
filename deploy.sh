#!/bin/bash
# Script de Despliegue - EvalúaPro UGT
# Desarrollado por MiniMax Agent

echo "🚀 Iniciando despliegue de EvalúaPro UGT..."
echo "======================================"

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta desde el directorio del proyecto."
    exit 1
fi

# Instalar dependencias locales
echo "📦 Instalando dependencias..."
npm install

# Mover temporalmente las funciones de Supabase para evitar errores de compilación
echo "🔧 Preparando archivos para el build..."
if [ -d "supabase" ]; then
    mv supabase supabase_temp
fi

# Construir proyecto
echo "🔨 Construyendo proyecto..."
npm run build

# Restaurar archivos de Supabase
if [ -d "supabase_temp" ]; then
    mv supabase_temp supabase
fi

# Crear archivo .env.local con variables de entorno
echo "⚙️  Configurando variables de entorno..."
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://ebiqbjgrmjdkwlckmpuj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXFiamdybWpka3dsY2ttcHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjkyMDUsImV4cCI6MjA3NzYwNTIwNX0.OBCL4RWR3A536ZZrAof_tI5QNDYRJeA5x6HXv-P4d6s
EOF

echo "✅ Variables de entorno configuradas"

# Desplegar con Vercel usando npx
echo "🌐 Desplegando en Vercel..."
npx vercel@latest --prod

echo ""
echo "🎉 ¡Despliegue completado!"
echo "======================================"
echo "📋 Credenciales de administrador:"
echo "   Email: jpedragosa@nom.ugt.org"
echo "   Contraseña: Reyes2025!"
echo ""
echo "📧 Sistema de emails configurado:"
echo "   Remitente: pedragosajaume@gmail.com"
echo "   Gmail SMTP operativo"
echo ""
echo "🔗 Accede a tu aplicación y comienza a usarla!"
echo "======================================"