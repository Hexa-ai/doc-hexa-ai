// Audit de completude : pour chaque source Odoo, verifie que chaque bloc de
// texte se retrouve dans le Markdown produit. Signale ce qui manque.

import fs from 'node:fs';
import domino from '@mixmark-io/domino';

const DL = 'C:/Users/Theo user/Downloads/';
const R = 'src/content/docs/';

const PAIRES = [
  ['acquisition.html', 'acquisition/configuration.md'],
  ['alarmes.html', 'monitoring/alarms.md'],
  ['api.html', 'integration/mqtt-api.md'],
  ['guest.html', 'network/guest-access.md'],
  ['hotspot.html', 'network/wifi-hotspot.md'],
  ['nodered.html', 'integration/node-red.md'],
  ['notifications.html', 'alerts/notifications.md'],
  ['pdf.html', 'alerts/pdf-reports.md'],
  ['reset.html', 'system/reset.md'],
  ['securite.html', 'system/security.md'],
  ['vpn.html', 'network/tailscale-vpn.md'],
  ['webhooks.html', 'integration/webhooks.md'],
  ['dataplug.html', 'acquisition/data-plug.md'],
  ['sms.html', 'alerts/sms.md'],
  ['storeAndForword.html', 'integration/store-and-forward.md'],
  ['batches.html', 'monitoring/batches.md'],
  ['dataexplorer.html', 'monitoring/data-explorer.md'],
  ['connexion.html', 'getting-started/first-connection.md'],
];

const CHROME = [
  'script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside', 'iframe',
  'button', 'form', 'svg',
  '.o_knowledge_header', '.o_knowledge_toolbar', '.o_knowledge_comments_panel',
  '.o_knowledge_sidebar_container', '.o_menu_systray', '.o_main_navbar',
  '.breadcrumb', '.o_control_panel', '[role="navigation"]', '[role="toolbar"]',
  '[data-embedded="tableOfContent"]', '[data-embedded="articleIndex"]',
];

const CANDIDATES = ['.o_knowledge_article_content', '.o_knowledge_body', '.o_readonly', 'article', 'main', '[role="main"]', '.o_content', 'body'];

const normaliser = (s) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .toLowerCase().trim();

let totalManquants = 0;

for (const [src, md] of PAIRES) {
  if (!fs.existsSync(DL + src) || !fs.existsSync(R + md)) {
    console.log(`  (source ou page absente : ${src})`);
    continue;
  }

  const doc = domino.createWindow(fs.readFileSync(DL + src, 'utf8')).document;
  for (const sel of CHROME) for (const el of Array.from(doc.querySelectorAll(sel))) el.remove();

  let root = null, len = 0;
  for (const sel of CANDIDATES) {
    for (const el of Array.from(doc.querySelectorAll(sel))) {
      const l = (el.textContent || '').trim().length;
      if (l > len) { root = el; len = l; }
    }
  }
  if (!root) continue;

  // Un lien Markdown [texte](url) doit etre reduit a son texte, sinon l URL
  // s intercale au milieu de la phrase et fausse la comparaison.
  const brutMd = fs.readFileSync(R + md, 'utf8').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  const cible = normaliser(brutMd);
  const manquants = [];

  for (const el of Array.from(root.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, td, th'))) {
    if (el.querySelector('p, li, td, th')) continue; // on ne compte que les feuilles
    const brut = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (brut.length < 45) continue;
    const n = normaliser(brut);
    if (!n) continue;
    // Un fragment long suffit : la conversion peut inserer du balisage.
    const extrait = n.split(' ').slice(0, 9).join(' ');
    if (extrait.length > 25 && !cible.includes(extrait)) manquants.push(brut.slice(0, 110));
  }

  // Les <img> sans src sont des balises vides laissees par l enregistrement
  // du navigateur : elles ne portent aucun contenu.
  const imgSource = Array.from(root.querySelectorAll('img')).filter((i) => i.getAttribute('src')).length;
  const imgMd = (fs.readFileSync(R + md, 'utf8').match(/!\[[^\]]*\]\(/g) || []).length;

  const alerte = manquants.length || imgSource !== imgMd;
  console.log(
    `${alerte ? '!' : ' '} ${md.padEnd(38)} images ${String(imgMd).padStart(2)}/${String(imgSource).padStart(2)}` +
      (manquants.length ? `  ${manquants.length} bloc(s) manquant(s)` : '')
  );
  for (const m of manquants.slice(0, 4)) console.log(`      « ${m} »`);
  totalManquants += manquants.length;
}

console.log('\nblocs de texte manquants au total :', totalManquants);
