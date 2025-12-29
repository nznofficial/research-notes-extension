const STORAGE_KEYS = { TAGS: "tags" };

async function getLocal(key, fallback) {
  const r = await chrome.storage.local.get([key]);
  return r[key] ?? fallback;
}
async function setLocal(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

function cleanTag(s) {
  return String(s || "").trim().replace(/\s+/g, " ");
}

async function boot() {
  const tagsEl = document.getElementById("tags");
  const newTagEl = document.getElementById("newTag");
  const addBtn = document.getElementById("addBtn");
  const tpl = document.getElementById("tagTpl");

  let tags = await getLocal(STORAGE_KEYS.TAGS, ["General"]);

  const render = async () => {
    tagsEl.innerHTML = "";
    for (const tag of tags) {
      const node = tpl.content.cloneNode(true);
      node.querySelector("[data-name]").textContent = tag;
      node.querySelector("[data-remove]").addEventListener("click", async () => {
        tags = tags.filter(t => t !== tag);
        if (tags.length === 0) tags = ["General"];
        await setLocal(STORAGE_KEYS.TAGS, tags);
        render();
      });
      tagsEl.appendChild(node);
    }
  };

  const addTag = async () => {
    const t = cleanTag(newTagEl.value);
    if (!t) return;

    if (!tags.includes(t)) {
      tags = [t, ...tags];
      await setLocal(STORAGE_KEYS.TAGS, tags);
    }
    newTagEl.value = "";
    render();
  };

  addBtn.addEventListener("click", addTag);
  newTagEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTag();
  });

  render();
}

boot();
