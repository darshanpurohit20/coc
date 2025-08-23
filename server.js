import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 9032;

app.use(cors());
app.use(express.json()); // for parsing JSON bodies

const COC_API_KEY = ""
const BASE_URL = "https://api.clashofclans.com/v1/clans";


async function fetchClan(tag) {
  const encodedTag = encodeURIComponent(tag);
  try {
    const res = await fetch(`${BASE_URL}/${encodedTag}`, {
      headers: { Authorization: `Bearer ${COC_API_KEY}` },
    });

    // Return proper error info instead of throwing
    if (!res.ok) {
      const text = await res.text(); // capture API error message
      return { error: `API error ${res.status}: ${text}` };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`❌ Failed for ${tag}:`, err.message);
    return { error: err.message };
  }
}

// POST endpoint for single clan
app.post("/clan", async (req, res) => {
  const { tag } = req.body;

  if (!tag) {
    return res.status(400).json({ error: "Missing clan tag in request body" });
  }

  const clanData = await fetchClan(tag);

  if (clanData.error) {
    // Return the API error without crashing
    return res.status(200).json({ tag, error: clanData.error });
  }

  res.json(clanData);
});

app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));

//npm install express cors node-fetch
//node server.js
//ngrok http 9032


