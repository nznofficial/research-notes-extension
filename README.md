Here’s a **clean, professional README** you can copy-paste directly into `README.md` for the **Research Notes** extension. It’s written to be clear for **you**, other developers, and future-you.

---

# 📝 Research Notes – Chrome Extension

A lightweight Google Chrome extension that lets you **capture research notes directly from the web**.
Highlight text, right-click, and save it — along with the page title, URL, timestamp, and optional tags.

No accounts. No backend. Just fast note capture while you browse.

---

## ✨ Features

* 📌 **Save highlighted text** via right-click context menu
* 🌐 Automatically captures:

  * Selected text
  * Page title
  * Page URL
  * Timestamp
* 🏷 **Basic tagging support**

  * Assign tags from a submenu
  * Manage tags from the Options page
* 🔍 **Search and filter notes** from the popup
* 💾 Uses Chrome storage (local or sync-capable)
* 🧩 Built with **Manifest V3**

---

## 🚀 How It Works

1. Highlight text on any webpage
2. Right-click → **Save note** (or **Save note with tag**)
3. Open the extension popup to view, search, or delete notes

All data is stored using Chrome’s storage APIs.

---

## 🗂 Project Structure

```
research-notes-extension/
├── manifest.json        # Extension configuration (MV3)
├── background.js        # Context menu + note saving logic
├── popup.html           # Notes viewer UI
├── popup.js             # Popup behavior (search, delete, filter)
├── options.html         # Tag management UI
├── options.js           # Tag CRUD logic
├── styles.css           # Shared styling
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🧠 Data Model (Stored Notes)

Each note is stored as a simple object:

```json
{
  "id": "uuid",
  "text": "Highlighted quote",
  "title": "Page title",
  "url": "https://example.com",
  "tag": "Work",
  "createdAt": "2025-01-01T12:34:56.000Z"
}
```

Notes are stored as an array in Chrome storage.

---

## 🔧 Installation (Local Development)

1. Clone or download this repository
2. Open Chrome and go to:

   ```
   chrome://extensions
   ```
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder

The extension is now available in your browser.

---

## ⚙️ Permissions Used

| Permission     | Why                            |
| -------------- | ------------------------------ |
| `contextMenus` | Add right-click menu items     |
| `storage`      | Save notes and tags            |
| `activeTab`    | Access page metadata           |
| `scripting`    | Clipboard and page interaction |
| `<all_urls>`   | Allow use on any webpage       |

---

## 🧩 Tech Stack

* JavaScript (ES6+)
* Chrome Extensions API (Manifest V3)
* HTML / CSS
* No frameworks, no backend

---

## 🛣 Possible Enhancements

* ✏️ Edit notes after saving
* 🏷 Multi-tag support
* 🔄 Chrome sync across devices
* 📤 Export notes (Markdown / JSON / CSV)
* 🗒 Add personal annotations separate from quotes
* ☁️ Optional cloud backend (Firebase / Supabase)

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

If you want, next we can:

* Add **sync support**
* Refactor storage into a clean “repository” module
* Turn this into a **publish-ready Chrome Web Store listing**
* Convert the popup to **React**

Just say what’s next.
