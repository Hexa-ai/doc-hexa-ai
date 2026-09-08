// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

// Domaine de publication. A changer si la doc part sur un sous-chemin
// (voir README, section « Publication »).
const SITE = 'https://docs.hexa-ai.fr';

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: {
        fr: 'Documentation HAI-OS',
        en: 'HAI-OS Documentation',
      },

      favicon: '/favicon.ico',
      description: 'Documentation de la passerelle industrielle HAI-P200-4G et du systeme HAI-OS.',

      // FR a la racine (docs.hexa-ai.fr/), EN sous /en/ : meme convention
      // que le site vitrine edge.hexa-ai.fr.
      defaultLocale: 'root',
      locales: {
        root: { label: 'Francais', lang: 'fr' },
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
          label: 'Demarrage',
          translations: { en: 'Getting started' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'demarrage' } }],
        },
        {
          label: 'Protocoles',
          translations: { en: 'Protocols' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'protocoles' } }],
        },
        {
          label: 'Materiel',
          translations: { en: 'Hardware' },
          collapsed: false,
          items: [{ autogenerate: { directory: 'materiel' } }],
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
