// Inlines a Margin page's local CSS, fonts, scripts and SVG images into one self-contained file
// in margin/dist/, so it can be opened anywhere (email, side panel, file://) without its folder.
// Usage: node margin/scripts/bundle.mjs [page.html ...]   (default: every *.html in margin/)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(root).filter((f) => f.endsWith('.html'));
const mime = { woff2: 'font/woff2', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg' };
const dataUri = (file) => `data:${mime[file.split('.').pop()]};base64,${readFileSync(file).toString('base64')}`;

mkdirSync(join(root, 'dist'), { recursive: true });
for (const page of pages) {
  let html = readFileSync(join(root, page), 'utf8');
  html = html.replace(/<link rel="stylesheet" href="([^":]+)">/g, (_, href) => {
    const file = resolve(root, href);
    const css = readFileSync(file, 'utf8').replace(/url\(([^)'":]+\.(?:woff2|svg|png|jpg))\)/g, (m, u) => `url(${dataUri(resolve(dirname(file), u))})`);
    return `<style>\n${css}</style>`;
  });
  html = html.replace(/<script src="([^":]+)"><\/script>/g, (_, src) => `<script>\n${readFileSync(resolve(root, src), 'utf8')}</script>`);
  html = html.replace(/src="((?:icons|images)\/[^"]+)"/g, (_, src) => `src="${dataUri(resolve(root, src))}"`);
  html = html.replace(/href="([a-z-]+)\.html(#[^"]*)?"/g, (_, p, h = '') => `href="${p}.html${h}"`);
  writeFileSync(join(root, 'dist', page), html);
  console.log(`dist/${page}  ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
}
