# ZEALOTCS Proxy — Tsarvar API Bridge

Proxy Node.js para mostrar datos del servidor Counter-Strike 1.6 ZEALOT CS desde Tsarvar.com  
Diseñado para usarse en Render.com (plan gratuito) y consumir datos desde `https://zealotcs.com`.

---

## 🚀 Despliegue en Render

1. Crea un nuevo repositorio en GitHub llamado **zealotcs-proxy**
2. Sube los archivos:
   - `server.js`
   - `package.json`
   - `README.md`
3. Entra en [Render.com](https://render.com)
4. Clic en **New + → Web Service**
5. Conecta tu GitHub y selecciona `zealotcs-proxy`
6. Configura:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** cualquiera
   - **Plan:** Free
7. Clic en **Deploy Web Service**

Render te dará una URL como:
https://zealotcs-proxy.onrender.com


---

## 📡 Endpoints disponibles

| Ruta | Descripción |
|------|--------------|
| `/server` | Información completa del servidor (nombre, mapa, slots, jugadores, etc.) |
| `/players` | Solo la lista de jugadores conectados |

---

## 🔁 Actualización automática
- Los datos se actualizan automáticamente cada **30 minutos**
- CORS restringido a `https://zealotcs.com`

---

## 💡 Uso desde tu HTML
Ejemplo:
```js
const serverUrl = "https://zealotcs-proxy.onrender.com/players";
fetch(serverUrl)
  .then(res => res.json())
  .then(data => console.log(data));


Guarda y cierra.

---

## 🗜️ PASO 5 — Crear el `.zip`

1️⃣ Selecciona los tres archivos dentro de la carpeta  
2️⃣ Clic derecho → **Enviar a → Carpeta comprimida (.zip)**  
3️⃣ Ponle el nombre:


✅ ¡Listo!  
Ahora puedes subir ese ZIP a GitHub y conectarlo a **Render.com → New Web Service → Node.js**  

---

¿Quieres que te guíe ahora paso a paso para **subirlo a GitHub y desplegarlo en Render** (con capturas y comandos)?
