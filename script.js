const fetchBtn = document.getElementById("fetchBtn");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

// Change to your backend URL
const BACKEND_URL = "http://localhost:9032/clans";

fetchBtn.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    output.textContent = "Please select a clan_tags.txt file.";
    return;
  }

  const file = fileInput.files[0];
  const text = await file.text();
  const clanTags = text.split("\n")
                        .map(t => t.trim())
                        .filter(Boolean);

  if (clanTags.length === 0) {
    output.textContent = "No valid clan tags found in the file.";
    return;
  }

  try {
    output.textContent = "Fetching data from server...";
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: clanTags })
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
});
