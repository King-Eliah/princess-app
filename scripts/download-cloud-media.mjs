#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index !== -1 ? args[index + 1] : undefined;
};

const inputPath = getArg('--input') || getArg('-i');
const outputDir = getArg('--out') || getArg('-o') || path.resolve(process.cwd(), 'downloads');

if (!inputPath) {
  console.error('Usage: node scripts/download-cloud-media.mjs --input <media.json|urls.txt> [--out downloads]');
  process.exit(1);
}

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const safeName = (name) => name.replace(/[^a-z0-9._-]+/gi, '_');

const pickExtension = (contentType, fallbackUrl) => {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('mp4')) return 'mp4';
  if (ct.includes('quicktime') || ct.includes('mov')) return 'mov';
  if (ct.includes('webm')) return 'webm';

  const urlPath = new URL(fallbackUrl).pathname;
  const ext = path.extname(urlPath).replace('.', '');
  return ext || 'bin';
};

const readManifest = () => {
  const raw = readFileSync(inputPath, 'utf8').trim();
  if (!raw) return [];

  if (inputPath.toLowerCase().endsWith('.txt')) {
    return raw
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(uri => ({ uri }));
  }

  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return parsed.map(item =>
      typeof item === 'string'
        ? { uri: item }
        : item
    );
  }

  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.items)) return parsed.items;
    if (Array.isArray(parsed.memories)) return parsed.memories;
  }

  throw new Error('Unsupported JSON format. Provide an array of URLs/items, or a JSON object with items/memories arrays.');
};

const collectUrls = (items) => {
  const urls = [];
  for (const item of items) {
    if (!item) continue;
    if (typeof item === 'string') {
      urls.push(item);
      continue;
    }
    if (typeof item.uri === 'string') urls.push(item.uri);
    if (typeof item.localUri === 'string') urls.push(item.localUri);
    if (typeof item.thumbnailUri === 'string') urls.push(item.thumbnailUri);
  }
  return [...new Set(urls)].filter(uri => /^https?:\/\//i.test(uri));
};

const downloadOne = async (url, index) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const ext = pickExtension(contentType, url);
  const baseName = safeName(path.basename(new URL(url).pathname).split('?')[0] || `media_${index + 1}`);
  const fileName = `${String(index + 1).padStart(3, '0')}_${baseName}.${ext}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(outputDir, fileName);
  await writeFile(filePath, buffer);
  return filePath;
};

(async () => {
  const manifest = readManifest();
  const urls = collectUrls(manifest);

  if (urls.length === 0) {
    console.error('No http(s) media URLs found in the input file.');
    process.exit(1);
  }

  await mkdir(outputDir, { recursive: true });

  let successCount = 0;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const savedTo = await downloadOne(url, i);
      console.log(`Saved: ${savedTo}`);
      successCount += 1;
    } catch (error) {
      console.error(`Failed: ${url}\n  ${error.message}`);
    }
  }

  console.log(`Done. Downloaded ${successCount}/${urls.length} files to ${outputDir}`);
})();
