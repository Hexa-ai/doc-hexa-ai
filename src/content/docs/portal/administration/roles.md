---
title: Rôles et périmètres
description: "Les quatre rôles de myHexa (lecteur, opérateur, gestionnaire, administrateur) et les trois périmètres (toute l'entreprise, des projets, des box) : qui peut faire quoi."
sidebar:
  order: 0
---

Chaque personne qui accède au portail a un **rôle** (ce qu'elle peut faire) et un **périmètre** (sur quoi elle peut le faire).

## Les quatre rôles

Les rôles **s'additionnent** : chacun reprend tout ce que permet le précédent.

<img class="hai-anim" src="/portal/anim/roles.svg" alt="Animation : quatre barres de plus en plus longues, Lecteur, Opérateur, Gestionnaire, Administrateur ; chaque rôle reprend le précédent et ajoute des droits" loading="lazy">

| Rôle | Ce qu'il permet |
|---|---|
| **Lecteur** | Consulte : mesures, alarmes, tableaux de bord, documents. N'acquitte pas les alarmes, n'envoie aucune commande, ne modifie rien. |
| **Opérateur** | Comme le lecteur, et **acquitte les alarmes** et **envoie des commandes** sur les box où le pilotage est activé. Ne modifie ni synoptiques, ni tableaux, ni documents, ni réglages d'alarmes. |
| **Gestionnaire** | Comme l'opérateur, et **modifie** synoptiques, tableaux de bord et documents de son périmètre, et gère les abonnements d'alarme des box de son périmètre. Ni utilisateurs, ni abonnements commerciaux, ni réglages d'alarmes de l'entreprise (détail ci-dessous). |
| **Administrateur** | Toute l'entreprise : utilisateurs, abonnements, réglages (dont ceux des alarmes). Jamais restreint. |

## Les trois périmètres

| Périmètre | Ce que la personne voit |
|---|---|
| **Toute l'entreprise** | Toutes les box, y compris celles ajoutées ensuite. |
| **Des projets** | Les box des projets choisis, présentes et à venir, avec leurs synoptiques, tableaux de bord et documents. |
| **Des box** | Seulement les box cochées. |

Un administrateur couvre toujours l'entreprise entière. Le périmètre limite aussi ce que peut modifier un gestionnaire : seulement dans les projets ou les box qui lui sont confiés.

## Ce que peut modifier un gestionnaire

Dans son périmètre, un gestionnaire modifie ce que modifie un administrateur, sauf ce qui touche à l'entreprise elle-même :

| Action | Gestionnaire | Administrateur |
|---|---|---|
| Synoptiques | Oui | Oui |
| Tableaux de bord, y compris l'**affichage permanent (écran mural)** | Oui : tableaux des projets et des box de son périmètre | Oui |
| Documents (ajouter, modifier, supprimer) | Oui : documents des box et des projets de son périmètre | Oui |
| Abonnements d'alarme et de perte de liaison, envoi aux box, escalade, copie vers d'autres box, **Maintenance** des alertes | Oui : sur les box de son périmètre | Oui |
| Personnes à prévenir **sans accès au portail** (ajout, modification, suppression) | Oui | Oui |
| Réglages d'alarmes de l'entreprise (délai de perte de liaison, qui reçoit, récapitulatif d'état) et **Importer depuis les box** | Non | Oui |
| Utilisateurs, rôles, invitations et partages (**Destinataires ▸ Accès portail**) | Non | Oui |
| Projets : création, paramètres, suppression | Non | Oui |
| **Mon entreprise**, mises à jour des box, abonnements | Non | Oui |

Selon le périmètre du gestionnaire :

- **Toute l'entreprise** : toutes les box et tous les projets, ainsi que l'espace **Général** des documents ;
- **Des projets** : les projets choisis et leurs box (pas l'espace Général) ;
- **Des box** : les box cochées seulement, pour leurs documents, leurs tableaux et leurs abonnements d'alarme ; un projet n'est pas modifiable avec ce périmètre.

L'interface n'affiche les boutons de modification que là où le portail les accepte.

## Ce que chaque rôle voit dans le menu

- **Tous les rôles** : Projets, Carte, Alarmes, Interventions, et dans **Administration** : Destinataires (les réglages d'alarmes se consultent ; un gestionnaire les modifie sur les box de son périmètre), Mises à jour et, dès qu'un abonnement est visible, Mes abonnements.
- **Administrateur** : en plus, la gestion des utilisateurs et des partages (**Destinataires ▸ Accès portail**), **Mon entreprise**, le lancement des mises à jour et les réglages d'alarmes de l'entreprise.

## Personnes extérieures à l'entreprise

Un sous-traitant, un client final ou un bureau d'études n'a pas besoin d'un compte dans votre entreprise : vous lui **partagez** un projet, une box, un synoptique ou un tableau, avec le rôle de votre choix. Voir [Partager avec une personne extérieure](/portal/administration/external-sharing/).

## Donner un rôle

Les rôles et périmètres se choisissent à l'invitation ou depuis la liste des utilisateurs : voir [Utilisateurs et accès](/portal/administration/users/).
