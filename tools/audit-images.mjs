// Detaille, pour une source Odoo, les images vues dans l'article et celles
// effectivement reprises dans le Markdown.

import fs from 'node:fs';
import domino from '@mixmark-io/domino';

const [source, page] = process.argv.slice(2);
if (!source || !page) {
  console.error('usage : node tools/audit-images.mjs <source.html> <page.md>');
  process.exit(1);
}

const CHROME = [
  'script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside', 'iframe',
  'button', 'form', 'svg',
  '.o_knowledge_header', '.o_knowledge_toolbar', '.o_knowledge_comments_panel',
  '.o_knowledge_sidebar_container', '.o_menu_systray', '.o_main_navbar',
  '.breadcrumb', '.o_control_panel', '[role="navigation"]', '[role="toolbar"]',
  '[data-embedded="tableOfContent"]', '[data-embedded="articleIndex"]',
];
const CANDIDATES = ['.o_knowledge_article_content', '.o_knowledge_body', '.o_readonly', 'article', 'main', '[role="main"]', '.o_content', 'body'];

const doc = domino.createWindow(fs.readFileSync(source, 'utf8')).document;
for (const sel of CHROME) for (const el of Array.from(doc.querySelectorAll(sel))) el.remove();

let root = null, len = 0;
for (const sel of CANDIDATES) {
  for (const el of Array.from(doc.querySelectorAll(sel))) {
    const l = (el.textContent || '').trim().length;
    if (l > len) { root = el; len = l; }
  }
}

const md = fs.readFileSync(page, 'utf8');
const reprises = (md.match(/!\[[^\]]*\]\(([^)]*)\)/g) || []).length;

console.log(`images dans l'article : ${root.querySelectorAll('img').length}`);
console.log(`images dans la page   : ${reprises}`);
console.log('\ndetail :');
for (const img of Array.from(root.querySelectorAll('img'))) {
  const src = img.getAttribute('src') || '(sans src)';
  const court = src.startsWith('data:') ? `data: (${src.length} car.)` : src;
  // Un parent depliant ou encadre explique parfois l'absence.
  const parents = [];
  let e = img.parentElement;
  while (e && e !== root) {
    const emb = e.getAttribute && e.getAttribute('data-embedded');
    const cl = (e.getAttribute && e.getAttribute('class')) || '';
    if (emb) parents.push(`data-embedded=${emb}`);
    else if (cl.includes('o_editor_banner')) parents.push('encadré');
    e = e.parentElement;
  }
  console.log(`  ${court}${parents.length ? '   [dans ' + [...new Set(parents)].join(' > ') + ']' : ''}`);
}
