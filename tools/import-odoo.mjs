// Importe un article Odoo Knowledge (sauvegarde en HTML depuis le navigateur)
// vers une page Markdown Starlight, images comprises.
//
//   node tools/import-odoo.mjs <fichier.html> <dossier-cible> [options]
//
// A lancer avec « node », PAS avec « npm run » : npm interprete les options
// inconnues comme sa propre configuration et les avale silencieusement — les
// --slug et --ordre n'arriveraient jamais jusqu'ici.
//
// Options :
//   --slug <nom>        nom du fichier .md produit (defaut : deduit du titre)
//   --titre "<texte>"   force le titre (defaut : premier <h1> du document)
//   --ordre <n>         valeur de sidebar.order
//   --selecteur "<css>" conteneur de l'article, si l'auto-detection se trompe
//   --force             ecrase une page existante
//
// Voir la section « Reprise du contenu Odoo » du README.

import fs from 'node:fs';
import path from 'node:path';
import domino from '@mixmark-io/domino';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/* ------------------------------------------------------------------ */
/* Arguments                                                           */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);
const positionals = argv.filter((a, i) => {
  if (a.startsWith('--')) return false;
  const prev = argv[i - 1];
  // Ignore la valeur qui suit une option a argument.
  return !['--slug', '--titre', '--ordre', '--selecteur'].includes(prev);
});

const [source, target] = positionals;

if (!source || !target) {
  console.error(`
Usage : node tools/import-odoo.mjs <fichier.html> <dossier-cible> [options]

Exemple :
  node tools/import-odoo.mjs "C:/Users/moi/Downloads/OPC-UA.html" src/content/docs/protocols --slug opc-ua --ordre 3

Options : --slug, --titre, --ordre, --selecteur, --force

A lancer avec « node » et non « npm run » : npm avale les options inconnues.
`);
  process.exit(1);
}

