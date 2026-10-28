// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import { SECTIONS, NOTES_DE_VERSION, TITRE, PORTAIL } from './src/sections.mjs';

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

// Visuel d'apercu quand un lien est partage (LinkedIn, Teams, mail...) :
// public/og-doc.jpg, 1200 x 627, en JPG (LinkedIn affiche mal le WebP).
/** @type {NonNullable<import('@astrojs/starlight/types').StarlightUserConfig['head']>} */
const HEAD = [
  ...(NOINDEX ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }] : []),
  { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/og-doc.jpg` } },
  { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
  { tag: 'meta', attrs: { property: 'og:image:height', content: '627' } },
  { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/og-doc.jpg` } },
];

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      // Titre court, et court volontairement : il partage la barre du haut
      // avec le logo, la recherche et le bouton de menu. « Documentation
      // HAI-OS » reclamait 221 px pour 143 px disponibles sur un telephone,
      // et se retrouvait tranche en plein milieu d'un mot.
      title: TITRE,

      favicon: '/favicon.ico',
      description: 'Documentation de la passerelle industrielle HAI-P200-4G et du système HAI-OS.',

      head: HEAD,

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

      // Zoom au clic sur les images : les schemas denses restent lisibles.
      //
      // Deux documentations dans le meme site, chacune avec son menu : le
      // controleur HAI-P200 (SECTIONS) et le portail myHexa (PORTAIL), voir
      // src/sections.mjs. Un selecteur en haut du menu lateral passe de l'une
      // a l'autre (plugin starlight-sidebar-topics). Depuis Starlight 0.39, un
      // groupe autogenere s'ecrit { label, items: [{ autogenerate }] }.
      plugins: [
        starlightImageZoom(),
        starlightSidebarTopics(
          [
            {
              label: { fr: 'Contrôleur HAI-P200', en: 'HAI-P200 controller' },
              link: '/',
              icon: 'laptop',
              items: [
                ...SECTIONS.map(({ dossier, fr, en }) => ({
                label: fr,
                translations: { en },
                collapsed: false,
                items: [{ autogenerate: { directory: dossier } }],
              })),
                {
                  label: NOTES_DE_VERSION.fr,
                  translations: { en: NOTES_DE_VERSION.en },
                  link: `/${NOTES_DE_VERSION.fichier}/`,
                },
              ],
            },
            {
              label: { fr: PORTAIL.fr, en: PORTAIL.en },
              link: `/${PORTAIL.dossier}/`,
              icon: 'external',
              items: [
                { label: 'Présentation', translations: { en: 'Overview' }, link: `/${PORTAIL.dossier}/` },
                ...PORTAIL.sections.map(({ dossier, fr, en }) => ({
                label: fr,
                translations: { en },
                collapsed: false,
                items: [{ autogenerate: { directory: dossier } }],
              })),
              ],
            },
          ],
          { exclude: ['/404', '/en/404'] },
        ),
      ],

      lastUpdated: true,
      pagination: true,

      // Sommaire de droite. Starlight s'arrete au niveau 3 par defaut ; on
      // descend au 4 pour que les sous-sous-titres y figurent aussi. Ils
      // portent du contenu qu'on cherche directement — « Trouver vos
      // equipements automatiquement », « Ajouter des variables » — et sans eux
      // la page d'acquisition n'exposait que quatre entrees pour trente ecrans.
      // Les notes de version gardent leur propre reglage a 2 : leurs dizaines
      // de « Added / Changed / Fixed » n'ont rien a faire dans un sommaire.
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },

      social: [
        { icon: 'external', label: 'Site produit', href: 'https://edge.hexa-ai.fr' },
        { icon: 'email', label: 'Contact', href: 'mailto:contact@hexa-ai.fr' },
      ],
    }),
  ],
});
