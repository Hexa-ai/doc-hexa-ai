# doc-hexa-ai

Documentation HAI-OS / HAI-P200-4G, générée à partir de fichiers Markdown avec
[Astro Starlight](https://starlight.astro.build/). Deux langues : français à la
racine, anglais sous `/en/` — même convention que le site vitrine
`edge.hexa-ai.fr`.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` génère le site statique dans `dist/`, `npm run preview` le sert
localement.

## Écrire une page

Un fichier `.md` dans `src/content/docs/`, avec un en-tête YAML :

```markdown
---
title: Mise en service
description: Phrase courte, utilisée par la recherche et les moteurs.
sidebar:
  order: 1
---

## Une section
```

- `sidebar.order` fixe la position dans le menu (sinon : ordre alphabétique).
- Le menu est **déplié par défaut**. Pour replier un groupe, passer
  `collapsed: true` sur ce groupe dans `astro.config.mjs`.
- Ajouter un groupe = créer un dossier + une entrée dans `sidebar`.

## Images

Une seule règle à retenir : **écrivez l'image en Markdown simple et ne
spécifiez aucune largeur**. Le thème s'en charge.

```markdown
![Description de l'image](./ma-capture.png)
```

- plein écran sur mobile ;
- plafonnée à **720 px** sur grand écran, donc pas de défilement inutile ;
- convertie en WebP et déclinée en plusieurs résolutions au build ;
- cliquable pour un zoom plein écran.

Le plafond est en **pixels**, jamais en pourcentage : un pourcentage grandit
avec l'écran, c'est exactement le défaut rencontré sous Odoo.

### Quand le défaut ne suffit pas

| Classe | Largeur max | Usage |
| --- | --- | --- |
| _(aucune)_ | 720 px | Cas général |
| `wide` | 1100 px | Schémas larges, captures d'UI complète |
| `narrow` | 380 px | Photos produit, vues mobiles |
| `plain` | — | Retire cadre et fond (visuels déjà détourés) |
| `inline` | 1.4em | Picto au fil du texte |

On les pose sur un `<figure>`, en laissant une **ligne vide** avant et après
l'image pour que le Markdown reste interprété :

```markdown
<figure class="wide">

![Architecture du tunnel](./schema.png)

<figcaption>Légende facultative.</figcaption>
</figure>
```

Deux images côte à côte : `<div class="img-row">` avec deux `<figure>` dedans.
Elles s'empilent automatiquement sous 260 px de large.

Les plafonds se règlent en un seul endroit, dans `src/styles/hexa.css`
(`--hai-img-max`, `--hai-img-max-wide`, `--hai-img-max-narrow`).

### Où ranger les fichiers

Deux emplacements possibles, jamais `public/` (les images qui y sont déposées
ne sont pas optimisées).

**1. À côté de la page — à privilégier.** Déposez le fichier dans le même
dossier que le `.md` et appelez-le avec `./` :

```
src/content/docs/getting-started/
├── commissioning.md
└── ecran-accueil.png       <- ![...](./ecran-accueil.png)
```

Pas de `../../../` à compter, et quand la page est supprimée ou déplacée ses
images suivent.

**2. Dans `src/assets/`** pour une image utilisée par plusieurs pages (logo,
schéma d'architecture partagé FR/EN). L'appel se fait alors en relatif :
`../../../assets/mon-schema.png`.

Dans les deux cas Astro convertit en WebP, génère plusieurs résolutions,
renseigne `width`/`height` et ajoute `loading="lazy"`. Gain constaté sur le
schéma Tailscale : **1655 kB → 62 kB**. Une même image utilisée deux fois
n'est stockée qu'une seule fois.

### Largeur réellement disponible

La colonne fait 1088 px au maximum, et le texte est bridé à 800 px pour rester
lisible. Sur un écran de 1440 px, la place restante entre les deux menus
plafonne à environ 870 px : `wide` y sera donc moins large que sur un 4K, c'est
normal. Pour une figure qui a vraiment besoin de toute la page, ajouter
`tableOfContents: false` dans l'en-tête : le sommaire de droite disparaît et
libère sa colonne.

## Au quotidien

1. `npm run dev` une fois pour toutes ; la page se recharge à chaque
   sauvegarde du `.md`.
2. On écrit, on dépose ses images à côté, on relit dans le navigateur.
3. `git commit` puis `git push` : le workflow reconstruit et publie tout seul.

Une correction ponctuelle peut aussi se faire directement depuis l'interface
web de GitHub (crayon sur le fichier `.md`) — sans installer quoi que ce soit.
La publication se déclenche de la même façon.

> **Encodage :** les fichiers sont en UTF-8 et le français s'écrit **avec ses
> accents**. Si vous générez ou collez du contenu par script, vérifiez que
> l'encodage suit — un « é » transformé en « Ã© » se voit immédiatement en
> ligne.

## Traductions

Chaque page française a une jumelle sous `src/content/docs/en/`, **au même
chemin de fichier**. C'est ce qui permet au sélecteur de langue de basculer
d'une page à l'autre.

```
src/content/docs/protocols/modbus-tcp.md        -> /protocols/modbus-tcp/
src/content/docs/en/protocols/modbus-tcp.md     -> /en/protocols/modbus-tcp/
```

> **Pourquoi les dossiers portent des noms anglais**, y compris côté français.
> Deux mécanismes de Starlight l'imposent, et ils ne sont pas contournables
> sans réécrire des composants :
>
> - le sélecteur de langue construit l'URL de l'autre langue en **remplaçant
>   le seul segment de langue** (`localizedUrl.js`) — il ne cherche pas la
>   page équivalente par son fichier ;
> - le menu autogénéré cherche le dossier `<langue>/<dossier>`, donc sous le
>   **même nom** dans les deux langues.
>
> Autrement dit, le chemin après `/en/` doit être identique au chemin
> français. Des segments français d'un côté et anglais de l'autre casseraient
> le bouton de langue (404) et le menu anglais. Les noms anglais donnent donc
> des URL correctes en anglais sans rien sacrifier.
>
> **Ne renommez pas ces dossiers après la mise en ligne** : cela casserait les
> liens entrants et le référencement.

Les libellés des groupes de menu se traduisent dans `astro.config.mjs`
(`translations: { en: '...' }`). Les libellés d'interface de Starlight se
surchargent dans `src/content/i18n/`.

## Publication

Le workflow `.github/workflows/deploy.yml` construit et publie sur GitHub Pages
à chaque push sur `main`.

Côté GitHub, une fois le dépôt créé :

1. **Settings → Pages → Source** : choisir **GitHub Actions**.
2. **Settings → Pages → Custom domain** : `docs.hexa-ai.fr`.
3. Chez le registrar, un `CNAME` `docs` vers `<compte>.github.io`.
4. Cocher **Enforce HTTPS** une fois le certificat émis.

Le domaine est aussi déclaré dans `astro.config.mjs` (`SITE`) — il sert à
générer le `sitemap.xml` et les URL canoniques. À modifier en même temps.

Dernière étape, après la première mise en ligne : remplacer les liens
`hexa-ai.odoo.com/knowledge/article/65` du dépôt `site-hexa-ai-edge` (header,
CTA de la section contact et pied de page, en FR comme en EN) par la nouvelle
adresse.

## Reprise du contenu Odoo

Odoo Knowledge n'exporte pas de Markdown. Le chemin praticable est de copier le
HTML d'un article puis :

```bash
pandoc -f html -t gfm article.html -o src/content/docs/ma-page.md
```

Restent à reprendre à la main : les images (à redéposer à côté de la page) et
les tableaux complexes.

## Pages d'exemple

Les pages marquées d'un encadré « Page d'exemple » sont un squelette de mise en
page. Leur contenu technique provient du site vitrine ; les procédures pas à
pas sont à remplacer par le contenu réel.
