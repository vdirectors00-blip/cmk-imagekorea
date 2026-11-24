/* Write the latest 3 posts from assets/blog.json into #blogGrid of index.html
   and eng/index.html as static HTML, so crawlers see them without running JS.
   The markup is the same string the in-page script builds, so when that script
   runs and replaces the grid, nothing on screen changes.
   Idempotent: running it twice on the same blog.json leaves the files unchanged. */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FILES = ['index.html', path.join('eng', 'index.html')];
const OPEN = /(<div id="blogGrid"[^>]*>)([\s\S]*?)(<\/div>\s*<div style="display:flex;justify-content:center;)/;

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function card(p) {
  const thumb = p.thumb
    ? '<div class="imgzoom" style="background:#ECEEF1;border-radius:6px;overflow:hidden;"><img src="' + esc(p.thumb) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.style.display=\'none\'" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform 1.3s cubic-bezier(.16,.72,.28,1),filter 1.3s ease;"></div>'
    : '';
  const cat = p.category
    ? '<div style="font-size:11px;font-weight:500;letter-spacing:.12em;color:#8A8276;margin:20px 0 8px;">' + esc(p.category) + '</div>'
    : '<div style="height:20px;"></div>';
  return '<a href="' + esc(p.link) + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:block;">' +
    thumb + cat +
    '<h3 style="font-weight:400;font-size:17px;line-height:1.5;color:#211C17;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + esc(p.title) + '</h3>' +
    '<div style="font-size:12px;color:#8A8276;margin-top:10px;">' + esc(p.date || '') + '</div></a>';
}

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'blog.json'), 'utf8'));
const posts = (data.posts || []).slice(0, 3);
const inner = posts.map(card).join('');

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  const src = fs.readFileSync(file, 'utf8');
  if (!OPEN.test(src)) throw new Error('#blogGrid not found in ' + rel);
  const out = src.replace(OPEN, (m, a, _old, c) => a + inner + c);
  if (out !== src) {
    fs.writeFileSync(file, out);
    console.log('updated ' + rel + ' (' + posts.length + ' posts)');
  } else {
    console.log('unchanged ' + rel);
  }
}
