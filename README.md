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

Le dépôt appartient à l'organisation **Hexa-ai**. Ces étapes demandent le rôle
**Admin** sur le dépôt : un simple accès en écriture ne fait pas apparaître la
section Pages.

1. **Settings → Pages → Source** : **GitHub Actions**.
2. Chez le registrar de `hexa-ai.fr`, un `CNAME` `docs` vers
   **`hexa-ai.github.io`** — la cible est le domaine Pages de
   l'organisation, pas celui du dépôt.
3. **Settings → Pages → Custom domain** : `docs.hexa-ai.fr`.
4. Cocher **Enforce HTTPS** une fois le certificat émis.

Le domaine est aussi déclaré dans `astro.config.mjs` (`SITE`) — il sert à
générer le `sitemap.xml` et les URL canoniques. À modifier en même temps.

> Tant que le domaine personnalisé n'est pas en place, le site est servi sous
> un sous-chemin (`hexa-ai.github.io/doc-hexa-ai/`) et s'affiche **sans style**
> : les feuilles CSS et les images sont référencées depuis la racine du
> domaine. Ce n'est pas une panne, et il n'y a rien à corriger — tout rentre
> dans l'ordre une fois le site servi à la racine de `docs.hexa-ai.fr`.

### Le jour de la mise en ligne publique

Tant que la documentation est en cours de rédaction, chaque page émet
`<meta name="robots" content="noindex, nofollow">` : les moteurs la lisent
mais ne la référencent pas. C'est ce qui évite que les pages « Page
d'exemple », au contenu fictif, atterrissent dans les résultats de recherche.

Pour ouvrir l'indexation, **un seul geste** : passer `NOINDEX` à `false` en
tête d'`astro.config.mjs`, puis pousser. Le `robots.txt` est déjà dans son
état définitif et n'a pas à être touché.

Dernière étape, après la première mise en ligne : remplacer les liens
`hexa-ai.odoo.com/knowledge/article/65` du dépôt `site-hexa-ai-edge` (header,
CTA de la section contact et pied de page, en FR comme en EN) par la nouvelle
adresse.

## Reprise du contenu Odoo

Odoo Knowledge n'exporte pas de Markdown. Le script `tools/import-odoo.mjs`
fait la conversion, images comprises. Rien à installer : il s'appuie sur les
dépendances du projet.

### 1. Enregistrer l'article depuis le navigateur

Ouvrez l'article dans Odoo, **en étant connecté**, puis `Ctrl+S` et choisissez
**« Page web, complète »** (et non « HTML seul »).

C'est l'étape qui compte. En « page complète », le navigateur télécharge aussi
toutes les images dans un dossier `<nom>_files` à côté du `.html` — il utilise
votre session, donc il passe l'authentification. Un script, lui, ne le pourrait
pas : les images d'Odoo sont derrière un login.

### 2. Convertir

```bash
node tools/import-odoo.mjs "C:/Users/moi/Downloads/OPC-UA.html" src/content/docs/protocols --slug opc-ua --ordre 3
```

> **Lancez-le avec `node`, pas avec `npm run`.** npm interprète les options
> qu'il ne connaît pas comme sa propre configuration et les avale : `--slug` et
> `--ordre` n'arriveraient jamais au script, sans le moindre message d'erreur.
> Le dossier de travail doit être la racine du dépôt.

| Option | Effet |
| --- | --- |
| `--slug` | nom du `.md` produit (défaut : déduit du titre) |
| `--titre` | force le titre (défaut : premier `<h1>`) |
| `--ordre` | valeur de `sidebar.order` |
| `--selecteur` | conteneur de l'article, si l'auto-détection se trompe |
| `--force` | écrase une page existante |

Le script s'occupe de :

- retirer l'interface d'Odoo (barre de navigation, fil d'Ariane, boutons) ;
- convertir titres, listes, **tableaux** et blocs de code ;
- retirer le `<h1>`, que Starlight affiche déjà depuis le frontmatter ;
- **redescendre la hiérarchie des titres d'un cran** si l'article découpait ses
  sections en `<h1>` — ce que fait Odoo. Sans ça, la page aurait plusieurs
  `<h1>` et le sommaire « Sur cette page », qui ne liste que les niveaux 2 et
  3, resterait vide ;
- **copier les images** à côté de la page et les renommer `<slug>-1.png`,
  `<slug>-2.png`… en réécrivant les chemins en `./` ;
- reconstituer en fichiers les images embarquées en base64 ;
- écrire le frontmatter.

Il termine par une liste de ce qui reste à faire, propre à l'article.

### 3. Reprendre à la main

Le script ne devine pas tout :

- **la `description`**, laissée en `TODO` — elle sert à la recherche et aux
  moteurs ;
- **les tableaux complexes** (cellules fusionnées), que le format Markdown ne
  sait pas représenter ;
- **les textes alternatifs** des images, souvent vides côté Odoo ;
- **les images restées sur une URL distante**, signalées en fin d'exécution :
  à télécharger depuis Odoo et à déposer à côté de la page ;
- **la version anglaise**, à créer au même chemin sous
  `src/content/docs/en/`.

Enfin, relisez : une doc reprise mécaniquement se voit.

## Pages d'exemple

Les pages marquées d'un encadré « Page d'exemple » sont un squelette de mise en
page. Leur contenu technique provient du site vitrine ; les procédures pas à
pas sont à remplacer par le contenu réel.
