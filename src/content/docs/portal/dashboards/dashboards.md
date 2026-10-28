---
title: Tableaux de bord et projets
description: "Créer un tableau de bord pour une box ou un projet, choisir la période, ajouter et régler des blocs, exporter en CSV."
sidebar:
  order: 1
---

Un tableau de bord présente sur une page les informations utiles d'une installation : valeurs, courbes, jauges, alarmes, documents.

![Un tableau de bord de box](./dashboard.png)

## Box ou projet

Un tableau est rattaché :

- à **une box** : ses propres variables ;
- à **un projet** : un groupe de box (un réseau, un site), pour comparer ou cumuler.

La page **Tableaux de bord** les liste par box et par projet.

![Liste des tableaux de bord](./dashboards.png)

### Les projets

La page **Projets** crée les regroupements de box : un nom, une description, puis les box qui en font partie. Une box peut appartenir à plusieurs projets.

![Projets](./projects.png)

![Tableau d'un projet](./dashboard_project.png)

## Période et rafraîchissement

En haut du tableau, choisissez la période : **24 h**, **7 jours**, **30 jours**, **Aujourd'hui**, **Ce mois**, ou une plage personnalisée. Le menu de rafraîchissement met les valeurs à jour automatiquement (de 30 s à 5 min, ou **Arrêt**).

Le bouton **CSV** exporte les données du tableau sur la période affichée.

## Composer un tableau

**Modifier** passe en édition : ajoutez des blocs, réordonnez-les par glisser-déposer, puis **Enregistrer**.

![Ajout d'un bloc](./dashboard_edit.png)

Blocs disponibles :

| Bloc | Usage |
|---|---|
| **Courbe** | Évolution d'une ou plusieurs variables, avec comparaison possible à la période précédente |
| **Barres de consommation** | Compteurs (volumes, énergie) en barres, par intervalle |
| **Tuile valeur** | Une valeur courante en grand |
| **Jauge** | Une valeur entre un minimum et un maximum |
| **Voyant d'état** | Marche / arrêt, défaut, avec couleurs |
| **Créneaux d'états** | Périodes de marche et d'arrêt dans le temps |
| **Tableau min / moy / max** | Synthèse chiffrée de plusieurs variables |
| **Statut** | Connexion et version de la box |
| **Carte** | Localisation |
| **Historique d'alarmes** / **Statistiques d'alarmes** | Alarmes de la période |
| **Documents** | Liens vers des documents de la box |
| **Image** / **Texte** | Schéma, photo, consignes |

Les réglages de chaque bloc (titre, variables, période de comparaison, largeur sur grand écran…) s'ouvrent depuis le bloc en mode édition.
