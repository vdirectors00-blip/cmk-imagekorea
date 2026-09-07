/* Fetch latest Naver blog posts into assets/blog.json.
   Runs in GitHub Actions (Node 20+) on a schedule; no external deps.
   Browsers can't fetch Naver RSS directly (CORS), so we snapshot it here. */
const fs = require('fs');
const path = require('path');

const RSS = 'https://rss.blog.naver.com/cmkimage.xml';
const OUT = path.join(process.cwd(), 'assets', 'blog.json');
const N = 6;

function strip(s) {
  return (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '\\b[^>]*>([\\s\\S]*?)<\\/' + name + '>'));
  return m ? m[1] : '';
}
function fmtDate(s) {
  const d = new Date(s);
  if (isNaN(d)) return '';
  return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}
function thumbOf(b) {
  let t = strip(tag(b, 'img'));
  if (t && /^https?:/.test(t)) return t;
  let m = b.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m) return m[1];
  m = b.match(/https?:\/\/[^"'\s<>]+\.(?:jpg|jpeg|png)/i);
  return m ? m[0] : '';
}

(async () => {
  const res = await fetch(RSS, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; cmk-blog-bot)' } });
  if (!res.ok) throw new Error('RSS HTTP ' + res.status);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  const posts = [];
  for (const b of items) {
    const title = strip(tag(b, 'title'));
    const link = strip(tag(b, 'link'));
    if (!title || !link) continue;
    posts.push({
      title,
      link,
      date: fmtDate(strip(tag(b, 'pubDate'))),
      category: strip(tag(b, 'category')),
      thumb: thumbOf(b),
    });
    if (posts.length >= N) break;
  }
  if (!posts.length) throw new Error('no posts parsed');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), posts }, null, 2));
  console.log('wrote ' + OUT + ' with ' + posts.length + ' posts');
})().catch(e => { console.error(e); process.exit(1); });
