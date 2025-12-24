# Qwellcode - Creative Agency Website

![Version](https://img.shields.io/badge/version-3.3.0-blue.svg)
![Status](https://img.shields.io/badge/status-production_ready-success.svg)

> **Building permanent platforms for permanent success**

A modern, high-performance creative agency website with JSON-based content management, multilingual support, and advanced 3D animations. Built for Qwellcode Solutions GmbH & Co. KG - a bleeding-edge dev shop creating enterprise-grade systems and Web3 infrastructure.

---

## 🏢 About Qwellcode

**Qwellcode** operates as two synchronized entities:
- **Qwellcode Solutions** - Creators building robust enterprise systems
- **Qwellcode Labs** - Researchers pioneering bleeding-edge technology

### Our Track Record
- 🌍 **Scale**: Millions of users, 5,000+ partners, 180K+ creators
- 🏗️ **Enterprise**: Germany's largest furniture group (BEGA), variete.de platform
- 🎨 **Cultural Web3**: POAP Protocol (7 years), Museum of Crypto Art (MOCA), mocaOS
- 🔬 **Innovation**: AI agents (AGI), NFT infrastructure, decentralized platforms

### Philosophy
We don't chase trends—we build **permanent platforms for permanent success**. From Web3 pioneers to enterprise architects, we create systems designed to scale and endure.

---

## ✨ Key Features

### Content Management
- 🎯 **JSON-Based CMS** - Edit `content.json`, no HTML required
- 🛠️ **Visual Admin Panel** - Browser-based editor at `admin.html`
- 🌍 **Multilingual** - English/German with one-click toggle

### Design & Animation
- 🌀 **15 Psychedelic 3D Shapes** - Tesseract, Klein bottle, Möbius strip, and more
- 🎨 **GSAP Animations** - Smooth scroll-based effects with ScrollTrigger
- 🔄 **Swup Transitions** - SPA-like navigation without page reloads
- 📱 **Fully Responsive** - Optimized for all devices

### Technical
- ⚡ **High Performance** - Lighthouse score >90
- 🔍 **SEO Complete** - Open Graph, Twitter Cards, JSON-LD structured data
- 🚀 **Production Ready** - Tested and deployment-ready
- 🎭 **Custom Cursor** - Interactive effects and hover states

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install required packages
npm install
```

### 2. Start Development Server
```bash
# Start local server on http://localhost:3000
npm start

# Or use the alias
npm run dev
```

The website will be available at `http://localhost:3000`

**Alternative:** No server required for basic testing - just open `index.html` in your browser.

### 3. Test Language Toggle
- Look for **🇬🇧 EN → 🇩🇪** button in header
- Click to switch entire site instantly
- Your choice is remembered

### 4. Edit Content

**Option A: Visual Admin Panel** (Recommended)
```bash
# Open admin panel in browser
open admin.html
# Or navigate to http://localhost:3000/admin.html
```
- Add/edit/delete projects, team, services, blog posts
- Switch languages while editing
- Download updated `content.json`

**Option B: Direct JSON Editing**
```bash
# Edit content.json
code content.json

# Structure:
{
  "config": { "languages": [...] },
  "translations": {
    "en": { "site": {...}, "projects": [...], "team": [...] },
    "de": { /* Same structure in German */ }
  }
}
```

### 5. Compile SCSS (Optional)

If you modify styles in the `scss/` directory:

```bash
# Compile SCSS once
npm run build:css

# Watch for changes and auto-compile
npm run watch:css
```

---
 
## 📂 Project Structure

```
qcode-website/
├── index.html              # Landing page
├── admin.html              # Content management panel
├── content.json            # ⭐ ALL CONTENT HERE
│
├── pages/                  # Additional HTML pages
├── js/
│   ├── content-manager.js  # Content loading & rendering
│   ├── main.js             # Animations & interactions
│   ├── qcode.js            # Initialization & modals
│   └── plugins/            # Third-party libraries
│
├── scss/                   # Source styles (compiled to CSS)
│   ├── _variables.scss     # Colors, fonts, sizes
│   ├── _components.scss    # UI components & 3D shapes
│   ├── _common.scss        # Base styles & utilities
│   └── style.scss          # Main entry
│
├── css/
│   ├── style.css           # Compiled SCSS (DO NOT EDIT)
│   ├── qcode.css           # ⭐ Custom QCode CSS (modals, portfolio, language switcher)
│   └── plugins/            # Third-party CSS (bootstrap, swiper, fancybox)
│
└── img/
    ├── works/              # Portfolio images
    ├── faces/              # Team photos
    ├── blog/               # Blog thumbnails
    └── partners/           # Partner logos
```

---

## 🎨 Featured Projects

### Current Portfolio (9 Projects)

1. **BEGA** - Enterprise platform for Germany's largest furniture group (5,000+ partners)
2. **TIXU** - Event ticketing and management system
3. **zeroone** - Creative digital platform
4. **Codex** - Content management and publishing
5. **MOCA** - Museum of Crypto Art (mocaOS platform)
6. **variete.de** - E-commerce and booking platform
7. **Amber** - Digital experience platform (paused)
8. **POAP** - Proof of Attendance Protocol (7 years on Ethereum, previous work)
9. **AGI** - AI agent development and research

### Project Categories
- **Web3 & Blockchain**: POAP, MOCA, mocaOS
- **Enterprise Systems**: BEGA, variete.de
- **Event & Ticketing**: TIXU
- **AI & Research**: AGI, Codex
- **Digital Experiences**: zeroone, Amber

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, SCSS, JavaScript (jQuery 3.x)
- GSAP 3.x (animations) + ScrollTrigger
- Swiper.js (sliders), Swup.js (transitions)
- Fancybox (galleries), Font Awesome 5 (icons)
- Bootstrap Grid (layout only)

**Content Management**
- JSON-based content system
- Visual admin panel
- Multilingual support (EN/DE)
- Real-time updates

**Build & Deploy**
- Static site (no build process required)
- Optional: Prepros for SCSS compilation
- Deploy anywhere (Netlify, Vercel, GitHub Pages, S3)

---

## 📝 Common Tasks

### Add a Project
1. Open `admin.html` or edit `content.json`
2. Add to `translations.en.projects` array:
```json
{
  "id": "project-id",
  "title": "Project Name",
  "category": "Category / Type",
  "featured": true,
  "thumbnail": "img/works/10.jpg",
  "shortDescription": "Brief description...",
  "technologies": ["Tech1", "Tech2"],
  "highlights": ["Feature 1", "Feature 2"]
}
```
3. Add same to `translations.de.projects` (German)
4. Upload images to `/img/works/`
5. Refresh browser

### Update Hero Text
```json
// In content.json
"site": {
  "hero": {
    "headline": "Your New Headline",
    "description": "Your description..."
  }
}
```

### Change Colors
```scss
// In scss/_variables.scss
$accent: rgba(255, 152, 0, 1);  // Orange
$dark: rgba(0, 0, 0, 1);
$light: rgba(255, 255, 255, 1);
```

### Modify Custom Styles

**SCSS Files** (compiled to `style.css`):
```scss
// In scss/_variables.scss - Change colors, fonts, sizes
$accent: rgba(135, 216, 50, 1);  // Lime green accent
$dark: rgba(0, 0, 0, 1);
$light: rgba(255, 255, 255, 1);

// In scss/_components.scss - Modify UI components & shapes
// In scss/_common.scss - Base styles & utilities
```

**Custom CSS** (direct editing):
```css
// In css/qcode.css - Custom QCode styles that don't need SCSS:
// ✅ Language switcher (.mil-lang-btn, .mil-language-switcher)
// ✅ Portfolio grid (.mil-portfolio-grid, .mil-portfolio-item-inline)
// ✅ Modal system (.mil-modal, .mil-modal-content, .mil-modal-close)
// ✅ Service card alignment fixes
// ✅ Project detail modal styles (#project-details-content)
```

**Important CSS Rules:**
1. **Edit SCSS files** for core styles (colors, typography, components)
2. **Edit qcode.css** for custom QCode-specific features
3. **Never edit style.css** directly (it's compiled from SCSS)
4. After SCSS changes, run `npm run build:css`

---

## 🌀 Psychedelic Shapes System

15 geometric shapes with 4D projections and impossible topology:

**Usage:**
```html
<div class="mil-animation-frame">
  <div class="mil-animation mil-position-1"
       data-shape-type="tesseract"
       data-intensity="psychedelic"
       data-color="accent"></div>
</div>
```

**Available Shapes:**
- **Mind-Bending**: tesseract, klein-bottle, mobius, fractal-tetra, dna-helix
- **Advanced 3D**: torus, icosahedron, star
- **Classic**: diamond, cube, octahedron, sphere, prism, helix, dodecahedron

**Intensity**: `calm`, `normal`, `intense`, `psychedelic`
**Colors**: `light`, `accent`, `gradient`, `rainbow`

---

## 🌍 Multilingual API

```javascript
// Load content
QCodeContent.load(function(data) {
  console.log('Content loaded!', data);
});

// Get content (automatically uses current language)
const projects = QCodeContent.getProjects(true);  // featured only
const team = QCodeContent.getTeam();
const services = QCodeContent.getServices();

// Switch language
QCodeContent.switchLanguage('de');  // German
QCodeContent.switchLanguage('en');  // English

// Render content
QCodeContent.renderFeaturedProjects('.portfolio-grid');
QCodeContent.renderServices('.services-container');
QCodeContent.renderTeam('.team-container', true);
```

---

## 🐛 Troubleshooting

### Content Not Appearing
1. Check browser console (F12)
2. Validate JSON at [jsonlint.com](https://jsonlint.com)
3. Clear cache: `Cmd+Shift+R` / `Ctrl+Shift+R`
4. Verify `content.json` is in root directory

### Images Not Loading
- Use relative paths: `img/works/1.jpg` ✅
- Not absolute: `/img/works/1.jpg` ❌
- Check file names are case-sensitive

### Language Toggle Not Working
```javascript
// In browser console
console.log(QCodeContent.loaded);  // Should be true
console.log(QCodeContent.currentLanguage);  // 'en' or 'de'
QCodeContent.switchLanguage('de');  // Force switch
```

---

## 🚢 Deployment

### Pre-Deployment Checklist
- [ ] Validate `content.json`
- [ ] Compile SCSS: `npm run build:css`
- [ ] Optimize all images (< 500KB)
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test mobile responsiveness
- [ ] Check all links work
- [ ] Verify no console errors

### Local Testing
```bash
# Install dependencies
npm install

# Start local development server
npm start

# Visit http://localhost:3000
```

### Production Deployment

**Static Hosting** (Recommended - No build process needed)

1. **Netlify** (Drag & Drop)
   ```bash
   # Simply drag the entire project folder to Netlify
   # Or connect your Git repository
   ```

2. **Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel --prod
   ```

3. **GitHub Pages**
   ```bash
   # Push to GitHub repository
   git add .
   git commit -m "Deploy website"
   git push origin main

   # Enable GitHub Pages in repository settings
   ```

4. **Traditional FTP**
   - Upload all files to your web host
   - Ensure `index.html` is in the root directory
   - Set proper file permissions (644 for files, 755 for directories)

5. **AWS S3 + CloudFront**
   ```bash
   # Install AWS CLI
   pip install awscli

   # Upload to S3
   aws s3 sync . s3://your-bucket-name --exclude "node_modules/*" --exclude "scss/*"
   ```

### Build Commands (for automated platforms)

```bash
# Install command
npm install

# Build command (compiles SCSS)
npm run build:css

# Output directory
./ (root - static site, no build required)
```

---

## 📚 Documentation

- **README.md** - This file (quick reference)
- **admin.html** - Visual content editor
- **test-language-toggle.html** - Testing interface
- **.cursorrules** - Development guidelines

---

## 📞 Support

### Quick Links
- 🌐 Website: [qwellcode.de](https://qwellcode.de)
- 📧 Email: info@qwellcode.de
- 🐦 Twitter: [@qwellcode](https://twitter.com/qwellcode)
- 💼 GitHub: [github.com/qwellcode](https://github.com/qwellcode)

### Getting Help
1. Check browser console (F12)
2. Validate JSON syntax
3. Review this README
4. Test with included test pages

---

## 📊 Current Status

**Version**: 3.3.0 (December 23, 2025)
**Status**: ✅ Production Ready
**Content**: 9 projects, 8 team members, 3 services, 2 languages
**Images**: 55 professional placeholders (ready for screenshots)
**SEO**: Complete (Open Graph, Twitter Cards, JSON-LD)
**Admin Panel**: Fully functional with multilingual support

---

## 📜 License & Credits

### Company
**Qwellcode Solutions GmbH & Co. KG**
Geseker Straße 53a, 33154 Salzkotten, Germany

### Technologies
- jQuery 3.x, GSAP 3.x, Swiper.js, Swup.js, Fancybox
- HTML5, SCSS, Bootstrap Grid, Font Awesome 5

### Template
Based on Ashley/QCode Creative Agency Template with extensive custom enhancements:
- v3.3: Production release (portfolio, admin, SEO)
- v3.2: One-click language toggle
- v3.1: Psychedelic shapes system 2.0
- v3.0: Multilingual system
- v2.0: JSON content management

---

**Built with ❤️ using modern web technologies**

© 2024-2025 Qwellcode - Building permanent platforms for permanent success
