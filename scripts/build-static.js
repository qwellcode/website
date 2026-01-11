#!/usr/bin/env node
/**
 * Static IPFS Export Builder
 * 
 * Creates a self-contained static version of the website that can be
 * hosted on IPFS, GitHub Pages, or any static file server.
 * 
 * Key features:
 * - Inlines content.json data directly into the HTML
 * - Copies all assets with relative paths
 * - No AJAX/fetch required - works offline
 * 
 * Usage: npm run build:static
 * Output: dist/ folder ready for IPFS upload
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Files and directories to copy
const ASSETS_TO_COPY = [
    'css',
    'js',
    'img',
    'data',
    'favicon.ico',
    'logo.png',
    '404.html'
];

// Files to skip during copy
const SKIP_FILES = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    'node_modules',
    'scripts',
    'scss',
    'package.json',
    'package-lock.json',
    'prepros.config',
    '.cursorrules',
    '.gitignore',
    'README.md',
    'admin.html'
];

console.log('🚀 Building static IPFS export...\n');

/**
 * Recursively copy directory
 */
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        if (SKIP_FILES.includes(entry.name)) continue;

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Clean and recreate dist directory
 */
function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
    fs.mkdirSync(DIST_DIR, { recursive: true });
    console.log('✓ Cleaned dist directory');
}

/**
 * Copy all assets
 */
