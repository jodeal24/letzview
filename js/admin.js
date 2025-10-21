onst PASSWORD = "Admin2025"; // change this before publishing
const url = document.getElementById('audioUrl').value.trim();
if (!lang || !url) return alert('Language and URL required');
audioTemp.push({ lang, url });
document.getElementById('audioLang').value='';
document.getElementById('audioUrl').value='';
refreshTempLists();
};

document.getElementById('addCapBtn').onclick = () => {
const lang = document.getElementById('capLang').value.trim();
const url = document.getElementById('capUrl').value.trim();
if (!lang || !url) return alert('Language and URL required');
capTemp.push({ lang, url });
document.getElementById('capLang').value='';
document.getElementById('capUrl').value='';
refreshTempLists();
};

// add episode

document.getElementById('addEpisodeBtn').onclick = () => {
const sid = Number(document.getElementById('seriesSelect').value);
const sNum = Number(document.getElementById('seasonNumber').value);
const number = Number(document.getElementById('epNumber').value);
const title = document.getElementById('epTitle').value.trim();
const description = document.getElementById('epDesc').value.trim();
const poster = document.getElementById('epPoster').value.trim();
if (!sid || !sNum || !number || !title) return alert('Missing fields');
const ser = catalog.series.find(s=>s.id===sid);
const sea = ser.seasons.find(x=>x.number===sNum);
sea.episodes.push({ number, title, description, poster, audio: [...audioTemp], captions: [...capTemp] });
audioTemp.length = 0; capTemp.length = 0; refreshTempLists();
document.getElementById('epNumber').value='';
document.getElementById('epTitle').value='';
document.getElementById('epDesc').value='';
document.getElementById('epPoster').value='';
renderCatalog();
};

// download / upload / save

document.getElementById('downloadBtn').onclick = () => {
const blob = new Blob([JSON.stringify(catalog, null, 2)], {type:'application/json'});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'catalog.json';
a.click();
};

document.getElementById('uploadInput').onchange = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = () => {
try { catalog = JSON.parse(reader.result); renderCatalog(); fillSeriesSelect(); }
catch(err){ alert('Invalid JSON'); }
};
reader.readAsText(file);
};

// Save: uploads to your repo? Static sites can’t write; so this prepares a file you then commit on GitHub.
document.getElementById('saveBtn').onclick = () => {
alert('After Download, go to GitHub → data/catalog.json → Edit → Paste → Commit.');
};
