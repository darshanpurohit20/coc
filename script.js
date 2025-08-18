const fetchBtn = document.getElementById("fetchBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");

// Change to your backend URL
const BACKEND_URL = "http://localhost:9032/clans";

fetchBtn.addEventListener("click", async () => {
  output.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fetchAll: true }) // server already has clan tags
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    loader.classList.add("hidden");

    // Display each clan as a card
    data.forEach(clan => {
      const card = document.createElement("div");
      card.className = "clan-card";
      card.innerHTML = `
        <h2>${clan.name || "Unknown Clan"}</h2>
        <p><strong>Tag:</strong> ${clan.tag}</p>
        <p><strong>Level:</strong> ${clan.level || "N/A"}</p>
        <p><strong>Members:</strong> ${clan.members || "N/A"}</p>
      `;
      output.appendChild(card);
    });

  } catch (err) {
    loader.classList.add("hidden");
    console.error("Fetch error:", err); // <-- log error to console
    output.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
