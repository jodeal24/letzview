export const LANGS = [
{ code: "en", name: "English" },
{ code: "fr", name: "Français" },
{ code: "de", name: "Deutsch" },
{ code: "lb", name: "Lëtzebuergesch" },
];

export async function loadStrings(lang) {
const res = await fetch(`i18n/${lang}.json`);
return res.json();
}

export function applyStrings(strings) {
document.querySelectorAll("[data-t]").forEach((el) => {
const key = el.getAttribute("data-t");
if (strings[key]) el.textContent = strings[key];
});
}

export function setupLangSelector(selectEl) {
const current = localStorage.getItem("lang") || navigator.language.slice(0, 2) || "en";
LANGS.forEach((l) => {
const opt = document.createElement("option");
opt.value = l.code; opt.textContent = l.name; selectEl.appendChild(opt);
});
selectEl.value = LANGS.some(l=>l.code===current) ? current : "en";
selectEl.addEventListener("change", () => {
localStorage.setItem("lang", selectEl.value);
location.reload();
});
return selectEl.value;
}
