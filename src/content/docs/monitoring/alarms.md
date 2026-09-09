---
title: "Alarmes"
description: "Suivre les alarmes en direct ou dans l'historique, filtrer, analyser la cause racine et ouvrir un accès invité."
sidebar:
  order: 3
---


Bienvenue dans ce guide de prise en main de la page **Alarmes**. Ce module centralise la surveillance de votre installation en affichant l'état de vos alertes, leur historique de déclenchement, et intègre un outil puissant d'Analyse de Cause Racine (RCA) pour vous aider à comprendre rapidement l'origine d'un défaut.

## Prérequis

- Le contrôleur HAI-P200-4G

- HAI-OS

- Des variables préalablement configurées avec la catégorie **Alarm** dans le Data-Plug.

## Modes de visualisation : Live & Historique

L'interface de suivi des alarmes est divisée en deux modes de fonctionnement principaux, accessibles via l'interrupteur situé en haut de la page.

### 1. Le mode Live (Temps Réel)

Ce mode vous permet de visualiser instantanément les alarmes **actuellement actives** sur votre système.

- Il se connecte en temps réel au flux de données (MQTT) pour une réactivité maximale.

- Seules les alarmes à l'état ON y sont listées. Dès qu'une alarme repasse à l'état normal (OFF), elle disparaît de cet écran.

![](./alarms-1.png)

### 2. Le mode Historical (Historique des transitions)

Ce mode interroge la base de données du contrôleur pour retracer l'historique des changements d'états (passages de OFF à ON, et inversement).

- **Period (Période)** : Un menu déroulant vous permet de sélectionner la fenêtre de temps à analyser (des 10 dernières minutes jusqu'au mois dernier).

- **Custom (Personnalisé)** : En sélectionnant _Custom_, vous pouvez définir manuellement une date et heure de début et de fin.

- Cliquez sur le bouton de rafraîchissement (🔄) pour actualiser la liste selon la période choisie.

![](./alarms-2.png)

## Filtrage et Recherche

Pour vous aider à naviguer parmi vos données, surtout lors d'épisodes critiques générant de nombreuses alertes, la page dispose de filtres rapides :

- **Barre de recherche (Search...)** : Tapez un mot-clé pour filtrer instantanément le tableau en fonction du nom de l'alarme ou de sa description.

- **Filtres par criticité** : Cochez ou décochez les cases **Error** (Rouge), **Warning** (Orange) et **Info** (Bleu) pour masquer les événements qui ne vous intéressent pas dans l'immédiat.

:::tip
**Information visuelle** : Dans le tableau, les lignes sont entièrement colorées en fonction de leur niveau de criticité pour attirer votre attention sur les défauts "Error" en priorité.
:::

## L'Analyse de Cause Racine (RCA) intégrée

C'est la fonctionnalité phare de cette page. Lorsqu'une alarme se déclenche, il est souvent difficile de savoir quel paramètre physique (pression, température, débit...) en est la cause. L'outil RCA automatise cette recherche.

Dans le mode **Historical**, pour chaque événement correspondant à un déclenchement d'alarme (passage à l'état ON), vous trouverez un bouton en forme de **loupe (🔍)** dans la colonne _RCA_.

En cliquant dessus, une fenêtre d'analyse s'ouvre, calculant les variations des 30 minutes précédant le défaut :

1.  **Top Impacted Variables** : Un tableau liste le **Top 5 des variables** de votre système (Catégorie Measure) ayant subi la plus forte variation anormale juste avant le déclenchement. _(Note : le système filtre le bruit de fond et n'affiche que les variables ayant un impact supérieur ou égal à 5%)_. Une tendance y est indiquée (🔴 Anomalie forte, 🟠 Anomalie modérée, etc.).

2.  **Courbes de tendances** : Un graphique interactif affiche les courbes des 3 variables les plus impactées sur cette fenêtre de 30 minutes.

3.  **Graphique d'état** : Un graphique en escalier situé juste en dessous montre le moment exact où l'alarme a basculé à ON, vous permettant de faire le lien visuel entre le comportement des mesures et la panne.

![](./alarms-3.png)

## Mode Invité (Guest Access)

La page des Alarmes fait partie des pages exposables en libre accès, sans authentification. Un invité y dispose de toutes les fonctionnalités de consultation décrites ci-dessus : les modes Live et Historical, les filtres, la sélection de période et l'Analyse de Cause Racine.

Pour l'activer, consultez la documentation 👀 Accès Invité (Guest Access)
