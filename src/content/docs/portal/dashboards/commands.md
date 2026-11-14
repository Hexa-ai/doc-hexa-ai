---
title: Direct, météo et commandes
description: "Les blocs récents des tableaux de bord : passer en direct, afficher la météo d'une box, et envoyer des commandes à l'automate (bêta) avec confirmation et relecture."
sidebar:
  order: 4
---

## Le mode Direct

Par défaut, les valeurs d'une box sont relevées toutes les 30 minutes. Le bouton **Direct**, en haut d'un tableau, les rafraîchit **toutes les 1 à 2 secondes pendant 15 minutes**, puis le tableau revient au rythme normal. Un message indique l'âge de la dernière valeur et le temps restant.

Pour un écran mural, cochez **affichage permanent** en mode édition : les valeurs sont mises à jour toutes les 10 secondes environ, sans limite de durée (**Direct · permanent**).

## Le bloc Météo

Le bloc **Météo** affiche la météo à l'**adresse de la box** : maintenant, prochaines 24 heures ou 5 jours, avec les informations de votre choix. Elle est relevée par le portail toutes les 15 minutes. Sans adresse, le bloc l'indique : « renseignez son adresse dans sa fiche ».

## Le bloc Commande (bêta)

:::note[Fonction en version bêta]
L'envoi de commandes vers l'automate évolue encore.
:::

Le bloc **Commande** envoie une consigne ou un ordre de marche/arrêt à l'automate d'une box.

**Le préparer** (gestionnaire ou administrateur) : en mode édition, **+ Bloc ▸ Commande (bêta)**, puis choisissez la **box pilotée** et, pour chaque champ, la **variable écrivable** annoncée par la box. Selon le type de champ, réglez le libellé, les bornes **Min** / **Max**, le **Pas**, l'unité, les décimales, ou les libellés et valeurs « marche » / « arrêt », ou la valeur d'un bouton. **Demander confirmation avant l'envoi** ajoute une étape de validation. **Enregistrez** le tableau pour activer la commande.

**L'utiliser** (opérateur et au-delà) : saisissez la valeur, **Envoyer** (et confirmez si demandé). La box écrit la valeur dans l'automate puis la **relit** : le bloc affiche **Appliquée · relu : …**, ou **Non appliquée** si l'automate est resté à une autre valeur, ou « La box n'a pas répondu à temps ».

Deux conditions : le **pilotage à distance** doit être activé pour votre entreprise et pour l'équipement (sinon le bloc indique « Pilotage à distance désactivé… » ou « Pilotage coupé pour cet équipement »), et la box doit avoir annoncé des variables écrivables. Un **lecteur** ne peut pas envoyer de commande.
