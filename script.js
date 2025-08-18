const fetchBtn = document.getElementById("fetchBtn"); 
const output = document.getElementById("output"); 
const loader = document.getElementById("loader"); 
const BACKEND_URL = "https://33775888b504.ngrok-free.app/clan"; 
const BATCH_SIZE = 200; // number of requests per batch 

fetchBtn.addEventListener("click", async () => { 
  output.innerHTML = ""; 
  loader.classList.remove("hidden"); 
  try { 
    // Fetch clan_tags.txt 
    const fileRes = await fetch("clan_tags.txt"); 
    const text = await fileRes.text(); 
    const clanTags = text.split("\n").map(t => t.trim()).filter(Boolean); 

    // Process in batches 
    for (let i = 0; i < clanTags.length; i += BATCH_SIZE) { 
      const batch = clanTags.slice(i, i + BATCH_SIZE); 
      const batchPromises = batch.map(tag => fetch(BACKEND_URL, { 
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

      // Render results 
      results.forEach(clan => { 
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
            <p><strong>Tag:</strong> ${clan.tag}</p> 
            <p><strong>Level:</strong> ${clan.level || "N/A"}</p> 
            <p><strong>Members:</strong> ${clan.members || "N/A"}</p>
          `; 
        } 
        output.appendChild(card); 
      }); 
    } 
    loader.classList.add("hidden"); 
  } catch (err) { 
    loader.classList.add("hidden"); 
    console.error("Fetch error:", err); 
    output.innerHTML += `<p style="color:red;">Error: ${err.message}</p>`; 
  } 
});
