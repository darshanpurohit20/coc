const fetchBtn = document.getElementById("fetchBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");

// Backend URL for fetching single clan info
const BACKEND_URL = "https://33775888b504.ngrok-free.app/clan"; 

fetchBtn.addEventListener("click", async () => {
  output.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    // Fetch clan_tags.txt
    const fileRes = await fetch("clan_tags.txt");
    const text = await fileRes.text();
    const clanTags = text.split("\n").map(t => t.trim()).filter(Boolean);

    // Loop through each tag
    for (let tag of clanTags) {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }) // send single clan tag
      });

      if (!res.ok) throw new Error(`Backend error for tag ${tag}: ${res.status}`);

      const clan = await res.json();

      // Display as card
      const card = document.createElement("div");
      card.className = "clan-card";
      card.innerHTML = `
        <h2>${clan.name || "Unknown Clan"}</h2>
        <p><strong>Tag:</strong> ${clan.tag}</p>
        <p><strong>Level:</strong> ${clan.level || "N/A"}</p>
        <p><strong>Members:</strong> ${clan.members || "N/A"}</p>
      `;
      output.appendChild(card);
    }

    loader.classList.add("hidden");

  } catch (err) {
    loader.classList.add("hidden");
    console.error("Fetch error:", err);
    output.innerHTML += `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
