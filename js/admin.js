// ===== letzview admin panel (simple working version) =====
// Password for popup
const PASSWORD = "Admin2025"; // <-- change if needed

let catalog = { series: [] };
let currentSeries = null;

// ✅ Called by admin.html popup
export default {
  checkPassword(password) {
    if (!password) return false;
    if (password === PASSWORD) {
      localStorage.setItem("lv_admin", "1");
      return true;
    }
    return false;
  },
  initEditorAfterAuth() {
    const editor = document.getElementById("editorSection");
    if (editor) editor.classList.remove("hidden");
    initEditor(); // initialize editor functions
  },
};

// ============================================================
// Editor logic (adding series / episodes)
function initEditor() {
  console.log("Editor initialized");
  renderCatalog();
  wireButtons();
}

// ---------------- Helper functions ----------------
function $(id) {
  return document.getElementById(id);
}

function renderCatalog() {
  const pre = $("catalogPreview");
  pre.textContent = JSON.stringify(catalog, null, 2);
}

function wireButtons() {
  $("addSeriesBtn").onclick = addSeries;
  $("addSeasonBtn").onclick = addSeason;
  $("addEpisodeBtn").onclick = addEpisode;
  $("downloadBtn").onclick = downloadCatalog;
}

// ---------------- Add Series ----------------
function addSeries() {
  const title = $("seriesTitle").value.trim();
  const poster = $("seriesPoster").value.trim();
  const desc = $("seriesDesc").value.trim();

  if (!title) return alert("Please enter a series title.");

  const id = Date.now();
  const newSeries = {
    id,
    title,
    poster,
    description: desc,
    seasons: [],
  };

  catalog.series.push(newSeries);
  currentSeries = newSeries;
  $("seriesSelect").innerHTML += `<option value="${id}">${title}</option>`;
  renderCatalog();
  alert("✅ Series added!");
}

// ---------------- Add Season ----------------
function addSeason() {
  if (!currentSeries) return alert("Please add or select a series first.");
  const num = Number($("seasonNumber").value);
  if (!num) return alert("Enter season number.");

  const exists = currentSeries.seasons.find((s) => s.number === num);
  if (exists) return alert("This season already exists.");

  currentSeries.seasons.push({ number: num, episodes: [] });
  renderCatalog();
  alert("✅ Season added!");
}

// ---------------- Add Episode ----------------
function addEpisode() {
  if (!currentSeries) return alert("Please add or select a series first.");
  const seasonNum = Number($("seasonNumber").value);
  const season = currentSeries.seasons.find((s) => s.number === seasonNum);
  if (!season) return alert("Please add this season first.");

  const epNum = Number($("epNumber").value);
  const title = $("epTitle").value.trim();
  const desc = $("epDesc").value.trim();
  const poster = $("epPoster").value.trim();

  if (!epNum || !title) return alert("Enter episode number and title.");

  const audioLang = $("audioLang").value.trim();
  const audioUrl = $("audioUrl").value.trim();
  const capLang = $("capLang").value.trim();
  const capUrl = $("capUrl").value.trim();

  const audio = audioLang && audioUrl ? [{ lang: audioLang, url: audioUrl }] : [];
  const captions = capLang && capUrl ? [{ lang: capLang, url: capUrl }] : [];

  const episode = {
    number: epNum,
    title,
    description: desc,
    poster,
    audio,
    captions,
  };

  season.episodes.push(episode);
  renderCatalog();
  alert("✅ Episode added!");
}

// ---------------- Download catalog ----------------
function downloadCatalog() {
  const data = JSON.stringify(catalog, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "catalog.json";
  a.click();
}
