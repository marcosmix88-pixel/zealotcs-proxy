import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cheerio from "cheerio";

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
const CACHE_TIME = 30 * 60 * 1000; // 30 min

const TSARVAR_URL = "https://tsarvar.com/es/servers/counter-strike-1.6/131.221.33.14:27040/players?sort=scoreRank&compact";

// Función para scrapear HTML y convertir a JSON
async function actualizarDatos() {
  try {
    console.log("⏳ Actualizando datos desde Tsarvar...");
    const res = await fetch(TSARVAR_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Lista de jugadores
    const players = [];
    $("table tbody tr").each((i, el) => {
      const tds = $(el).find("td");
      if(tds.length >= 3){
        players.push({
          name: $(tds[0]).text().trim(),
          score: parseInt($(tds[1]).text().trim()) || 0,
          time: $(tds[2]).text().trim()
        });
      }
    });

    // Información del servidor
    const serverName = $("h3.srvPage-contLabel").first().text().trim();
    const map = $(".srvPage-contMap").text().trim();
    const slotsText = $(".srvPage-contSlots").text().trim();
    const slotsMatch = slotsText.match(/(\d+)\/(\d+)/);
    const server = {
      name: serverName,
      map: map || "",
      slots: slotsMatch ? { current: parseInt(slotsMatch[1]), max: parseInt(slotsMatch[2]) } : null,
      players: players
    };

    cache.server = server;
    cache.players = players;
    cache.lastUpdate = Date.now();

    console.log(`✅ Datos actualizados. Jugadores conectados: ${players.length}`);
  } catch (err) {
    console.error("❌ Error actualizando datos:", err.message);
  }
}

// Actualizar cada 30 min
setInterval(actualizarDatos, CACHE_TIME);

// Primera carga
actualizarDatos();

// Endpoints
app.get("/", (req, res) => {
  res.send("✅ ZEALOTCS Proxy activo — endpoints: /server /players");
});

app.get("/server", async (req, res) => {
  if (!cache.server || Date.now() - cache.lastUpdate > CACHE_TIME) {
    await actualizarDatos();
  }
  res.json(cache.server || { error: "Sin datos en caché" });
});

app.get("/players", async (req, res) => {
  if (!cache.players || Date.now() - cache.lastUpdate > CACHE_TIME) {
    await actualizarDatos();
  }
  res.json(cache.players || []);
});

app.listen(PORT, () => console.log(`🚀 ZEALOTCS Proxy activo en puerto ${PORT}`));