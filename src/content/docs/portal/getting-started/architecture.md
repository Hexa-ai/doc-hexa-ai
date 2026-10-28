---
title: Fonctionnement du portail
description: "Comment les box HAI-P200 et le portail myHexa se répartissent le travail : collecte, transmission, stockage, alarmes, sécurité."
sidebar:
  order: 1
---

Le portail ne remplace pas la box : chacun a son rôle.

## Qui fait quoi

| | **Box HAI-P200** (sur site) | **Portail myHexa** (en ligne) |
|---|---|---|
| Mesures | Lit les automates et capteurs, historise localement | Affiche l'état en direct et l'historique de tout le parc |
| Alarmes | Détecte les alarmes et **prévient elle-même** ses destinataires | Affiche les alarmes, envoie une notification sur l'application |
| Configuration | Variables, protocoles, réseau | Destinataires d'alarme, tableaux de bord, rapports |

Ce partage est volontaire : **le renvoi des alarmes est assuré par la box**, au plus près de l'installation. Une coupure du portail ou d'internet entre le portail et vous ne bloque donc pas l'envoi des alarmes par la box.

## Le trajet des données

1. Les **automates et capteurs** sont lus par la **box HAI-P200**, sur site.
2. La box transmet ses données au **portail myHexa** en HTTPS, par la 4G ou le réseau du site.
3. Vous consultez le portail depuis un **navigateur** ou l'**application** sur téléphone. Le portail envoie aussi les **rapports PDF** par e-mail.

En parallèle, la box envoie elle-même les **alarmes** à ses destinataires (mail, SMS, appel selon sa configuration).

- **En direct** : chaque box envoie régulièrement son statut (valeurs courantes, alarmes actives). Une box est affichée **en ligne** si elle a donné des nouvelles dans l'heure.
- **Historique** : la box transmet ses enregistrements par lots. L'historique du portail se remplit donc avec un léger différé par rapport au direct.
- **Rapport journalier** : une synthèse par jour (alarmes, compteurs), qui alimente l'historique des alarmes et les rapports.

La box initie toujours la connexion vers le portail : aucun port n'est à ouvrir sur le réseau du site.

## Vos données

- **Hébergement en Europe** : la base de données et les fichiers sont hébergés dans l'Union européenne (Irlande).
- **Cloisonnement** : chaque entreprise ne voit que ses box. Un utilisateur ne voit que les box auxquelles il a accès (voir [Utilisateurs et accès](/portal/administration/users/)).
- **Chiffrement** : tous les échanges, box comme navigateur, passent en HTTPS.
- **Partage maîtrisé** : un tableau partagé avec une autre entreprise l'est en lecture seule, et rien d'autre de votre compte n'est visible (voir [Partager un tableau](/portal/dashboards/sharing/)).
