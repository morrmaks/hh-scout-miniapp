import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

async function syncOpenApi() {
  const GIST_ID = process.env.GIST_ID;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GIST_ID || !GITHUB_TOKEN) {
    console.error('Missing GIST_ID or GITHUB_TOKEN in .env');
    process.exit(1);
  }

  const content = fs.readFileSync(path.join(__dirname, '../api/openapi.json'), 'utf-8');

  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: { 'openapi.json': { content } }
    })
  });

  if (!res.ok) {
    console.error('Failed:', res.status, await res.text());
    process.exit(1);
  }

  console.log('✓ openapi.json synced to gist');
}

syncOpenApi();
