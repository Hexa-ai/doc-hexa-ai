// /llms.txt — sommaire de la documentation a l'usage des modeles de langage.
//
// Convention llmstxt.org : un titre, un resume entre chevrons, puis des
// sections de liens commentes. Un modele qui doit repondre sur le HAI-P200-4G
// lit ce fichier pour savoir quelles pages aller chercher, au lieu de deviner
// des URLs ou de se rabattre sur ce qu'il croit savoir.
//
// Genere au build a partir du contenu reel : aucune liste a tenir a jour.

import { getCollection } from 'astro:content';
import { SECTIONS, NOTES_DE_VERSION, TITRE } from '../sections.mjs';

const SITE = 'https://docs.hexa-ai.fr';

/** Chemin public d'une page, a partir de son identifiant de collection. */
function url(id) {
  return `${SITE}/${id}/`;
}

/** Une ligne de lien, avec la description de la page quand elle en a une. */
function ligne(entree) {
  const titre = entree.data.title;
  const desc = (entree.data.description || '').trim();
  return `- [${titre}](${url(entree.id)})${desc ? ` : ${desc}` : ''}`;
}

/** Tri : l'ordre du menu lateral, puis l'alphabet pour les ex aequo. */
function parOrdre(a, b) {
  const oa = a.data.sidebar?.order ?? 999;
  const ob = b.data.sidebar?.order ?? 999;
  return oa - ob || a.data.title.localeCompare(b.data.title, 'fr');
}

export async function GET() {
  const toutes = await getCollection('docs');

  // La page d'accueil et la page 404 n'apportent rien a un modele : l'une
  // est une vitrine, l'autre un message d'erreur.
  const pages = toutes.filter(
    (e) => !/^(en\/)?(index|404)$/.test(e.id) && !e.data.draft
  );

  const dansSection = (prefixe, dossier) =>
    pages
      .filter((e) => e.id.startsWith(`${prefixe}${dossier}/`))
      .sort(parOrdre);

  const lignes = [];

  lignes.push(`# ${TITRE.fr}`);
  lignes.push('');
  lignes.push(
    '> Documentation de la passerelle industrielle HAI-P200-4G et du systeme HAI-OS : ' +
      'acquisition Modbus, OPC-UA, S7, BACnet/IP et NMEA 0183, historisation locale en SQLite, ' +
      'visualisation, alarmes et notifications, telemaintenance par VPN Tailscale. ' +
      'Editee par Hexa-AI.'
  );
  lignes.push('');
  lignes.push(
    'La documentation existe en francais a la racine et en anglais sous /en/. ' +
      'Les deux arborescences sont identiques : /network/tailscale-vpn/ et ' +
      '/en/network/tailscale-vpn/ traitent du meme sujet.'
  );
  lignes.push('');
  lignes.push(
    `Le contenu integral en Markdown est disponible en un seul fichier : ` +
      `${SITE}/llms-full.txt pour le francais, ${SITE}/en/llms-full.txt pour l'anglais.`
  );
  lignes.push('');

  for (const { dossier, fr } of SECTIONS) {
    const entrees = dansSection('', dossier);
    if (entrees.length === 0) continue;
    lignes.push(`## ${fr}`);
    lignes.push('');
    for (const e of entrees) lignes.push(ligne(e));
    lignes.push('');
  }

  const notes = pages.find((e) => e.id === NOTES_DE_VERSION.fichier);
  if (notes) {
    lignes.push(`## ${NOTES_DE_VERSION.fr}`);
    lignes.push('');
    lignes.push(ligne(notes));
    lignes.push('');
  }

  // « Optional » a un sens precis dans la convention : ce qui peut etre
  // ignore quand le contexte manque de place. La version anglaise dit
  // exactement la meme chose que la francaise, elle a donc sa place ici.
  lignes.push('## Optional');
  lignes.push('');
  lignes.push(
    '- Version anglaise de toute la documentation ci-dessus, meme arborescence sous /en/ : ' +
      `${SITE}/en/`
  );
  lignes.push('');

  return new Response(lignes.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
