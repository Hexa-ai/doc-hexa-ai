---
title: "Batches (Gestion des Lots)"
description: "Découper la production en lots : définition de la variable de lot, suivi des lots et analyse dans le Data-Explorer."
sidebar:
  order: 2
---


Bienvenue dans ce guide de prise en main de la page **Batches**. Ce module permet d'isoler, de suivre et de documenter vos cycles de production (lots). Il centralise l'historique de vos lots, permet de les analyser individuellement dans le Data-Explorer, et gère la génération de rapports de fin de lot (PDF).

## Prérequis

- Le contrôleur HAI-P200-4G

- HAI-OS

- Une variable spécifiquement désignée comme identifiant de lot dans le **Data-Plug**.

## Qu'est-ce que le module Batches ?

Le module Batches reconstruit automatiquement l'historique de vos lots de production en se basant sur les changements de valeur d'une **variable clé** (l'identifiant de lot). Le comportement du système s'adapte intelligemment au type de cette variable :

- **Booléen (0/1)** : Un lot correspond à la période durant laquelle la machine est active (Valeur à 1 ou True). Les périodes à 0 ne sont pas considérées comme des lots.

- **Entier (INT) ou Texte (STRING)** : Chaque nouvelle valeur différente marque le début d'un nouveau lot (ex: passage du numéro de recette "120" à "121", ou d'un code-barres "LOT-A" à "LOT-B").

## Définir la variable de Lot (Batch ID)

Pour que la page Batches se peuple, vous devez d'abord indiquer au système quelle variable écouter :

1.  Rendez-vous dans le menu **Data-Plug > Configuration**.

2.  Dans les paramètres de votre équipement (Modbus, S7, ou OPC-UA), identifiez la variable qui servira de référence pour vos lots.

3.  Cochez la case **Batch ID** située sur la ligne de cette variable. _(Note : une seule variable peut être définie comme Batch ID sur l'ensemble du contrôleur. Cochez cette case sur une nouvelle variable la désactivera sur la précédente)._

![](./batches-1.png)

## Interface et Suivi des Lots

Une fois configurée, la page Batches affiche un tableau de bord listant les lots des 30 derniers jours, du plus récent au plus ancien. Vous y retrouverez :

- **Name (Nom)** : La valeur de l'identifiant du lot. Si la variable est un booléen, le nom sera vide par défaut.

- **Start & End** : Les dates et heures exactes de début et de fin du lot. Si la production est en cours, la mention _(ongoing)_ apparaît.

- **Duration** : La durée exacte du lot calculée automatiquement.

- **Le bouton Éditer (✏️)** : À côté du nom du lot, un petit crayon vous permet de renommer manuellement un lot pour faciliter son identification ultérieure (ex: nommer un cycle booléen "Production Matin").

![](./batches-2.png)

## Analyse d'un Lot dans le Data-Explorer

La force du module Batches réside dans son intégration totale avec l'outil d'analyse graphique :

- Dans la colonne de droite, cliquez sur le bouton **View** d'un lot.

- Vous serez instantanément redirigé vers le **Data-Explorer**, qui s'ouvrira **verrouillé sur la période exacte du lot** (du début à la fin de celui-ci).

- Un indicateur "🔒 Time range locked on batch" apparaîtra pour vous confirmer que vous analysez les données spécifiques de ce cycle de production.

![](./batches-3.png)

## Génération et Consultation des Rapports (PDF)

Si vous avez activé les rapports de lots dans la configuration du système (via la page _Notifications_), un rapport PDF est généré à chaque fin de cycle. Dans la colonne **Report** du tableau :

- **Bouton PDF (📄)** : Permet d'ouvrir et de consulter directement le rapport de fin de lot dans un nouvel onglet.

- **Bouton Rafraîchir (🔄)** : Si le rapport n'a pas été généré, ou si vous souhaitez le recréer après avoir ajouté de nouvelles courbes à votre configuration, cliquez sur ce bouton pour forcer (re)génération manuelle du rapport.

![](./batches-4.png)

## Mode Invité (Guest Access)

Tout comme les Alarmes et le Data-Explorer, la page Batches est compatible avec le mode d'accès libre. Si vous souhaitez qu'un opérateur puisse consulter la liste des lots ou ouvrir leurs rapports PDF sans avoir les droits de configuration :

1.  Allez dans le menu **Security > Password Manager**.

2.  Activez l'interrupteur **Enable Guest Access**.

3.  Depuis la page de connexion, le bouton **← Guest Access** permettra d'accéder au module Batches en toute sécurité.

![](./batches-5.png)
