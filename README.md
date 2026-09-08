# doc-hexa-ai

Documentation HAI-OS / HAI-P200-4G, generee a partir de fichiers Markdown avec
[Astro Starlight](https://starlight.astro.build/). Deux langues : francais a la
racine, anglais sous `/en/` — meme convention que le site vitrine
`edge.hexa-ai.fr`.

## Demarrer

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` genere le site statique dans `dist/`, `npm run preview` le sert
localement.

## Ecrire une page

Un fichier `.md` dans `src/content/docs/`, avec un en-tete YAML :

```markdown
---
title: Mise en service
description: Phrase courte, utilisee par la recherche et les moteurs.
sidebar:
  order: 1
---

## Une section
```

- `sidebar.order` fixe la position dans le menu (sinon : ordre alphabetique).
- Le menu est **deplie par defaut**. Pour replier un groupe, passer
  `collapsed: true` sur ce groupe dans `astro.config.mjs`.
- Ajouter un groupe = creer un dossier + une entree dans `sidebar`.

## Images

Une seule regle a retenir : **ecrivez l'image en Markdown simple et ne
specifiez aucune largeur**. Le theme s'en charge.

```markdown
![Description de l'image](../../../assets/ma-capture.png)
```

- plein ecran sur mobile ;
- plafonnee a **720 px** sur grand ecran, donc pas de defilement inutile ;
- convertie en WebP et declinee en plusieurs resolutions au build ;
- cliquable pour un zoom plein ecran.

Le plafond est en **pixels**, jamais en pourcentage : un pourcentage grandit
avec l'ecran, c'est exactement le defaut rencontre sous Odoo.

### Quand le defaut ne suffit pas

| Classe | Largeur max | Usage |
| --- | --- | --- |
| _(aucune)_ | 720 px | Cas general |
| `wide` | 1100 px | Schemas larges, captures d'UI complete |
| `narrow` | 380 px | Photos produit, vues mobiles |
| `plain` | — | Retire cadre et fond (visuels deja detoures) |
| `inline` | 1.4em | Picto au fil du texte |

On les pose sur un `<figure>`, en laissant une **ligne vide** avant et apres
l'image pour que le Markdown reste interprete :

```markdown
<figure class="wide">

![Architecture du tunnel](../../../assets/schema.png)

<figcaption>Legende facultative.</figcaption>
</figure>
```

Deux images cote a cote : `<div class="img-row">` avec deux `<figure>` dedans.
Elles s'empilent automatiquement sous 260 px de large.

Les plafonds se reglent en un seul endroit, dans `src/styles/hexa.css`
(`--hai-img-max`, `--hai-img-max-wide`, `--hai-img-max-narrow`).

### Ou ranger les fichiers

Deux emplacements possibles, jamais `public/` (les images qui y sont deposees
ne sont pas optimisees).

**1. A cote de la page — a privilegier.** Deposez le fichier dans le meme
dossier que le `.md` et appelez-le avec `./` :

```
src/content/docs/demarrage/
├── mise-en-service.md
└── ecran-accueil.png       <- ![...](./ecran-accueil.png)
```

Pas de `../../../` a compter, et quand la page est supprimee ou deplacee ses
images suivent.

**2. Dans `src/assets/`** pour une image utilisee par plusieurs pages (logo,
schema d'architecture partage FR/EN). L'appel se fait alors en relatif :
`../../../assets/mon-schema.png`.

Dans les deux cas Astro convertit en WebP, genere plusieurs resolutions,
renseigne `width`/`height` et ajoute `loading="lazy"`. Gain constate sur le
schema Tailscale : **1655 kB -> 62 kB**. Une meme image utilisee deux fois
n'est stockee qu'une seule fois.

### Largeur reellement disponible

La colonne fait 1088 px au maximum, et le texte est bride a 800 px pour rester
lisible. Sur un ecran de 1440 px, la place restante entre les deux menus
plafonne a environ 780 px : `wide` y sera donc moins large que sur un 4K, c'est
normal. Pour une figure qui a vraiment besoin de toute la page, ajouter
`tableOfContents: false` dans l'en-tete : le sommaire de droite disparait et
libere sa colonne.

## Au quotidien

1. `npm run dev` une fois pour toutes ; la page se recharge a chaque
   sauvegarde du `.md`.
2. On ecrit, on depose ses images a cote, on relit dans le navigateur.
3. `git commit` puis `git push` : le workflow reconstruit et publie tout seul.

Une correction ponctuelle peut aussi se faire directement depuis l'interface
web de GitHub (crayon sur le fichier `.md`) — sans installer quoi que ce soit.
La publication se declenche de la meme facon.

## Traductions

Chaque page francaise a une jumelle sous `src/content/docs/en/`, **au meme
chemin de fichier**. C'est ce qui permet au selecteur de langue de basculer
d'une page a l'autre.

```
src/content/docs/protocoles/modbus-tcp.md        -> /protocoles/modbus-tcp/
src/content/docs/en/protocoles/modbus-tcp.md     -> /en/protocoles/modbus-tcp/
```

> **Compromis assume :** les URL anglaises reprennent les segments francais
> (`/en/protocoles/`, pas `/en/protocols/`). C'est la contrainte du menu
> autogenere, qui apparie les dossiers par leur nom. Pour des URL anglaises
> natives, il faudrait remplacer `autogenerate` par une liste explicite de
> liens dans `astro.config.mjs`. A trancher avant la mise en ligne : changer
> ces URL apres coup casserait les liens entrants.

Les libelles des groupes de menu se traduisent dans `astro.config.mjs`
(`translations: { en: '...' }`). Les libelles d'interface de Starlight se
surchargent dans `src/content/i18n/`.

## Publication

Le workflow `.github/workflows/deploy.yml` construit et publie sur GitHub Pages
a chaque push sur `main`.

Cote GitHub, une fois le depot cree :

1. **Settings → Pages → Source** : choisir **GitHub Actions**.
2. **Settings → Pages → Custom domain** : `docs.hexa-ai.fr`.
3. Chez le registrar, un `CNAME` `docs` vers `<compte>.github.io`.
4. Cocher **Enforce HTTPS** une fois le certificat emis.

Le domaine est aussi declare dans `astro.config.mjs` (`SITE`) — il sert a
generer le `sitemap.xml` et les URL canoniques. A modifier en meme temps.

Derniere etape, apres la premiere mise en ligne : remplacer les liens
`hexa-ai.odoo.com/knowledge/article/65` du depot `site-hexa-ai-edge` (header,
CTA de la section contact et pied de page, en FR comme en EN) par la nouvelle
adresse.

## Reprise du contenu Odoo

Odoo Knowledge n'exporte pas de Markdown. Le chemin praticable est de copier le
HTML d'un article puis :

```bash
pandoc -f html -t gfm article.html -o src/content/docs/ma-page.md
```

Restent a reprendre a la main : les images (a redeposer dans `src/assets/`) et
les tableaux complexes.

## Pages d'exemple

Les pages marquees d'un encadre « Page d'exemple » sont un squelette de mise en
page. Leur contenu technique provient du site vitrine ; les procedures pas a
pas sont a remplacer par le contenu reel.
