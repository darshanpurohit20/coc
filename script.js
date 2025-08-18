const fetchBtn = document.getElementById("fetchBtn");
const stopBtn = document.getElementById("stopBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");

const clanTypeFilter = document.getElementById("clanTypeFilter");
const minMembersFilter = document.getElementById("minMembersFilter");
const raidLeagueFilter = document.getElementById("raidLeagueFilter");

const BACKEND_URL = "https://33775888b504.ngrok-free.app/clan"; 
const BATCH_SIZE = 20; // smaller batch to avoid 429
let stopRequested = false; // flag to stop fetching

fetchBtn.addEventListener("click", async () => {
  output.innerHTML = "";
  loader.classList.remove("hidden");
  stopRequested = false; // reset stop flag

  try {
    const fileRes = await fetch("clan_tags.txt");
    const text = await fileRes.text();
    const clanTags = text.split("\n").map(t => t.trim()).filter(Boolean);

    for (let i = 0; i < clanTags.length; i += BATCH_SIZE) {
      if (stopRequested) break; // check stop flag

      const batch = clanTags.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(tag =>
        fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag })
        })
        .then(res => {
          if (!res.ok) throw new Error(`Backend error for tag ${tag}: ${res.status}`);
          return res.json();
        })
        .catch(err => {
          console.error(`Error fetching ${tag}:`, err.message);
          return { tag, error: err.message };
        })
      );

      const results = await Promise.all(batchPromises);

      results.forEach(clan => {
        // Apply filters
        if (!clan.error) {
          const typeFilter = clanTypeFilter.value;
          const minMembers = parseInt(minMembersFilter.value) || 0;
          const raidLeague = raidLeagueFilter.value;

          if ((typeFilter && clan.type !== typeFilter) ||
              (clan.members < minMembers) ||
              (raidLeague && clan.raidLeague?.name !== raidLeague)) {
            return; // skip this clan if it doesn't match filters
          }
        }

        const card = document.createElement("div");
        card.className = "clan-card";

        if (clan.error) {
          card.style.background = "#f8d7da";
          card.innerHTML = `
            <h2>Failed to fetch</h2>
            <p><strong>Tag:</strong> ${clan.tag}</p>
            <p style="color:red;">${clan.error}</p>
          `;
        } else {
          card.innerHTML = `
            <h2>${clan.name || "Unknown Clan"}</h2>
            <p><strong>Clan Link:</strong> 
              <a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.tag)}" target="_blank">
                <b>Join</b>
              </a>
            </p>
            <p><strong>Type:</strong> ${clan.type || "N/A"}</p>
            <p><strong>Members:</strong> ${clan.members || "N/A"}</p>
            <p><strong>Level:</strong> ${clan.clanLevel || "N/A"}</p>
            <p><strong>Required Trophies:</strong> ${clan.requiredTrophies || "N/A"}</p>
            <p><strong>Capital League:</strong> ${clan.capitalLeague?.name || "N/A"}</p>
            <p><strong>Raid League:</strong> ${clan.raidLeague?.name || "N/A"}</p>
            <img src="${clan.badgeUrls?.medium || ''}" alt="Clan Badge" style="width:50px;height:50px;"/>
          `;
        }

        output.appendChild(card);
      }); // end of results.forEach
    } // end of for loop

    loader.classList.add("hidden");
  } catch (err) {
    loader.classList.add("hidden");
    console.error("Fetch error:", err);
    output.innerHTML += `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

// Stop button listener
stopBtn.addEventListener("click", () => {
  stopRequested = true;
  loader.classList.add("hidden");
  console.log("Fetch stopped by user!");
});
