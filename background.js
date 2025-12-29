const STORAGE_KEYS = {
    NOTES: "notes",
    TAGS: "tags"
  };
  
  const DEFAULT_TAGS = ["General", "Work", "School", "Ideas"];
  
  async function getFromStorage(key, fallback) {
    const result = await chrome.storage.local.get([key]);
    return result[key] ?? fallback;
  }
  
  async function setToStorage(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }
  
  function safeTrim(str, max = 5000) {
    if (!str) return "";
    const s = String(str).trim();
    return s.length > max ? s.slice(0, max) + "…" : s;
  }
  
  function createMenus(tags) {
    chrome.contextMenus.removeAll(() => {
      // Parent menu
      chrome.contextMenus.create({
        id: "save_note_root",
        title: "Save note",
        contexts: ["selection"]
      });
  
      // Tag submenu
      chrome.contextMenus.create({
        id: "save_note_with_tag",
        title: "Save note with tag",
        contexts: ["selection"]
      });
  
      for (const tag of tags) {
        chrome.contextMenus.create({
          id: `tag:${tag}`,
          parentId: "save_note_with_tag",
          title: tag,
          contexts: ["selection"]
        });
      }
    });
  }
  
  async function ensureDefaults() {
    const tags = await getFromStorage(STORAGE_KEYS.TAGS, null);
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      await setToStorage(STORAGE_KEYS.TAGS, DEFAULT_TAGS);
      createMenus(DEFAULT_TAGS);
    } else {
      createMenus(tags);
    }
  
    const notes = await getFromStorage(STORAGE_KEYS.NOTES, null);
    if (!notes || !Array.isArray(notes)) {
      await setToStorage(STORAGE_KEYS.NOTES, []);
    }
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    ensureDefaults();
  });
  
  // Rebuild menus when tags change
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEYS.TAGS]) {
      const newTags = changes[STORAGE_KEYS.TAGS].newValue || DEFAULT_TAGS;
      createMenus(newTags);
    }
  });
  
  async function addNote({ selectedText, pageUrl, pageTitle, tag }) {
    const notes = await getFromStorage(STORAGE_KEYS.NOTES, []);
    const now = new Date().toISOString();
  
    const note = {
      id: crypto.randomUUID(),
      text: safeTrim(selectedText),
      url: pageUrl,
      title: pageTitle || "",
      tag: tag || "General",
      createdAt: now
    };
  
    notes.unshift(note);
    await setToStorage(STORAGE_KEYS.NOTES, notes);
    return note;
  }
  
  // Context menu click handler
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    try {
      if (!info.selectionText || !tab) return;
  
      const tag = info.menuItemId.startsWith("tag:")
        ? info.menuItemId.slice(4)
        : "General";
  
      const note = await addNote({
        selectedText: info.selectionText,
        pageUrl: info.pageUrl || tab.url,
        pageTitle: tab.title,
        tag
      });
  
      // Optional: tiny confirmation via badge
      chrome.action.setBadgeText({ text: "✓", tabId: tab.id });
      setTimeout(() => chrome.action.setBadgeText({ text: "", tabId: tab.id }), 1200);
  
      console.log("Saved note:", note);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  });
  