function copyAssets() {
    for (const asset of ASSETS_TO_COPY) {
        const srcPath = path.join(ROOT_DIR, asset);
        const destPath = path.join(DIST_DIR, asset);

        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ Skipping ${asset} (not found)`);
            continue;
        }

        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
            console.log(`  ✓ Copied ${asset}/`);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`  ✓ Copied ${asset}`);
        }
    }
}

/**
 * Load and parse content.json
 */
function loadContent() {
    const contentPath = path.join(ROOT_DIR, 'content.json');
    const content = fs.readFileSync(contentPath, 'utf8');
    return JSON.parse(content);
}

/**
 * Create the inline content script
 */
function createInlineContentScript(content) {
    return `
<!-- Inline Content Data for IPFS/Static Hosting -->
<script>
window.QCODE_INLINE_CONTENT = ${JSON.stringify(content)};
</script>
`;
}

/**
 * Create the static content-manager.js that uses inline data
 */
function createStaticContentManager() {
    const originalPath = path.join(ROOT_DIR, 'js', 'content-manager.js');
    const original = fs.readFileSync(originalPath, 'utf8');

    // Replace the load function to use inline data instead of AJAX
    const modified = original.replace(
        /load:\s*function\s*\(\s*callback\s*\)\s*\{[\s\S]*?\.fail\([^}]+\}\);[\s\S]*?\}/,
        `load: function (callback) {
            // IPFS/Static version: Use inline content instead of AJAX
            if (window.QCODE_INLINE_CONTENT) {
                var data = window.QCODE_INLINE_CONTENT;
                window.QCodeContent.data = data;
                window.QCodeContent.loaded = true;

                // Priority: URL parameter > localStorage > default
                var urlLang = window.QCodeContent.getLanguageFromURL();
                var savedLang = localStorage.getItem('qcode_language');

                if (urlLang && data.translations[urlLang]) {
                    window.QCodeContent.currentLanguage = urlLang;
                    localStorage.setItem('qcode_language', urlLang);
                    console.log('Language loaded from URL:', urlLang);
                } else if (savedLang && data.translations[savedLang]) {
                    window.QCodeContent.currentLanguage = savedLang;
                    console.log('Language loaded from localStorage:', savedLang);
                } else {
                    window.QCodeContent.currentLanguage = data.config.defaultLanguage;
                    console.log('Language set to default:', data.config.defaultLanguage);
                }

                console.log('[IPFS Mode] Content loaded from inline data. Language:', window.QCodeContent.currentLanguage);

                if (callback) callback(data);
            } else {
                // Fallback to AJAX (for development)
                $.getJSON('content.json', function (data) {
                    window.QCodeContent.data = data;
                    window.QCodeContent.loaded = true;

                    var urlLang = window.QCodeContent.getLanguageFromURL();
                    var savedLang = localStorage.getItem('qcode_language');

                    if (urlLang && data.translations[urlLang]) {
                        window.QCodeContent.currentLanguage = urlLang;
                        localStorage.setItem('qcode_language', urlLang);
                    } else if (savedLang && data.translations[savedLang]) {
                        window.QCodeContent.currentLanguage = savedLang;
                    } else {
                        window.QCodeContent.currentLanguage = data.config.defaultLanguage;
                    }

                    console.log('Content loaded via AJAX. Language:', window.QCodeContent.currentLanguage);

                    if (callback) callback(data);
                }).fail(function (jqxhr, textStatus, error) {
                    console.error('Failed to load content.json:', error);
                });
            }
        }`
    );

    return modified;
}

/**
 * Process and generate static index.html
 */
function generateStaticHTML() {
    const content = loadContent();
    const indexPath = path.join(ROOT_DIR, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // Create inline content script
    const inlineScript = createInlineContentScript(content);

    // Inject inline content BEFORE the content-manager.js script
    html = html.replace(
        '<!-- content manager -->',
        `<!-- content manager -->\n${inlineScript}`
    );

    // Write static index.html
    const destPath = path.join(DIST_DIR, 'index.html');
    fs.writeFileSync(destPath, html, 'utf8');
    console.log('✓ Generated static index.html with inline content');
}

/**
 * Create static content-manager.js
 */
function generateStaticJS() {
    const staticContentManager = createStaticContentManager();
    const destPath = path.join(DIST_DIR, 'js', 'content-manager.js');
    fs.writeFileSync(destPath, staticContentManager, 'utf8');
    console.log('✓ Generated static content-manager.js');
}

/**
 * Generate a simple README for the dist folder
 */
function generateDistReadme() {
    const readme = `# Qwellcode Website - Static IPFS Build

This is a self-contained static build of the Qwellcode website,
optimized for IPFS and static file hosting.

## Hosting on IPFS

### Using Pinata, Fleek, or web3.storage:
1. Upload the entire contents of this folder
2. Access via the returned IPFS CID

### Using IPFS Desktop:
1. Import this folder to IPFS Desktop
2. Pin the folder
3. Access via: https://ipfs.io/ipfs/<CID>/

### Using ipfs-deploy:
\`\`\`bash
npx ipfs-deploy .
\`\`\`

## Local Testing

You can test locally with any static file server:

\`\`\`bash
npx serve .
# or
python -m http.server 8000
\`\`\`

## Features

- ✅ No server-side code required
- ✅ No AJAX requests (content is inlined)
- ✅ Works with any IPFS gateway
- ✅ All assets use relative paths
- ✅ Language switching works via localStorage

## Build Info

Built: ${new Date().toISOString()}
Version: ${require(path.join(ROOT_DIR, 'package.json')).version}
`;

    fs.writeFileSync(path.join(DIST_DIR, 'README.md'), readme, 'utf8');
    console.log('✓ Generated dist README');
}

/**
 * Calculate folder size
 */
function getFolderSize(folder) {
    let size = 0;

    const files = fs.readdirSync(folder);
    for (const file of files) {
        const filePath = path.join(folder, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            size += getFolderSize(filePath);
        } else {
            size += stat.size;
        }
    }

    return size;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Run build
try {
    cleanDist();
    console.log('\n📦 Copying assets...');
    copyAssets();
    console.log('\n🔧 Generating static files...');
    generateStaticHTML();
    generateStaticJS();
    generateDistReadme();

    const size = getFolderSize(DIST_DIR);
    console.log(`\n✅ Build complete!`);
    console.log(`   Output: dist/`);
    console.log(`   Size: ${formatBytes(size)}`);
    console.log(`\n📡 To deploy to IPFS:`);
    console.log(`   1. Upload the 'dist' folder to Pinata, Fleek, or ipfs-deploy`);
    console.log(`   2. Access via any IPFS gateway with the returned CID`);
    console.log(`\n🧪 To test locally:`);
    console.log(`   cd dist && npx serve .`);
} catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
}
