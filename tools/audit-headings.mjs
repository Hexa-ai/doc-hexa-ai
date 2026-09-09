// Detecte les sauts de niveau de titre : un ### suivi d'un #####, ou un titre
// qui descend de plus d'un cran. Odoo laisse passer ces incoherences, elles
// cassent le sommaire et la structure du document.

import fs from 'node:fs';
import path from 'node:path';

const R = 'src/content/docs';
let total = 0;

function parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      parcourir(p);
      continue;
    }
    if (!/\.mdx?$/.test(e.name)) continue;

    const lignes = fs.readFileSync(p, 'utf8').split('\n');
    let precedent = 1; // le titre de la page tient lieu de <h1>
    let dansCode = false;
    const soucis = [];

    lignes.forEach((l, i) => {
      if (/^```/.test(l)) dansCode = !dansCode;
      if (dansCode) return;
      const m = l.match(/^(#{2,6}) (.+)$/);
      if (!m) return;
      const niveau = m[1].length;
      if (niveau > precedent + 1) {
        soucis.push(`ligne ${i + 1} : h${niveau} après h${precedent} — « ${m[2].slice(0, 60)} »`);
      }
      precedent = niveau;
    });

    if (soucis.length) {
      console.log(p.split(path.sep).join('/'));
      soucis.forEach((s) => console.log('   ' + s));
      total += soucis.length;
    }
  }
}

parcourir(R);
console.log('\nsauts de niveau :', total);
