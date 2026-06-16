const content = require('fs').readFileSync('c:/Users/u/Downloads/New webs/my-site/lib/ad-logic.ts', 'utf8');

const namesMatch = content.match(/export const names = \[([\s\S]*?)\];/);
const names = namesMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => s !== "");

function getHash(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getNameFromId(seed) {
  const hash = getHash(seed);
  return names[hash % names.length];
}

['bharuch-0', 'bharuch-1', 'bharuch-2', 'bharuch-3'].forEach(id => {
    console.log(`${id} -> ${getNameFromId(id)}`);
});
