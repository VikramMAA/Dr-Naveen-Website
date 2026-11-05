#!/usr/bin/env node
// Checks every internal link in the built site resolves to a real page.
// Run after `astro build`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const distDir = "dist";

if (!existsSync(distDir)) {
  console.error('test:links: "dist" not found. Run "npm run build" first.');
  process.exit(1);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) walk(full, files);
    else if (extname(full) === ".html") files.push(full);
  }
  return files;
}

function resolveTarget(href) {
  let path = href.split("#")[0].split("?")[0];
  if (path === "") return true;
  if (!path.startsWith("/")) return true; // relative links not checked here
  if (path.endsWith("/")) path += "index.html";
  else if (!path.includes(".")) path += "/index.html";
  return existsSync(join(distDir, path));
}

let failures = [];
const htmlFiles = walk(distDir);

for (const file of htmlFiles) {
  const content = readFileSync(file, "utf8");
  const hrefMatches = content.matchAll(/href="([^"]+)"/g);
  for (const match of hrefMatches) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (!resolveTarget(href)) {
      failures.push(`${file}: broken internal link "${href}"`);
    }
  }
}

if (failures.length > 0) {
  console.error(`test:links found ${failures.length} broken link(s):\n`);
  failures.forEach((failure) => console.error(" - " + failure));
  process.exit(1);
}

console.log(`test:links: checked ${htmlFiles.length} page(s), no broken internal links.`);
