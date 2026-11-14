---
title: Mise en page, impression et export
description: "Régler la mise en page d'un synoptique ou d'un schéma, exporter une page en PNG, JPEG ou PDF, imprimer un dossier complet en un seul PDF, exporter les images pour un écran d'IHM locale."
sidebar:
  order: 3
---

Un synoptique ou un schéma peut sortir du portail : image, PDF d'une page, dossier complet ou images prêtes pour un écran d'IHM. Ces actions sont dans l'éditeur (bouton **…**, **Mise en page**) et dans le menu d'un dossier.

:::note[Fonction en version bêta]
Les synoptiques, schémas et leurs exports sont ouverts à tous mais évoluent encore. Vos retours sont les bienvenus.
:::

## Mise en page d'un folio

La fenêtre **Mise en page** règle :

- le **cadre** : la taille de la feuille ou la résolution de l'écran (portrait ou paysage, ou taille personnalisée) ;
- le **style** de la page et son en-tête (logo, titre, date, pied de page) ;
- le **cadrage** : **Ajuster au dessin**, ou **Comme le cadre** (échelle fixe) ;
- la **révision** (ex. B, 2.1, Ind. C) affichée dans l'en-tête et le cartouche.

Le choix **Suivre la mise en page du dossier** applique à ce folio les réglages du dossier ; **Appliquer à tout le dossier** les étend à tous les folios.

## Exporter une page

Dans **Exporter la page**, choisissez le **format** (**PNG**, **JPEG** ou **PDF (une page)**), le **thème du rendu** (**Clair (impression)** ou le thème de l'écran) et les **textes affichés** (valeurs et unités, états, textes libres). L'export montre le schéma au repos, sans mesure en direct. Sans [option Designer](/portal/synoptics/designer/), le fichier porte le filigrane.

## Imprimer un dossier

Le menu d'un dossier propose **Imprimer le dossier…** : un **seul PDF** avec page de garde (logo de l'entreprise, logo du projet), **sommaire** cliquable (numéro, nom, page), tous les folios et, au choix, des pages de fin : **nomenclature** (avec export CSV), **plan de borniers**, et **repères à imprimer** (fils, câbles, appareils, borniers, bornes) avec une marge de quantité. Chaque folio garde sa mise en page.

Les réglages communs aux plans (cartouche, textes, logo) se font dans **Mon entreprise ▸ Plans et impression** : voir [Mon entreprise](/portal/administration/company/). Le titre du projet, le préfixe des folios, l'indice et la date de révision se règlent par dossier (clic droit sur le dossier ▸ **Réglages du plan**).

## Export pour une IHM locale

**Export pour IHM locale** produit, pour un schéma animé, un **fond de plan** et un dossier d'images par équipement et par état (arrêt, marche, défaut…), toutes à la même position, plus un **fichier de coordonnées** (CSV et JSON : position, taille, numéros d'états, variables myHexa reliées). Vous superposez ces images dans le logiciel de votre écran (EasyBuilder, TIA Portal, Vijeo…) et les animez avec une variable. Réglez le format (PNG ou JPEG, fond transparent), le thème, l'affichage des noms d'équipements et les états à inclure.
