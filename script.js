const fetchBtn = document.getElementById("fetchBtn");
const stopBtn = document.getElementById("stopBtn");
const output = document.getElementById("output");
const loader = document.getElementById("loader");

const clanTypeFilter = document.getElementById("clanTypeFilter");
const minMembersFilter = document.getElementById("minMembersFilter");
const raidLeagueFilter = document.getElementById("raidLeagueFilter");

const BACKEND_URL = "https://4e3f07d0bd3f.ngrok-free.app/clan"; 
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
      const minTHFilter = document.getElementById("minTHFilter");
      results.forEach(clan => {
        // Apply filters
        if (!clan.error) {
        const typeFilter = clanTypeFilter.value;
        const minMembers = parseInt(minMembersFilter.value.split("-")[0]) || 0; // take start of range
        const maxMembers = parseInt(minMembersFilter.value.split("-")[1]) || 50; // take end of range
        const minTH = parseInt(minTHFilter.value) || 0; // default 0 if not selected
        const capitalLeague = raidLeagueFilter.value;
          
if ((typeFilter && clan.type !== typeFilter) ||
            (clan.members < minMembers || clan.members > maxMembers) ||
            (capitalLeague && clan.capitalLeague?.name !== capitalLeague) ||
            (clan.requiredTownhallLevel < minTH)
        ) {
            return; // skip this clan
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
            <h2><strong>Name:</strong> ${clan.name || "Unknown Clan"}</h2>
            <p><strong>Clan Link:</strong> 
              <a href="https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(clan.tag)}" target="_blank">
                <b>Join</b>
              </a>
            </p>
            <p><strong>Type:</strong> ${clan.type || "N/A"}</p>
            <p><strong>Members:</strong> ${clan.members || "0"}</p>
            <p><strong>Required TH level:</strong> ${clan.requiredTownhallLevel ?? "0"}</p>
            <p><strong>Required Trophies:</strong> ${clan.requiredTrophies || "0"}</p>
            <p><strong>Capital League:</strong> ${clan.capitalLeague?.name || "N/A"}</p> <p><strong>Clan War League:</strong> ${clan.warLeague?.name || "N/A"}</p>
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



const body = document.body;
const toggle = document.getElementById('themeToggle');

// Function to apply a theme
function applyTheme(theme) {
  if (theme === 'dark') body.classList.add('dark-mode');
  else body.classList.remove('dark-mode');
}

// Check saved theme in localStorage first
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // If no saved theme, use system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// Toggle button click
toggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  // Save user preference
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Optional: Listen for system theme changes dynamically
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) { // only update if user hasn't manually chosen
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
