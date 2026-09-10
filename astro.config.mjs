// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import { SECTIONS, NOTES_DE_VERSION } from './src/sections.mjs';

// Domaine de publication. A changer si la doc part sur un sous-chemin
// (voir README, section « Publication »).
const SITE = 'https://docs.hexa-ai.fr';

// Garde-fou anti-indexation, leve a la mise en ligne publique.
//
// A true, chaque page emet <meta name="robots" content="noindex, nofollow"> :
// les moteurs lisent le site mais ne le referencent pas. C'etait l'etat
// pendant la redaction, pour qu'aucune page inachevee ne se retrouve dans
// les resultats de recherche.
//
// Le site vitrine edge.hexa-ai.fr pointe desormais ici : la documentation est
// publique, elle doit etre trouvable.
const NOINDEX = false;

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      // Titre court, et court volontairement : il partage la barre du haut
      // avec le logo, la recherche et le bouton de menu. « Documentation
      // HAI-OS » reclamait 221 px pour 143 px disponibles sur un telephone,
      // et se retrouvait tranche en plein milieu d'un mot.
      title: {
        fr: 'HAI Doc',
        en: 'HAI Docs',
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

      // Les sections viennent de src/sections.mjs, que partagent le menu et
      // les index pour modeles de langage. Depuis Starlight 0.39, un groupe
      // autogenere s'ecrit { label, items: [{ autogenerate }] }.
      // collapsed: false => deplie.
      sidebar: [
        ...SECTIONS.map(({ dossier, fr, en }) => ({
          label: fr,
          translations: { en },
          collapsed: false,
          items: [{ autogenerate: { directory: dossier } }],
        })),
        // Page seule, hors groupe. Le lien est localise automatiquement en /en/.
        {
          label: NOTES_DE_VERSION.fr,
          translations: { en: NOTES_DE_VERSION.en },
          link: `/${NOTES_DE_VERSION.fichier}/`,
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
