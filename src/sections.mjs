// Sections de la documentation — source unique.
//
// Le menu lateral (astro.config.mjs) et les index destines aux modeles de
// langage (src/pages/llms*.txt.js) lisent tous les deux cette liste. Ajouter
// une section ici la fait apparaitre des deux cotes, dans le meme ordre, et
// evite qu'un libelle change d'un cote sans changer de l'autre.
//
// L'ordre est celui du menu, et il suit le cycle de la donnee : on raccorde
// l'appareil, on le met sur le reseau, on acquiert, on visualise, on alerte.
// Dix articles dans une seule section devenaient illisibles.
export const SECTIONS = [
  { dossier: 'getting-started', fr: 'Démarrage', en: 'Getting started' },
  { dossier: 'network', fr: 'Réseau & accès', en: 'Network & access' },
  { dossier: 'acquisition', fr: 'Acquisition', en: 'Acquisition' },
  { dossier: 'monitoring', fr: 'Visualisation', en: 'Visualisation' },
  { dossier: 'alerts', fr: 'Alertes & rapports', en: 'Alerts & reports' },
  { dossier: 'integration', fr: 'Intégration', en: 'Integration' },
  { dossier: 'system', fr: 'Système & sécurité', en: 'System & security' },
  { dossier: 'hardware', fr: 'Matériel', en: 'Hardware' },
];

// Page seule, hors section : les notes de version ne relevent d'aucun theme.
export const NOTES_DE_VERSION = {
  fichier: 'release-notes',
  fr: 'Notes de version',
  en: 'Release notes',
};
