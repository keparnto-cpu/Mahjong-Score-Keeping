const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, "data", "scores.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Make sure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ days: [] }));
}

// GET scores
app.get("/api/scores", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
  } catch {
    res.json({ days: [] });
  }
});

// PUT scores (replace all)
app.put("/api/scores", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Mahjong server running on port ${PORT}`));
