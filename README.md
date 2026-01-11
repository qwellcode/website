# Qwellcode - Creative Agency Website

![Version](https://img.shields.io/badge/version-3.4.0-blue.svg)
![Status](https://img.shields.io/badge/status-production_ready-success.svg)

A modern creative agency website with JSON-based content management, multilingual support (EN/DE), and advanced 3D animations. Built for Qwellcode - enterprise systems and Web3 infrastructure.

## ✨ Features

- 🎯 **JSON-Based CMS** - Edit `content.json`, no HTML required
- 🛠️ **Visual Admin Panel** - Browser-based editor
- 🌍 **Multilingual** - English/German toggle
- 🌀 **3D Animations** - GSAP + ScrollTrigger
- 📱 **Responsive** - Mobile-first design
- ⚡ **Fast & SEO-Ready** - Lighthouse score >90

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Or just open index.html in browser
```

### Editing Content

**⚠️ IMPORTANT: Always edit `content.json` - NEVER edit text in HTML files!**

HTML contains empty placeholders. All text comes from `content.json` and overwrites HTML on load.

**Option 1: Visual Editor** (Recommended)
- Open `admin.html` in browser
- Add/edit projects, team, services, blog
- Download updated `content.json`

**Option 2: Edit JSON Directly**
```json
{
  "projectAssets": { /* images, tech, shared assets */ },
  "translations": {
    "en": { "site": {...}, "projects": [...] },
    "de": { /* German translations */ }
  }
}
```

**Rules:**
- ✅ Edit `content.json` for all text
- ✅ Update both EN and DE
- ✅ Validate JSON (jsonlint.com)
- ❌ Don't edit HTML text (ignored)
- ❌ Hard refresh after changes (Ctrl+Shift+R)

### Styling

```bash
# Compile SCSS to CSS
npm run build:css

# Watch for changes
npm run watch:css
```

---

## 📂 Structure

```
├── index.html           # Landing page
├── admin.html           # Visual editor
├── content.json         # ⭐ ALL CONTENT
├── pages/               # Other HTML pages
├── js/
│   ├── content-manager.js
│   ├── main.js
│   └── qcode.js
├── scss/                # Source styles
│   ├── _variables.scss
│   ├── _components.scss
│   └── style.scss
├── css/
│   ├── style.css        # Compiled (DON'T EDIT)
│   └── qcode.css        # Custom styles (OK to edit)
└── img/                 # Images
```

## 🛠️ Tech Stack

HTML5, SCSS, jQuery, GSAP, Swiper.js, Swup.js, Bootstrap Grid, Font Awesome

---

## 📝 Content System

**How it works:**
1. `content.json` = All content
2. HTML = Empty placeholders only
3. JavaScript loads JSON → renders to HTML
4. Change JSON → refresh browser

**Structure:**
- `projectAssets` - Images, tech stack (shared across languages)
- `translations.en` - English text
- `translations.de` - German text

**Common Mistakes:**
- ❌ Editing HTML (ignored, will be overwritten)
- ❌ Only updating one language
- ❌ Breaking JSON syntax
- ✅ Edit `content.json`, update both languages, validate JSON

---

## 📝 Common Tasks

### Add a Project
1. Edit `content.json` → `translations.en.projects[]`
2. Add same to `translations.de.projects[]`
3. Add images to `projectAssets`
4. Upload images to `/img/works/`

### Change Colors
```scss
// scss/_variables.scss
$accent: rgba(135, 216, 50, 1);
$dark: rgba(0, 0, 0, 1);
$light: rgba(255, 255, 255, 1);

// Then run: npm run build:css
```

### Custom Styles
- **Core styles**: Edit `scss/` files → compile with `npm run build:css`
- **QCode features**: Edit `css/qcode.css` directly
- **Never edit**: `css/style.css` (auto-generated)

---

## 🐛 Troubleshooting

**Content not appearing:**
- Check console (F12)
- Validate JSON (jsonlint.com)
- Hard refresh (Ctrl+Shift+R)

**Images not loading:**
- Use relative paths: `img/works/1.jpg` ✅
- Not absolute: `/img/works/1.jpg` ❌

**Language toggle broken:**
```javascript
// Browser console
QCodeContent.switchLanguage('de')
localStorage.clear(); location.reload()
```

---

## 🚢 Deployment

**Pre-flight:**
- Validate `content.json`
- Compile SCSS: `npm run build:css`
- Test on Chrome/Firefox/Safari
- Check mobile responsiveness

**Deploy to:**
- **Netlify/Vercel** - Drag & drop or Git connect
- **GitHub Pages** - Enable in repo settings
- **FTP** - Upload all files
- **S3/CloudFront** - `aws s3 sync`
- **IPFS** - Use static build (see below)

---

## 🌐 Static IPFS Export

Build a self-contained static version for IPFS, FTP, or any static file host. No server required—just copy the files and it works.

### Build Static Distribution

```bash
# Generate static build
npm run build:static

# Test locally before deploying
npm run serve:static
```

This creates a `dist/` folder (~65 MB) with everything needed:

```
dist/
├── index.html      # HTML with inline content (no AJAX)
├── 404.html
├── favicon.ico
├── logo.png
├── README.md       # Deployment instructions
├── css/            # All stylesheets
├── js/             # Modified JS with inline content support
├── img/            # All images
└── data/           # Additional assets
```

### Key Features

- ✅ **No AJAX Required** - `content.json` is inlined directly into HTML
- ✅ **All Relative Paths** - Works from any subdirectory or IPFS gateway
- ✅ **Language Switching** - Still works via localStorage
- ✅ **Offline Capable** - Fully self-contained
- ✅ **Zero Config** - Just copy files and serve

### Deploy to IPFS

**Option 1: Pinata / Fleek / web3.storage**
1. Upload the entire `dist/` folder
2. Get your CID
3. Access via `https://gateway.pinata.cloud/ipfs/<CID>/`

**Option 2: IPFS Desktop**
1. Import the `dist/` folder
2. Pin it for persistence
3. Access via `https://ipfs.io/ipfs/<CID>/`

**Option 3: ipfs-deploy CLI**
```bash
cd dist
npx ipfs-deploy .
```

### Deploy to FTP / Static Host

Just upload the `dist/` folder contents to your server. Works with:
- Any FTP server
- GitHub Pages
- Netlify / Vercel
- Amazon S3
- Any web server (Apache, Nginx, etc.)

### How It Works

The build script (`scripts/build-static.js`):
1. Copies all assets to `dist/`
2. Inlines `content.json` data into `index.html` as `window.QCODE_INLINE_CONTENT`
3. Modifies `content-manager.js` to use inline data (with AJAX fallback)
4. Generates deployment documentation

This means the page loads instantly without any fetch/AJAX calls—perfect for decentralized hosting where CORS might be an issue.

---

## 📚 Documentation

- `.cursorrules` - Developer guidelines (detailed)
- `admin.html` - Visual editor
- `content.json` - Content database

---

## 📞 Contact

🌐 [qwellcode.de](https://qwellcode.de) | 📧 info@qwellcode.de | 🐦 [@qwellcode](https://twitter.com/qwellcode)

---

**© 2013-2026 Qwellcode Solutions GmbH & Co. KG** | v3.4.0 Production Ready
