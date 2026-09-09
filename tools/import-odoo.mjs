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
  '.o_knowledge_sidebar_container',
  '.o_menu_systray', '.o_main_navbar', '.breadcrumb', '.o_control_panel',
  '[role="navigation"]', '[role="toolbar"]',
  // Sommaire interne d'Odoo : Starlight en genere deja un dans la colonne de
  // droite. Le garder ferait doublon, et la conversion l'aplatit de toute
  // facon en un pave de titres colles les uns aux autres.
  '[data-embedded="tableOfContent"]',
  // Index d'articles : de la navigation entre articles voisins, que la barre
  // laterale assure deja. La conversion n'en gardait que des libelles a puces,
  // meme plus cliquables.
  '[data-embedded="articleIndex"]',
];

// NE JAMAIS ajouter [contenteditable="false"] a la liste ci-dessus. Odoo rend
// un bloc de code sous la forme :
//
//   <pre data-language-id="json">
//     <owl-root contenteditable="false">…le code…</owl-root>
//   </pre>
//
// Le selecteur visait la barre laterale, mais il vidait aussi tous les blocs
// de code : le <pre> survivait, sans son contenu. La barre laterale est
// desormais ciblee par son propre nom de classe.

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

// Blocs de code. turndown ne sait cloturer qu'un <pre><code>, alors qu'Odoo
// emet un <pre> dont le contenu est enfoui sous des <span> de coloration
// syntaxique. On prend donc le texte brut, et le langage depuis l'attribut.
turndown.addRule('bloc-de-code-odoo', {
  filter: (node) => node.nodeName === 'PRE',
  replacement: (_content, node) => {
    const langue = (node.getAttribute('data-language-id') || '').toLowerCase();

    // Odoo encode les retours a la ligne par des <br>, que textContent ignore :
    // sans cette conversion, un JSON indente ressort aplati sur une ligne.
    const tampon = doc.createElement('div');
    tampon.innerHTML = node.innerHTML.replace(/<br\s*\/?>/gi, '\n');

    const code = tampon.textContent.replace(/^\n+/, '').replace(/\s+$/, '');
    if (!code.trim()) return '';
    return `\n\n\`\`\`${langue === 'plaintext' ? '' : langue}\n${code}\n\`\`\`\n\n`;
  },
});

// Encadres d'Odoo (« bannieres »). Ils portent une icone dans un conteneur et
// leur texte dans un autre. Sans regle dediee, l'icone ressortait en emoji
// isole et le texte se fondait dans les paragraphes voisins : l'encadre
// disparaissait en tant que tel, alors que c'est justement sa mise a l'ecart
// qui porte le sens. Ils deviennent des encadres Starlight.
turndown.addRule('encadre-odoo', {
  filter: (node) =>
    node.nodeType === 1 &&
    (node.getAttribute('class') || '').includes('o_editor_banner'),
  replacement: (_content, node) => {
    const classes = node.getAttribute('class') || '';
    const type = classes.includes('alert-danger')
      ? 'danger'
      : classes.includes('alert-warning')
        ? 'caution'
        : 'tip'; // alert-info et alert-success
    const corps = node.querySelector('.o_editor_banner_content');
    const texte = corps ? turndown.turndown(corps.innerHTML).trim() : '';
    if (!texte) return '';
    return `\n\n:::${type}\n${texte}\n:::\n\n`;
  },
});

// Video : l'iframe est retire avec le reste du mobilier, la video disparaissait
// donc sans laisser de trace. On la remet sous forme de lien — un lien ne
// depose pas de traceur tiers sur la documentation, contrairement a un embed.
turndown.addRule('video-odoo', {
  filter: (node) =>
    node.nodeType === 1 && node.getAttribute && node.getAttribute('data-embedded') === 'video',
  replacement: (_content, node) => {
    let props = {};
    try {
      props = JSON.parse(node.getAttribute('data-embedded-props') || '{}');
    } catch {
      /* props illisibles : on laisse le lien generique */
    }
    if (props.platform === 'youtube' && props.videoId) {
      return `\n\n[Voir la vidéo](https://www.youtube.com/watch?v=${props.videoId})\n\n`;
    }
    return '\n\n<!-- VIDEO A REPRENDRE : source non reconnue -->\n\n';
  },
});

