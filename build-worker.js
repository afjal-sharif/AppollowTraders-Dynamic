// This script combines DEPLOY-worker.js + dist/index.html into a final FINAL-worker.js
// Run: node build-worker.js

const fs = require('fs');

// Read files
const workerCode = fs.readFileSync('DEPLOY-worker.js', 'utf-8');
const htmlContent = fs.readFileSync('dist/index.html', 'utf-8');

// Escape the HTML for embedding inside a JS template literal (backtick string)
const escapedHtml = htmlContent
  .replace(/\\/g, '\\\\')       // escape backslashes first
  .replace(/`/g, '\\`')        // escape backticks
  .replace(/\$\{/g, '\\${');   // escape template literal expressions

// Replace the placeholder
const finalWorker = workerCode.replace('PASTE_DIST_INDEX_HTML_HERE', escapedHtml);

// Write output
fs.writeFileSync('FINAL-worker.js', finalWorker, 'utf-8');

const sizeKB = (Buffer.byteLength(finalWorker, 'utf-8') / 1024).toFixed(1);
console.log(`✅ FINAL-worker.js created successfully! (${sizeKB} KB)`);
console.log('📋 Copy the entire content of FINAL-worker.js and paste into Cloudflare Worker editor.');
