// Run this after build: node copy-dist.js
const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf-8');
fs.writeFileSync('BUILT-APP.html', html);
console.log('✅ Copied dist/index.html → BUILT-APP.html');
console.log(`📦 Size: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