// Blocs depliants d'Odoo — deux variantes, meme structure : titre et contenu
// dans deux conteneurs distincts. Ils deviennent des <details>.
turndown.addRule('bloc-depliant-odoo', {
  filter: (node) =>
    node.nodeType === 1 &&
    node.getAttribute &&
    ['toggleBlock', 'foldableSection'].includes(node.getAttribute('data-embedded')),
  replacement: (_content, node) => {
    const titre = node.querySelector('[data-embedded-editable="title"]');
    const corps = node.querySelector('[data-embedded-editable="content"]');
    const t = titre ? titre.textContent.trim().replace(/\s+/g, ' ') : 'Détails';
    const c = corps ? turndown.turndown(corps.innerHTML).trim() : '';
    if (!c) return '';
    return `\n\n<details>\n<summary>${t}</summary>\n\n${c}\n\n</details>\n\n`;
  },
});

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

// Odoo parseme ses articles de pictogrammes decoratifs, seuls sur leur ligne.
// Le tri se fait ligne par ligne : une expression multiligne sur le document
// entier se prend les pieds dans le tapis et recolle l'emoji a la ligne
// precedente — c'est arrive.
// La conversion enrobe parfois le pictogramme d'italiques ou de gras
// (« _💡_ ») : on retire ce vernis avant de juger la ligne.
// Structure des titres. Odoo laisse passer des sauts de niveau — un h2 suivi
// d'un h4 — qui cassent le sommaire, ainsi que des images enfermees dans un
// titre et une numerotation echappee par la conversion. On remet tout d'aplomb
// en une passe, ligne a ligne, en ignorant l'interieur des blocs de code.
{
  const lignes = markdown.split('\n');
  const sortie = [];
  let precedent = 1; // le titre de la page tient lieu de h1
  let dansCode = false;

  for (const l of lignes) {
    if (/^```/.test(l)) dansCode = !dansCode;
    const m = dansCode ? null : l.match(/^(#{2,6}) (.+)$/);
    if (!m) {
      sortie.push(l);
      continue;
    }

    let niveau = m[1].length;
    let texte = m[2];

    if (/^!\[[^\]]*\]\([^)]*\)$/.test(texte)) {
      sortie.push(texte); // une image seule n'est pas un titre
      continue;
    }

    texte = texte.replace(/^(\d+)\\\./, '$1.').replace(/^\*\*(.+?)\*\*$/, '$1');

    if (niveau > precedent + 1) niveau = precedent + 1;
    precedent = niveau;
    sortie.push('#'.repeat(niveau) + ' ' + texte);
  }

  markdown = sortie.join('\n');
}

const EMOJI_SEUL = /^[\s\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]+$/u;
const denuder = (l) => l.replace(/[*_~`]/g, '').trim();
let emojisRetires = 0;
markdown = markdown
  .split('\n')
  .filter((l) => {
    const nu = denuder(l);
    if (nu !== '' && EMOJI_SEUL.test(nu)) {
      emojisRetires++;
      return false;
    }
    return true;
  })
  .join('\n')
  .replace(/\n{3,}/g, '\n\n');

/* ------------------------------------------------------------------ */
/* Ecriture                                                            */
/* ------------------------------------------------------------------ */

const yaml = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const ordre = flag('ordre');

const frontmatter = [
  '---',
  `title: ${yaml(title)}`,
  // Description entre guillemets des le depart : une description contenant
  // « : » suivi d'une espace casse le parseur YAML si elle est nue, et le
  // message d'erreur (« bad indentation of a mapping entry ») ne designe pas
  // le coupable. En laissant les guillemets, la rediger reste sans danger.
  `description: ${yaml('TODO — une phrase, reprise par la recherche et les moteurs.')}`,
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
if (emojisRetires) {
  console.log(`  Emojis ${emojisRetires} pictogramme(s) decoratif(s) isole(s) retire(s)`);
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
