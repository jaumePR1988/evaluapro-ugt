# 🚀 Guía de Despliegue: GitHub → Vercel

## ✅ Estado Actual
- **GitHub Repository**: https://github.com/jaumePR1988/evaluapro-ugt
- **Código**: ✅ Subido correctamente (227 archivos)
- **Próximo paso**: Desplegar en Vercel

---

## 📋 Pasos Detallados para Desplegar en Vercel

### **PASO 1: Acceder a Vercel**

1. Abre tu navegador y ve a: **https://vercel.com**
2. Clic en **"Login"** (arriba a la derecha)
3. Selecciona **"Continue with GitHub"**
4. Autoriza a Vercel a acceder a tu cuenta de GitHub

---

### **PASO 2: Crear Nuevo Proyecto**

Una vez dentro de Vercel:

1. Clic en el botón **"Add New..."** (arriba a la derecha)
2. Selecciona **"Project"** del menú desplegable
3. Verás la página **"Import Git Repository"**

---

### **PASO 3: Importar Repositorio**

1. En la sección **"Import Git Repository"**:
   - Busca: `evaluapro-ugt`
   - O busca por tu usuario: `jaumePR1988`

2. Deberías ver:
   ```
   jaumePR1988/evaluapro-ugt
   [Import]
   ```

3. Clic en el botón **"Import"** al lado del repositorio

---

### **PASO 4: Configurar Proyecto**

Vercel detectará automáticamente que es un proyecto Next.js:

**Configuración detectada:**
- **Framework Preset**: Next.js
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `next build` (automático)
- **Output Directory**: `.next` (automático)

**NO CAMBIES NADA** en esta sección.

---

### **PASO 5: Agregar Variables de Entorno** ⚠️ **IMPORTANTE**

Antes de desplegar, debes agregar las variables de entorno:

1. Busca la sección **"Environment Variables"**
2. Clic en **"Add Variable"** o despliega la sección

3. **Agrega estas 2 variables:**

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://ebiqbjgrmjdkwlckmpuj.supabase.co`
   - Environment: Marcar **Production**, **Preview** y **Development**

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaXFiamdybWpka3dsY2ttcHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjkyMDUsImV4cCI6MjA3NzYwNTIwNX0.OBCL4RWR3A536ZZrAof_tI5QNDYRJeA5x6HXv-P4d6s`
   - Environment: Marcar **Production**, **Preview** y **Development**

---

### **PASO 6: Desplegar**

1. **Revisa** que todo esté correcto:
   - ✅ Framework: Next.js
   - ✅ 2 variables de entorno agregadas
   
2. Clic en el botón grande **"Deploy"**

3. **Espera 2-3 minutos** mientras Vercel:
   - Clona el repositorio
   - Instala dependencias (npm install)
   - Construye el proyecto (next build)
   - Despliega la aplicación

---

### **PASO 7: ¡Aplicación Desplegada!**

Cuando termine el despliegue verás:

```
🎉 Congratulations!
Your project has been successfully deployed.
```

**Obtendrás una URL como:**
- `https://evaluapro-ugt.vercel.app`
- O algo similar: `https://evaluapro-ugt-xxxxx.vercel.app`

---

## 🧪 Verificar el Despliegue

Una vez desplegado, prueba:

1. **Página principal**: `https://tu-url.vercel.app`
2. **Login**: `https://tu-url.vercel.app/login`
   - Email: `jpedragosa@nom.ugt.org`
   - Contraseña: `Reyes2025!`

---

## ⚙️ Configuración Post-Despliegue

### **Dominio Personalizado (Opcional)**

Si quieres usar tu propio dominio (ej: `evaluapro.ugt.org`):

1. En el dashboard de Vercel, ve a tu proyecto
2. Clic en **"Settings"** → **"Domains"**
3. Agrega tu dominio personalizado
4. Sigue las instrucciones de configuración DNS

---

## 🔧 Supabase Edge Functions

**IMPORTANTE**: Las Edge Functions de Supabase NO se despliegan automáticamente con Vercel.

Para que funcionen los emails y otras funciones:

1. Las funciones ya están creadas en tu proyecto Supabase
2. Ya están desplegadas (versión 1)
3. **No necesitas hacer nada más** - ya funcionan

---

## 📊 Resumen de URLs

| Servicio | URL | Estado |
|----------|-----|--------|
| GitHub | https://github.com/jaumePR1988/evaluapro-ugt | ✅ Activo |
| Vercel | (Se generará al desplegar) | ⏳ Pendiente |
| Supabase | https://ebiqbjgrmjdkwlckmpuj.supabase.co | ✅ Activo |

---

## 🆘 Solución de Problemas

### **Error: "Environment variables missing"**
- Verifica que agregaste ambas variables en el Paso 5
- Asegúrate de que no hay espacios al inicio o final

### **Error: "Build failed"**
- Vercel intentará reconstruir automáticamente
- Si persiste, contacta para revisar los logs

### **No puedo hacer login**
- Verifica que las variables de entorno están correctas
- Revisa la consola del navegador (F12) para ver errores

---

## 📞 Ayuda Adicional

Si encuentras algún problema durante el despliegue:
1. Toma una captura de pantalla del error
2. Comparte el mensaje de error exacto
3. Te ayudaré a resolverlo

---

**¡Listo para desplegar!** 🚀

Sigue estos pasos y tu aplicación estará en línea en menos de 5 minutos.
