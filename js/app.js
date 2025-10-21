import { setupLangSelector, loadStrings, applyStrings } from "./i18n.js";
const item = el(`<li>
<button class="w-full text-left bg-slate-800 hover:bg-slate-700 rounded p-2 flex items-start gap-3">
<img src="${ep.poster||series.poster||'assets/logo.png'}" class="w-20 h-12 object-cover rounded" alt="thumb"/>
<span><strong>${strings.episode||'Episode'} ${ep.number}:</strong> ${ep.title}</span>
</button>
</li>`);
item.querySelector('button').onclick = () => playEpisode(series, season, ep);
episodeList.append(item);
});
// autoplay first episode
if (season.episodes[0]) playEpisode(series, season, season.episodes[0]);
}

function playEpisode(series, season, ep) {
// audio options (each option points to a different URL for the full video in that language)
audioSelect.innerHTML='';
ep.audio.forEach(a=>{
const opt = document.createElement('option');
opt.value=a.url; opt.textContent=a.lang.toUpperCase();
audioSelect.appendChild(opt);
});
audioSelect.onchange = () => loadVideo(audioSelect.value, ep);

// captions
captionSelect.innerHTML='';
const off = document.createElement('option'); off.value='off'; off.textContent='Off'; captionSelect.appendChild(off);
(ep.captions||[]).forEach(c=>{
const opt = document.createElement('option');
opt.value=c.url; opt.textContent=c.lang.toUpperCase();
captionSelect.appendChild(opt);
});
captionSelect.onchange = ()=> applyCaptions(player, captionSelect.value);

epDesc.textContent = ep.description || '';

// load first language by default
if (ep.audio[0]) loadVideo(ep.audio[0].url, ep);
}

function loadVideo(url, ep) {
player.innerHTML='';
const src = document.createElement('source');
src.src = url; // MP4 or HLS (.m3u8) — modern browsers will pick it up; for HLS on desktop Safari works natively
player.appendChild(src);
player.load();
player.play().catch(()=>{});
// re-apply captions if selected
if (captionSelect.value && captionSelect.value !== 'off') applyCaptions(player, captionSelect.value);
}

function applyCaptions(videoEl, vttUrl) {
// remove existing tracks
videoEl.querySelectorAll('track').forEach(t=>t.remove());
if (vttUrl === 'off') return;
const track = document.createElement('track');
track.kind = 'subtitles';
track.srclang = 'xx';
track.label = 'Subtitles';
track.src = vttUrl;
track.default = true;
videoEl.appendChild(track);
}

// Open modal when clicking a series
function findSeriesById(id){return catalog.series.find(s=>String(s.id)===String(id));}

function onOpen(e){
const btn = e.target.closest('[data-series]');
if (!btn) return;
const series = findSeriesById(btn.getAttribute('data-series'));
if (series) openModal(series);
}

document.addEventListener('click', onOpen);

document.getElementById('modalClose').onclick = () => modal.classList.add('hidden');
