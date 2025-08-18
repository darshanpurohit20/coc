# Clan Data Dashboard

A **web-based dashboard** to fetch, filter, and display Clash of Clans clan data using clan tags.  
Features include **batch fetching**, **filters**, **offline caching**, **theme toggling**, and **manual JSON export**.

---

## Features

- **Fetch clan data** from the Clash of Clans API via a backend.
- **Batch processing** to avoid API rate limits (**20 clans per batch** by default).
- **Filters for:**
  - Clan type (e.g., “Open”, “Invite Only”)
  - Members range
  - Minimum required Town Hall level
  - Capital League
- **Offline caching**: Saves last 200 fetched clans in browser storage.
- **Last fetched timestamp**: Displays when data was last updated.
- **Theme toggle**: Dark/light mode with system preference detection.
- **Error handling**: Displays failed fetches in red cards.
- **Optional JSON export**: Allows downloading fetched clans as a `clans.json` file.

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/darshanpurohit07/coc.git
cd clan-data-dashboard
```
Open in browser:

Open index.html in any modern browser (Chrome, Firefox, Edge).

Ensure clan_tags.txt is in the same folder as index.html.

Usage

Enter your filters for type, members, Town Hall level, or Capital League.

Click Fetch Clan to retrieve clan information.

Use the Stop button to halt ongoing fetches.

The dashboard displays clan cards with relevant info.

If the API fails, cached clans (last 200) will be shown automatically.

Optional: Add a “Save as JSON” button to download fetched clans.

***File Structure***
clan-data-dashboard/
│
├─ index.html          # Main dashboard HTML
├─ style.css           # Styles for layout, dark/light theme
├─ script.js           # Fetching, filtering, caching, theme logic
├─ clan_tags.txt       # List of clan tags (one per line)
├─ README.md           # Project documentation


Technologies Used

Frontend: HTML, CSS, JavaScript

Backend: Node.js or any API endpoint to fetch clan data (replace BACKEND_URL)

Browser Storage: localStorage for caching

Optional: JSON Blob download for exporting clans

Notes

localStorage caching is browser-specific and will not appear on GitHub or other devices.

To persist data permanently or share with others, a backend JSON file or database is recommended.

Ensure CORS is enabled on your backend if fetching from localhost or another domain.
