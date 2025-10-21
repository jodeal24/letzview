// js/admin.js
// NOTE: change the password value below BEFORE you push it live.
const PASSWORD = "Admin2025"; // <-- set your password here

let catalog = { series: [] };
let isAuthed = false;

// DOM refs (set lazily)
let authSection, editorSection, logoutBtn;

function showEditorUI() {
  authSection = document.getElementById('authSection');
  editorSection = document.getElementById('editorSection');
  logoutBtn = document.getElementById('logoutBtn');
  if (authSection) authSection.classList.add('hidden');
  if (editorSection) editorSection.classList.remove('hidden');
  if (logoutBtn) logoutBtn.classList.remove('hidden');
}

function hideEditorUI() {
  if (!authSection) authSection = document.getElementById('authSection');
  if (!editorSection) editorSection = document.getElementById('editorSection');
  if (authSection) authSection.classList.remove('hidden');
  if (editorSection) editorSection.classList.add('hidden');
  if (logoutBtn) logoutBtn.classList.add('hidden');
}

async function initEditor() {
  // existing initEditor code adapted
  try {
    const res = await fetch('data/catalog.json');
    catalog = await res.json();
    renderCatalog();
    fillSeriesSelect();
  } catch(err) {
    console.warn('Starting with empty catalog', err);
  }
}

export default {
  // Called by modal to check password (returns true/false)
  checkPassword(password) {
    if (!password) return false;
    if (password === PASSWORD) {
      // store flag in localStorage
      localStorage.setItem('lv_admin', '1');
      isAuthed = true;
      return true;
    }
    return false;
  },

  // Called by modal on successful auth to initialize the editor
  initEditorAfterAuth() {
    // reveal UI
    showEditorUI();
    initEditor();
    // attach logout
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('lv_admin');
        window.location.href = 'index.html';
      };
    }
  }
};

// If someone already has admin flag in localStorage (browser remembered), auto reveal
if (localStorage.getItem('lv_admin') === '1') {
  // fetch DOM ready then call
  window.addEventListener('DOMContentLoaded', () => {
    // If page loaded but modal exists hide it and init editor
    const m = document.getElementById('pwModal');
    if (m) m.classList.add('hidden');
    // show editor UI and init
    try { document.getElementById('authSection').classList.add('hidden'); } catch {}
    try { document.getElementById('editorSection').classList.remove('hidden'); } catch {}
    initEditor();
  });
}
