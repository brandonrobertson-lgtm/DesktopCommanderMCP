const fs = require('fs');
const path = require('path');

const roots = [];
if (process.env.LOCALAPPDATA) roots.push(path.join(process.env.LOCALAPPDATA, 'Programs'));
if (process.env.ProgramFiles) roots.push(process.env.ProgramFiles);
if (process.env['ProgramFiles(x86)']) roots.push(process.env['ProgramFiles(x86)']);

function find(root, depth) {
  if (!root || !fs.existsSync(root)) return null;
  let entries;
  try {
    entries = fs.readdirSync(root);
  } catch (e) {
    return null;
  }
  for (const ent of entries) {
    const p = path.join(root, ent);
    let stat;
    try { stat = fs.statSync(p); } catch (e) { continue; }
    if (stat.isFile() && ent.toLowerCase() === 'claude.exe') return p;
    if (stat.isDirectory() && depth > 0) {
      const r = find(p, depth - 1);
      if (r) return r;
    }
  }
  return null;
}

for (const r of roots) {
  const found = find(r, 4);
  if (found) {
    console.log(found);
    process.exit(0);
  }
}
console.log('NONE');
