const fs = require('fs');
const path = require('path');
const { saveSemanticCache, validateSemanticFragment, sanitizeSemanticFragment } = require('@sentropic/graphify');

// Read the two chunk files
const chunk1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'chunk1.json'), 'utf-8'));
const chunk2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'chunk2.json'), 'utf-8'));

// Read cached
const cachedPath = path.join(__dirname, '.graphify_cached.json');
const cached = fs.existsSync(cachedPath) ? JSON.parse(fs.readFileSync(cachedPath, 'utf-8')) : {nodes:[],edges:[],hyperedges:[]};

// Combine new
const newData = {
  nodes: [...(chunk1.nodes||[]), ...(chunk2.nodes||[])],
  edges: [...(chunk1.edges||[]), ...(chunk2.edges||[])],
  hyperedges: [...(chunk1.hyperedges||[]), ...(chunk2.hyperedges||[])],
};

// Validate new
const errors = validateSemanticFragment(newData);
if (errors.length > 0) {
  console.error('Validation errors:', errors.slice(0, 3));
  process.exit(1);
}

const clean = sanitizeSemanticFragment(newData);
const saved = saveSemanticCache(clean.nodes, clean.edges, clean.hyperedges);
console.log('Cached ' + saved + ' files');

// Merge all
const allNodes = [...(cached.nodes||[]), ...(clean.nodes||[])];
const allEdges = [...(cached.edges||[]), ...(clean.edges||[])];
const allHyperedges = [...(cached.hyperedges||[]), ...(clean.hyperedges||[])];

const seen = new Set();
const deduped = [];
for (const n of allNodes) {
  if (!seen.has(n.id)) { seen.add(n.id); deduped.push(n); }
}

const merged = {
  nodes: deduped,
  edges: allEdges,
  hyperedges: allHyperedges,
  input_tokens: 0,
  output_tokens: 0,
};

fs.writeFileSync(path.join(__dirname, '.graphify_semantic.json'), JSON.stringify(merged, null, 2));
console.log('Semantic complete: ' + deduped.length + ' nodes, ' + allEdges.length + ' edges (' +
  (cached.nodes?.length||0) + ' from cache, ' + clean.nodes.length + ' new)');

// Cleanup temp files
for (const f of ['.graphify_cached.json', '.graphify_uncached.txt', '.graphify_detect_semantic.json', '.graphify_transcripts.json', '.graphify_pdf_ocr.json', 'chunk1.json', 'chunk2.json', 'merge-semantic.js']) {
  const fp = path.join(__dirname, f);
  if (fs.existsSync(fp) && fp !== __filename) try { fs.unlinkSync(fp); } catch {}
}
