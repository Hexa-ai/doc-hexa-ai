// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

// Domaine de publication. A changer si la doc part sur un sous-chemin
// (voir README, section « Publication »).
const SITE = 'https://docs.hexa-ai.fr';

// Garde-fou anti-indexation, le temps de la redaction.
//
// Tant que ce drapeau est a true, chaque page emet <meta name="robots"
// content="noindex, nofollow"> : les moteurs peuvent lire le site mais ne
// le referencent pas. On evite ainsi que les pages « Page d'exemple »,
// au contenu fictif, se retrouvent dans les resultats de recherche.
//
// LE JOUR DE LA MISE EN LIGNE PUBLIQUE : passer a false, et rien d'autre.
// Le robots.txt de public/ est deja dans son etat definitif.
const NOINDEX = true;

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: {
        fr: 'Documentation HAI-OS',
        en: 'HAI-OS Documentation',
      },

      favicon: '/favicon.ico',
      description: 'Documentation de la passerelle industrielle HAI-P200-4G et du système HAI-OS.',

      head: NOINDEX
        ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }]
        : [],

      // FR a la racine (docs.hexa-ai.fr/), EN sous /en/ : meme convention
      // que le site vitrine edge.hexa-ai.fr.
      defaultLocale: 'root',
      locales: {
        root: { label: 'Français', lang: 'fr' },
        en: { label: 'English', lang: 'en' },
      },

      logo: {
        src: './src/assets/logo.png',
        alt: 'Hexa-AI',
        replacesTitle: false,
      },

      customCss: [
        '@fontsource-variable/inter',
        './src/styles/hexa.css',
      ],

      // Zoom au clic sur les images : les schemas denses restent lisibles
      // sans qu'on ait besoin de les sur-dimensionner dans la page.
      plugins: [starlightImageZoom()],

      // Depuis Starlight 0.39, un groupe autogenere s'ecrit
      // { label, items: [{ autogenerate }] }. collapsed: false => deplie.
      sidebar: [
        {
          label: 'Démarrage',
          translations: { en: 'Getting started' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'getting-started' } }],
        },
        {
          label: 'Réseau',
          translations: { en: 'Network' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'network' } }],
        },
        // Les trois sections suivent le cycle de la donnee : on l'acquiert,
        // on la supervise, on alerte. Dix articles dans une seule section
        // devenaient illisibles.
        {
          label: 'Acquisition',
          translations: { en: 'Acquisition' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'acquisition' } }],
        },
        {
          label: 'Supervision',
          translations: { en: 'Monitoring' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'monitoring' } }],
        },
        {
          label: 'Alertes & rapports',
          translations: { en: 'Alerts & reports' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'alerts' } }],
        },
        {
          label: 'Matériel',
          translations: { en: 'Hardware' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'hardware' } }],
        },
        // Page seule, hors groupe : les notes de version ne relevent d'aucune
        // des trois sections. Le lien est localise automatiquement en /en/.
        {
          label: 'Notes de version',
          translations: { en: 'Release notes' },
          link: '/release-notes/',
        },
      ],

      lastUpdated: true,
      pagination: true,

      social: [
        { icon: 'external', label: 'Site produit', href: 'https://edge.hexa-ai.fr' },
        { icon: 'email', label: 'Contact', href: 'mailto:contact@hexa-ai.fr' },
      ],
    }),
  ],
});
