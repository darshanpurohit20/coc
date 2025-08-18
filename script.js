const fetchBtn = document.getElementById("fetchBtn");
const output = document.getElementById("output");
const clanTagsTextarea = document.getElementById("clanTags");

// Change this to your backend URL
const BACKEND_URL = "http://localhost:9032/clans";

fetchBtn.addEventListener("click", async () => {
  const clanTags = clanTagsTextarea.value.split("\n").map(t => t.trim()).filter(Boolean);

  if (clanTags.length === 0) {
    output.textContent = "Please enter at least one clan tag.";
    return;
  }

  try {
    output.textContent = "Fetching data...";
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