if (!fs.existsSync(source)) {
  console.error(`Fichier introuvable : ${source}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'page';

/** Elements d'interface Odoo qui n'ont rien a faire dans la doc. */
const CHROME = [
  'script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside', 'iframe',
  'button', 'form', 'svg',
  '.o_knowledge_header', '.o_knowledge_toolbar', '.o_knowledge_comments_panel',
  '.o_menu_systray', '.o_main_navbar', '.breadcrumb', '.o_control_panel',
  '[role="navigation"]', '[role="toolbar"]', '[contenteditable="false"]',
];

/** Conteneurs probables d'un article Odoo Knowledge, du plus precis au moins. */
const CANDIDATES = [
  '.o_knowledge_article_content', '.o_knowledge_body', '.o_readonly',
  'article', 'main', '[role="main"]', '.o_content', 'body',
];

/* ------------------------------------------------------------------ */
/* Lecture et nettoyage du HTML                                        */
/* ------------------------------------------------------------------ */

const html = fs.readFileSync(source, 'utf8');
const doc = domino.createWindow(html).document;

for (const sel of CHROME) {
  // domino renvoie un NodeList non iterable : Array.from est necessaire.
  for (const el of Array.from(doc.querySelectorAll(sel))) el.remove();
}

let root = null;
const forced = flag('selecteur');
if (forced) {
  root = doc.querySelector(forced);
  if (!root) {
    console.error(`Selecteur sans correspondance : ${forced}`);
    process.exit(1);
  }
} else {
  // On garde le candidat qui porte le plus de texte : sur une page Odoo
  // complete, c'est l'article et non la coquille de l'application.
  let best = null;
  let bestLen = 0;
  for (const sel of CANDIDATES) {
    for (const el of Array.from(doc.querySelectorAll(sel))) {
      const len = (el.textContent || '').trim().length;
      if (len > bestLen) {
        best = el;
        bestLen = len;
      }
    }
  }
  root = best || doc.body;
}

/* ------------------------------------------------------------------ */
/* Titre                                                               */
/* ------------------------------------------------------------------ */

let title = flag('titre');
if (!title) {
  const h1 = root.querySelector('h1');
  title = h1 ? h1.textContent.trim() : path.basename(source, path.extname(source));
}
// Starlight affiche deja le titre depuis le frontmatter : on evite le doublon.
const firstH1 = root.querySelector('h1');
if (firstH1 && firstH1.textContent.trim() === title) firstH1.remove();

// Odoo laisse volontiers des <h1> pour decouper l'article. Or Starlight rend
// deja le titre en <h1>, et son sommaire ne liste que les niveaux 2 et 3 : des
// sections en <h1> donneraient une page a plusieurs <h1> et un sommaire vide.
// On redescend donc toute la hierarchie d'un cran, en partant du bas pour ne
// pas ecraser un niveau au passage.
let demoted = 0;
if (root.querySelector('h1')) {
  for (let level = 5; level >= 1; level--) {
    for (const el of Array.from(root.querySelectorAll(`h${level}`))) {
      const replacement = doc.createElement(`h${level + 1}`);
      for (const attr of Array.from(el.attributes)) {
        replacement.setAttribute(attr.name, attr.value);
      }
      while (el.firstChild) replacement.appendChild(el.firstChild);
      el.parentNode.replaceChild(replacement, el);
      demoted++;
    }
  }
}

const slug = flag('slug') ? slugify(flag('slug')) : slugify(title);

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

const targetDir = path.resolve(target);
fs.mkdirSync(targetDir, { recursive: true });

// Verifie AVANT de copier quoi que ce soit : sinon un import refuse laisserait
// derriere lui les images d'une page qu'il n'a pas ecrite.
const outFile = path.join(targetDir, `${slug}.md`);
if (fs.existsSync(outFile) && !has('force')) {
  console.error(`\nExiste deja : ${path.relative(process.cwd(), outFile)}`);
  console.error('Relancez avec --force pour ecraser.');
  process.exit(1);
}

const sourceDir = path.dirname(path.resolve(source));
const copied = [];
const remote = [];
const missing = [];
let n = 0;

for (const img of Array.from(root.querySelectorAll('img'))) {
  const src = img.getAttribute('src') || '';
  if (!src) {
    img.remove();
    continue;
  }

  // Image embarquee en base64 : on la reconstitue en fichier.
  const dataMatch = src.match(/^data:image\/([a-z+]+);base64,(.+)$/i);
  if (dataMatch) {
    const ext = dataMatch[1].toLowerCase().replace('jpeg', 'jpg').replace('svg+xml', 'svg');
    const name = `${slug}-${++n}.${ext}`;
    fs.writeFileSync(path.join(targetDir, name), Buffer.from(dataMatch[2], 'base64'));
    img.setAttribute('src', `./${name}`);
    copied.push(name);
    continue;
  }

  if (/^https?:\/\//i.test(src)) {
    remote.push(src);
    continue; // laisse l'URL telle quelle : a recuperer a la main
  }

  // Chemin local, typiquement le dossier « _files » produit par Ctrl+S.
  // Les navigateurs ne s'accordent pas sur l'encodage du nom de fichier :
  // Chrome ecrit « image 123.png » et reference « image%20123.png », d'autres
  // gardent la forme encodee. On essaie les deux.
  const raw = src.split('?')[0];
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* sequence d'echappement invalide : on garde la forme brute */
  }
  const abs = [decoded, raw]
    .map((c) => path.resolve(sourceDir, c))
    .find((c) => fs.existsSync(c));
  if (!abs) {
    missing.push(src);
    continue;
  }
  let ext = path.extname(abs).toLowerCase() || '.png';
  if (ext === '.jpeg') ext = '.jpg';
  const name = `${slug}-${++n}${ext}`;
  fs.copyFileSync(abs, path.join(targetDir, name));
  img.setAttribute('src', `./${name}`);
  copied.push(name);
}

/* ------------------------------------------------------------------ */
/* Conversion                                                          */
/* ------------------------------------------------------------------ */

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);

// Les liens Odoo internes ne veulent plus rien dire une fois sortis d'Odoo.
turndown.addRule('liens-odoo', {
  filter: (node) =>
    node.nodeName === 'A' && /odoo\.com\/knowledge|\/knowledge\/article/.test(node.getAttribute('href') || ''),
  replacement: (content) => content,
});

let markdown = turndown.turndown(root.innerHTML);

markdown = markdown
  // turndown aligne les puces sur trois espaces ; on resserre.
  .replace(/^(\s*)-\s{2,}/gm, '$1- ')
  .replace(/\n{3,}/g, '\n\n')
  .replace(/[ \t]+$/gm, '')
  .trim();

/* ------------------------------------------------------------------ */
/* Ecriture                                                            */
/* ------------------------------------------------------------------ */

const yaml = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const ordre = flag('ordre');

const frontmatter = [
  '---',
  `title: ${yaml(title)}`,
  'description: TODO — une phrase, reprise par la recherche et les moteurs.',
  ...(ordre ? ['sidebar:', `  order: ${ordre}`] : []),
  '---',
  '',
  '',
].join('\n');

fs.writeFileSync(outFile, frontmatter + markdown + '\n', 'utf8');

/* ------------------------------------------------------------------ */
/* Rapport                                                             */
/* ------------------------------------------------------------------ */

const rel = (p) => path.relative(process.cwd(), p).replace(/\\/g, '/');

console.log(`\n  Page   ${rel(outFile)}`);
console.log(`  Titre  ${title}`);
console.log(`  Images ${copied.length} copiee(s)${copied.length ? ' : ' + copied.join(', ') : ''}`);
if (demoted) {
  console.log(`  Titres ${demoted} niveau(x) redescendu(s) d'un cran (l'article decoupait en <h1>)`);
}

const todo = [];
if (!ordre) todo.push('Ajouter sidebar.order pour fixer la position dans le menu.');
todo.push('Remplacer la description « TODO ».');
if (/\|.*\|/.test(markdown)) todo.push('Relire les tableaux : c\'est ce que la conversion rend le moins bien.');
if (copied.length) todo.push('Verifier les textes alternatifs des images (accessibilite et SEO).');
if (remote.length) {
  todo.push(
    `${remote.length} image(s) encore sur une URL distante, a telecharger a la main :\n       ` +
      remote.slice(0, 5).join('\n       ')
  );
}
if (missing.length) {
  todo.push(
    `${missing.length} image(s) introuvable(s) en local — la page a-t-elle ete enregistree en « page complete » ?\n       ` +
      missing.slice(0, 5).join('\n       ')
  );
}
todo.push(`Creer la version anglaise au meme chemin sous src/content/docs/en/.`);

console.log('\n  A faire :');
for (const t of todo) console.log(`    - ${t}`);
console.log('');
