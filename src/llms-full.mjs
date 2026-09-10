// Fabrique le contenu de /llms-full.txt : toute la documentation d'une langue
// en un seul fichier Markdown, dans l'ordre du menu lateral.
//
// A quoi ca sert : un modele de langage qui doit repondre sur le produit
// charge ce fichier d'un coup plutot que de parcourir cinquante pages HTML,
// ou il devrait deviner ce qui est du contenu et ce qui est du gabarit.

import { getCollection } from 'astro:content';
import { SECTIONS, NOTES_DE_VERSION } from './sections.mjs';

const SITE = 'https://docs.hexa-ai.fr';

/** Tri : l'ordre du menu lateral, puis l'alphabet pour les ex aequo. */
function parOrdre(a, b) {
  const oa = a.data.sidebar?.order ?? 999;
  const ob = b.data.sidebar?.order ?? 999;
  return oa - ob || a.data.title.localeCompare(b.data.title);
}

/**
 * Les images ne peuvent pas suivre dans un fichier texte, mais leur texte
 * alternatif decrit ce qu'elles montrent — souvent un ecran de l'interface.
 * On le garde, en annoncant que c'etait une image ; le chemin, lui, ne veut
 * plus rien dire hors de la page.
 */
function remplacerImages(md) {
  return md.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_, alt) =>
    alt.trim() ? `[Image : ${alt.trim()}]` : ''
  );
}

/**
 * Descend d'un cran tous les titres du corps d'une page.
 *
 * Sans cela la hierarchie ment : le fichier ouvre une section en <h1> et
 * chaque page en <h2>, mais les pages commencent elles-memes leurs propres
 * titres en <h2>. « Prerequis » se retrouverait au meme niveau que la page
 * qui le contient. Ici <h2> devient <h3>, et ainsi de suite jusqu'a <h6>,
 * qui est le plancher.
 *
 * Les blocs de code sont laisses tranquilles : une ligne commencant par #
 * y est un commentaire de shell, pas un titre.
 */
function descendreTitres(md) {
  let dansUnBloc = false;
  return md
    .split('\n')
    .map((ligne) => {
      if (/^\s*(```|~~~)/.test(ligne)) {
        dansUnBloc = !dansUnBloc;
        return ligne;
      }
      if (dansUnBloc) return ligne;
      const m = ligne.match(/^(#{1,6}) (.*)$/);
      if (!m) return ligne;
      const niveau = Math.min(m[1].length + 1, 6);
      return `${'#'.repeat(niveau)} ${m[2]}`;
    })
    .join('\n');
}

/**
 * @param {'fr'|'en'} langue
 * @returns {Promise<string>} le fichier complet
 */
export async function construireLlmsFull(langue) {
  const prefixe = langue === 'en' ? 'en/' : '';
  const toutes = await getCollection('docs');

  const pages = toutes.filter((e) => {
    if (e.data.draft) return false;
    if (/^(en\/)?(index|404)$/.test(e.id)) return false;
    return langue === 'en' ? e.id.startsWith('en/') : !e.id.startsWith('en/');
  });

  const morceaux = [];

  // Pas de titre de niveau 1 en tete de fichier : les niveaux servent a la
  // structure. # = section, ## = page, ###+ = titres internes de la page,
  // decales d'un cran par descendreTitres().
  if (langue === 'en') {
    morceaux.push(
      '> HAI Docs — every page of the HAI-P200-4G / HAI-OS documentation, in one ' +
        'file, in the order of the site navigation. Published by Hexa-AI.'
    );
    morceaux.push('');
    morceaux.push(`Source: ${SITE}/en/ — index: ${SITE}/llms.txt`);
    morceaux.push('');
    morceaux.push(
      'Headings: # section, ## page, ### and below the page\'s own headings. ' +
        'Starlight directives (:::tip, :::caution, :::note) are kept as written.'
    );
  } else {
    morceaux.push(
      '> HAI Doc — toutes les pages de la documentation du HAI-P200-4G et de ' +
        "HAI-OS, en un seul fichier, dans l'ordre du menu. Editee par Hexa-AI."
    );
    morceaux.push('');
    morceaux.push(`Source : ${SITE}/ — sommaire : ${SITE}/llms.txt`);
    morceaux.push('');
    morceaux.push(
      'Niveaux de titre : # une section, ## une page, ### et au-dela les titres ' +
        'internes de la page. Les directives Starlight (:::tip, :::caution, ' +
        ':::note) sont conservees telles quelles.'
    );
  }
  morceaux.push('');

  const ajouterPage = (entree) => {
    const chemin = `${SITE}/${entree.id}/`;
    morceaux.push('---');
    morceaux.push('');
    morceaux.push(`## ${entree.data.title}`);
    morceaux.push('');
    morceaux.push(langue === 'en' ? `Source: ${chemin}` : `Source : ${chemin}`);
    const desc = (entree.data.description || '').trim();
    if (desc) {
      morceaux.push('');
      morceaux.push(desc);
    }
    morceaux.push('');
    morceaux.push(descendreTitres(remplacerImages(entree.body || '')).trim());
    morceaux.push('');
  };

  for (const section of SECTIONS) {
    const entrees = pages
      .filter((e) => e.id.startsWith(`${prefixe}${section.dossier}/`))
      .sort(parOrdre);
    if (entrees.length === 0) continue;
    morceaux.push('');
    morceaux.push(`# ${langue === 'en' ? section.en : section.fr}`);
    morceaux.push('');
    for (const e of entrees) ajouterPage(e);
  }

  const notes = pages.find((e) => e.id === `${prefixe}${NOTES_DE_VERSION.fichier}`);
  if (notes) {
    morceaux.push('');
    morceaux.push(`# ${langue === 'en' ? NOTES_DE_VERSION.en : NOTES_DE_VERSION.fr}`);
    morceaux.push('');
    ajouterPage(notes);
  }

  return morceaux.join('\n').replace(/\n{4,}/g, '\n\n\n') + '\n';
}
