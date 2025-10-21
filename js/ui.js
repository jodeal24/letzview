export function el(html) {
const t = document.createElement("template");
t.innerHTML = html.trim();
return t.content.firstElementChild;
}

export function truncate(text, n = 90) {
if (!text) return "";
return text.length > n ? text.slice(0, n - 1) + "…" : text;
}
