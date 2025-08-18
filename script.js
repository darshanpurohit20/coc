const fetchBtn = document.getElementById("fetchBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");

const BACKEND_URL = "https://33775888b504.ngrok-free.app/clan"; 
const CONCURRENCY = 10; // number of requests running in parallel
const MAX_RETRIES = 3;   // retries for 429 errors

fetchBtn.addEventListener("click", async () => {
  output.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    // Fetch clan_tags.txt
    const fileRes = await fetch("clan_tags.txt");
    const text = await fileRes.text();
    const clanTags = text.split("\n").map(t => t.trim()).filter(Boolean);

    let index = 0;

    async function fetchClanWithRetry(tag, retries = MAX_RETRIES) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag })
          });
          if (res.ok) return await res.json();
          if (res.status === 429) {
            // wait exponentially longer
            await new Promise(r => setTimeout(r, attempt * 1000));
          } else {
            throw new Error(`Backend error for tag ${tag}: ${res.status}`);
          }
        } catch (err) {
          if (attempt === retries) throw err;
        }
      }
    }

    async function worker() {
      while (index < clanTags.length) {
        const i = index++;
        const tag = clanTags[i];
        try {
          const clan = await fetchClanWithRetry(tag);
          const card = document.createElement("div");
          card.className = "clan-card";
          card.innerHTML = `
            <h2>${clan.name || "Unknown Clan"}</h2>
            <p><strong>Tag:</strong> ${clan.tag}</p>
            <p><strong>Level:</strong> ${clan.level || "N/A"}</p>
            <p><strong>Members:</strong> ${clan.members || "N/A"}</p>
          `;
          output.appendChild(card);
        } catch (err) {
          console.error(`Error fetching ${tag}:`, err.message);
          const card = document.createElement("div");
          card.className = "clan-card";
          card.style.background = "#f8d7da";
          card.innerHTML = `
            <h2>Failed to fetch</h2>
            <p><strong>Tag:</strong> ${tag}</p>
            <p style="color:red;">${err.message}</p>
          `;
          output.appendChild(card);
        }
      }
    }

    // Launch workers
    const workers = Array(CONCURRENCY).fill(null).map(() => worker());
    await Promise.all(workers);

    loader.classList.add("hidden");
  } catch (err) {
    loader.classList.add("hidden");
    console.error("Fetch error:", err);
    output.innerHTML += `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
