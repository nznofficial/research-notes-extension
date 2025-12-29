const STORAGE_KEYS = { NOTES: "notes", TAGS: "tags" };

async function getLocal(key, fallback) {
  const r = await chrome.storage.local.get([key]);
  return r[key] ?? fallback;
}
async function setLocal(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function matches(note, q, tag) {
  const query = q.trim().toLowerCase();
  const hay = `${note.text} ${note.title} ${note.url} ${note.tag}`.toLowerCase();
  const okQuery = !query || hay.includes(query);
  const okTag = !tag || note.tag === tag;
  return okQuery && okTag;
}

async function removeNote(id) {
  const notes = await getLocal(STORAGE_KEYS.NOTES, []);
  const next = notes.filter(n => n.id !== id);
  await setLocal(STORAGE_KEYS.NOTES, next);
}

function renderTags(select, tags) {
  select.innerHTML = `<option value="">All tags</option>` + tags.map(t => `<option value="${t}">${t}</option>`).join("");
}

function renderList(listEl, notes, q, tag) {
  const tpl = document.getElementById("noteTpl");
  listEl.innerHTML = "";

  const filtered = notes.filter(n => matches(n, q, tag));

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty">No notes match your search.</div>`;
    return;
  }

  for (const note of filtered) {
    const node = tpl.content.cloneNode(true);
    node.querySelector("[data-tag]").textContent = note.tag || "General";
    node.querySelector("[data-text]").textContent = note.text;

    const link = node.querySelector("[data-link]");
    link.textContent = note.title ? note.title : note.url;
    link.href = note.url;

    node.querySelector("[data-meta]").textContent = `${fmtDate(note.createdAt)} • ${note.url}`;

    node.querySelector("[data-delete]").addEventListener("click", async () => {
      await removeNote(note.id);
      await boot(); // simple refresh
    });

    listEl.appendChild(node);
  }
}

async function boot() {
  const [notes, tags] = await Promise.all([
    getLocal(STORAGE_KEYS.NOTES, []),
    getLocal(STORAGE_KEYS.TAGS, ["General"])
  ]);

  const searchEl = document.getElementById("search");
  const tagFilterEl = document.getElementById("tagFilter");
  const listEl = document.getElementById("list");

  renderTags(tagFilterEl, tags);

  const draw = () => renderList(listEl, notes, searchEl.value, tagFilterEl.value);

  searchEl.oninput = draw;
  tagFilterEl.onchange = draw;

  draw();
}

boot();
