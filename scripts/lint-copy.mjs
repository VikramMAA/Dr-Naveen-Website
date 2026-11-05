#!/usr/bin/env node
// Scans content and page source for banned punctuation and marketing words
// per brief section 3.8 and 3.9. Fails the build if any are found.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const roots = ["src/content", "src/pages", "src/components", "src/layouts"];
const extensions = new Set([".astro", ".md", ".mdx", ".ts", ".tsx"]);

const bannedPunctuation = [
  { char: "—", name: "em dash" },
  { char: "–", name: "en dash" },
];

const bannedWords = [
  "best",
  "top",
  "leading",
  "no. 1",
  "no.1",
  "expert in",
  "renowned",
  "world-class",
  "painless",
  "guaranteed",
  "in today's fast-paced world",
  "your journey",
  "holistic",
  "cutting-edge",
  "state-of-the-art",
  "seamless",
  "empower",
  "unlock",
  "delve",
];

function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      walk(full, files);
    } else if (extensions.has(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

// Strip code-only regions (CSS, JS, frontmatter) so property names like
// "top" or "left" in <style>/<script>/frontmatter blocks are not mistaken
// for copy. Blank out their content but keep line numbers stable.
function blankOutBlock(content, openTag, closeTag) {
  let result = "";
  let rest = content;
  while (true) {
    const openIndex = rest.indexOf(openTag);
    if (openIndex === -1) {
      result += rest;
      break;
    }
    const closeIndex = rest.indexOf(closeTag, openIndex + openTag.length);
    if (closeIndex === -1) {
      result += rest;
      break;
    }
    const before = rest.slice(0, openIndex + openTag.length);
    const block = rest.slice(openIndex + openTag.length, closeIndex);
    const blanked = block.replace(/[^\n]/g, " ");
    result += before + blanked;
    rest = rest.slice(closeIndex);
  }
  return result;
}

function stripCode(content, file) {
  let stripped = content;
  if (extname(file) === ".astro") {
    // Astro frontmatter: a leading "---" block.
    const frontmatterMatch = stripped.match(/^---[\s\S]*?\n---/);
    if (frontmatterMatch) {
      const blanked = frontmatterMatch[0].replace(/[^\n]/g, " ");
      stripped = blanked + stripped.slice(frontmatterMatch[0].length);
    }
    stripped = blankOutBlock(stripped, "<style", "</style>");
    stripped = blankOutBlock(stripped, "<script", "</script>");
  }
  return stripped;
}

function wordBoundaryIncludes(line, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  return pattern.test(line);
}

let failures = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const raw = readFileSync(file, "utf8");
    const content = stripCode(raw, file);
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Skip inline style="" / style={``} attributes: CSS property names
      // like "top" or "left" are not page copy.
      if (/\bstyle\s*=\s*[{"'`]/.test(line)) return;

      for (const { char, name } of bannedPunctuation) {
        if (line.includes(char)) {
          failures.push(`${file}:${index + 1}: contains ${name} (${char})`);
        }
      }

      for (const word of bannedWords) {
        if (wordBoundaryIncludes(line, word)) {
          failures.push(`${file}:${index + 1}: contains banned word/phrase "${word}"`);
        }
      }
    });
  }
}

if (failures.length > 0) {
  console.error(`lint:copy found ${failures.length} issue(s):\n`);
  failures.forEach((failure) => console.error(" - " + failure));
  process.exit(1);
}

console.log("lint:copy: no banned punctuation or words found.");
