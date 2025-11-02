# 🚀 GUÍA PASO A PASO: DESPLIEGUE EN VERCEL (NAVEGADOR)

## 📦 **PASO 1: DESCARGAR EL ARCHIVO ZIP**

He preparado tu aplicación en un archivo ZIP listo para subir:
- **Archivo:** `/workspace/evaluapro-ugt/evaluapro-ugt-deploy.zip`
- **Tamaño:** Optimizado (sin node_modules ni archivos innecesarios)
- **Contenido:** Aplicación Next.js completa con todas las configuraciones

---

## 🌐 **PASO 2: ACCEDER A VERCEL**

1. **Abre tu navegador** y ve a: **https://vercel.com**
2. **Haz clic en:** "Sign Up" si no tienes cuenta
3. **Inicia sesión** con GitHub, GitLab, o email (recomendado GitHub)

---

## 📤 **PASO 3: CREAR NUEVO PROYECTO**

### Opción A: Subir ZIP (MÁS FÁCIL)
1. En el dashboard de Vercel, haz clic en **"New Project"**
2. Selecciona **"Browse Templates"** o **"Import"**
3. Arrastra y suelta el archivo `evaluapro-ugt-deploy.zip`
4. **¡Vercel detectará automáticamente Next.js!**

### Opción B: Conectar GitHub (RECOMENDADO)
1. Sube primero el código a GitHub:
   ```bash
   # En terminal, dentro de /workspace/evaluapro-ugt
   git init
   git add .
   git commit -m "EvalúaPro UGT - Plataforma completa"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/evaluapro-ugt.git
   git push -u origin main
   ```
2. En Vercel: **"New Project"** → **"Import Git Repository"**
3. Selecciona tu repositorio

---

## ⚙️ **PASO 4: CONFIGURACIÓN AUTOMÁTICA**

Vercel detectará automáticamente:
- ✅ **Framework:** Next.js 14
- ✅ **Comando build:** `npm run build`
- ✅ **Directorio:** `.next`
- ✅ **Variables de entorno:** Ya incluidas en `.env.local`

**Solo necesitas:**
1. Hacer clic en **"Deploy"**
2. Esperar 2-3 minutos

---

## 🎯 **PASO 5: VARIABLES DE ENTORNO (SI ES NECESARIO)**

Si Vercel pregunta por variables de entorno, añade:

```
NEXT_PUBLIC_SUPABASE_URL=https://ebiqbjgrmjdkwlckmpuj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXFiamdybWpka3dsY2ttcHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjkyMDUsImV4cCI6MjA3NzYwNTIwNX0.OBCL4RWR3A536ZZrAof_tI5QNDYRJeA5x6HXv-P4d6s
```

---

## 🎉 **¡RESULTADO!**

Después del despliegue tendrás:
- **URL pública:** `https://evaluapro-ugt-abc123.vercel.app`
- **Panel admin:** `https://evaluapro-ugt-abc123.vercel.app/login`
- **Formulario:** `https://evaluapro-ugt-abc123.vercel.app/solicitar`

---

## 🔑 **CREDENCIALES DE ACCESO:**

- **URL:** `[TU-URL]/login`
- **Email:** `jpedragosa@nom.ugt.org`
- **Contraseña:** `Reyes2025!`

---

## 🧪 **PRUEBAS DESPUÉS DEL DESPLIEGUE:**

### 1. Página Principal
- Ve a: `[TU-URL]/`
- ✅ Debe cargar la página de UGT

### 2. Formulario Público
- Ve a: `[TU-URL]/solicitar`
- ✅ Completa y envía formulario
- ✅ Verifica email de confirmación

### 3. Panel Admin
- Ve a: `[TU-URL]/login`
- ✅ Inicia sesión con credenciales
- ✅ Accede a dashboard admin

### 4. Flujo Completo
- Crea solicitud → Inicia sesión → Evalúa → Verifica informe

---

## 📞 **SI NECESITAS AYUDA:**

**¡Tu aplicación está 100% lista!** Solo necesitas subir el ZIP o conectar con GitHub.

**¿Problemas comunes?**
- **Error de build:** Verifica variables de entorno
- **No carga:** Espera 2-3 minutos después del deploy
- **Error 500:** Las Edge Functions de Supabase ya están desplegadas

---

## 🎯 **MI RECOMENDACIÓN:**

**Usa la Opción A (Subir ZIP)** - Es la más rápida:
1. Descargar `/workspace/evaluapro-ugt/evaluapro-ugt-deploy.zip`
2. Ir a Vercel → New Project → Arrastrar ZIP
3. ¡Deploy!

**Tiempo total: 5 minutos máximo.**

---
*Desarrollado por MiniMax Agent*
*Plataforma: EvalúaPro UGT*
*Fecha: 2 de noviembre de 2025*