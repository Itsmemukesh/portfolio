/**
 * Unified build script — assembles the full deployable site in _site/
 *
 * Output structure:
 *   _site/
 *   ├── index.html              ← redirect to /portfolio/ (for local testing)
 *   └── portfolio/
 *       ├── index.html          ← portfolio homepage
 *       ├── style.css / app.js / assets/ etc.
 *       └── blog/               ← Docusaurus build output
 *
 * Why portfolio/ subfolder?
 *   The live site is at github.io/portfolio/ (GitHub project page adds /portfolio/).
 *   Putting everything under _site/portfolio/ means:
 *     - Local:  npx serve _site  →  http://localhost:4000/portfolio/  (matches prod)
 *     - Deploy: gh-pages -d _site/portfolio  →  github.io/portfolio/  (correct)
 *   All Docusaurus baseUrl links (/portfolio/blog/...) and app.js links work identically.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT          = path.resolve(__dirname, '..');
const SITE          = path.join(ROOT, '_site');
const PORTFOLIO_OUT = path.join(SITE, 'portfolio');   // portfolio + blog live here
const BLOG_DIR      = path.join(ROOT, 'blog');
const BLOG_BUILD    = path.join(BLOG_DIR, 'build');

// Portfolio root files/folders to exclude from the copy
const EXCLUDE = new Set([
  'node_modules',
  '_site',
  'blog',
  'scripts',
  '.git',
  '.gitignore',
  'package-lock.json',
]);

function log(msg) {
  process.stdout.write(`\n[build] ${msg}\n`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── Step 1: Install blog dependencies if needed ───────────────────────────────
const blogModules = path.join(BLOG_DIR, 'node_modules');
if (!fs.existsSync(blogModules)) {
  log('Blog node_modules not found — running npm install...');
  execSync('npm install', { cwd: BLOG_DIR, stdio: 'inherit' });
}

// ── Step 2: Build Docusaurus ──────────────────────────────────────────────────
log('Building Docusaurus blog...');
execSync('npm run build', { cwd: BLOG_DIR, stdio: 'inherit' });

if (!fs.existsSync(BLOG_BUILD)) {
  console.error('[build] ERROR: blog/build/ was not created. Check Docusaurus output above.');
  process.exit(1);
}

// ── Step 3: Prepare _site/ and _site/portfolio/ ───────────────────────────────
log('Assembling _site/...');
if (fs.existsSync(SITE)) {
  fs.rmSync(SITE, { recursive: true, force: true });
}
fs.mkdirSync(PORTFOLIO_OUT, { recursive: true });

// ── Step 4: Root redirect (local dev convenience) ────────────────────────────
// Visiting http://localhost:4000/ auto-redirects to /portfolio/ so local URLs
// match production (https://Itsmemukesh.github.io/portfolio/)
fs.writeFileSync(
  path.join(SITE, 'index.html'),
  `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/portfolio/">
  <title>Redirecting…</title>
</head>
<body>
  <p>Redirecting to <a href="/portfolio/">/portfolio/</a>…</p>
</body>
</html>`
);

// ── Step 5: Copy portfolio files into _site/portfolio/ ───────────────────────
log('Copying portfolio files → _site/portfolio/...');
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (EXCLUDE.has(entry.name)) continue;
  const src  = path.join(ROOT, entry.name);
  const dest = path.join(PORTFOLIO_OUT, entry.name);
  if (entry.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

// ── Step 6: Copy blog build into _site/portfolio/blog/ ───────────────────────
log('Copying blog build → _site/portfolio/blog/...');
copyDir(BLOG_BUILD, path.join(PORTFOLIO_OUT, 'blog'));

log('Build complete!');
log('  Local preview : npm run serve:site  →  http://localhost:4000/portfolio/');
log('  Deploy        : npm run deploy  (gh-pages -d _site/portfolio)');
