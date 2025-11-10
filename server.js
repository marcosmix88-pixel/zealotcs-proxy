import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import https from "https";

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir solo tu dominio
const corsOptions = {
  origin: "https://zealotcs.com",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Caché
let cache = { server: null, players: null, lastUpdate: 0 };
const CACHE_TIME = 30 * 60 * 1000; // 30 minutos

// Agent para ignorar errores SSL/TLS
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Función para actualizar datos desde Tsarvar
async function actualizarDatos() {
  try {
    console.log("⏳ Actualizando datos desde Tsarvar...");
    const url = "https://api.tsarvar.com/v1/servers/counter-strike-1.6/131.221.33.14:27040";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://tsarvar.com/"
      },
      agent: httpsAgent
    });

    const data = await res.json();
    cache.server = data;
    cache.players = data.players || [];
    cache.lastUpdate = Date.now();
    console.log("✅ Datos actualizados correctamente");
  } catch (err) {
    console.error("❌ Error actualizando datos:", err.message);
  }
}

// Actualizar automáticamente cada 30 minutos
setInterval(actualizarDatos, CACHE_TIME);

// Cargar una vez al iniciar
actualizarDatos();

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("✅ ZEALOTCS Proxy activo en Render.com — endpoints: /server /players");
});

// Endpoint para toda la info del servidor
app.get("/server", async (req, res) => {
  try {
    if (!cache.server || Date.now() - cache.lastUpdate > CACHE_TIME) {
      await actualizarDatos();
    }
    res.json(cache.server || { error: "Sin datos en caché" });
  } catch (err) {
    res.json({ error: "Error al obtener los datos del servidor", detalle: err.message });
  }
});

// Endpoint solo para jugadores
app.get("/players", async (req, res) => {
  try {
    if (!cache.players || Date.now() - cache.lastUpdate > CACHE_TIME) {
      await actualizarDatos();
    }
    res.json(cache.players || []);
  } catch (err) {
    res.json({ error: "Error al obtener jugadores", detalle: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 ZEALOTCS Proxy activo en puerto ${PORT}`));