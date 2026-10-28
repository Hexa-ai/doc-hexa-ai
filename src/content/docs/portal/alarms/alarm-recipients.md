---
title: Destinataires d'alarme
description: "Choisir, box par box, les personnes que la box prévient en cas d'alarme, leurs canaux et l'escalade, puis envoyer la configuration aux box."
sidebar:
  order: 2
---

Ce sont **les box qui préviennent** les personnes en cas d'alarme. Le portail sert à régler, au même endroit pour tout le parc, **qui** chaque box prévient et **comment**. Il envoie ensuite ces réglages aux box.

![Destinataires d'alarme](./alarm_recipients.png)

:::note
Cet écran est réservé aux administrateurs. Il s'appuie sur les box dont la version le permet : la colonne de chaque box indique si elle est compatible.
:::

## Les personnes

**+ Personne** ajoute quelqu'un à prévenir : nom, e-mail, téléphone. Une personne d'astreinte n'a pas forcément besoin d'un accès au portail :

- **Accès au portail : oui** : elle est invitée comme lecteur ou administrateur ;
- **Accès au portail : non** : elle reçoit seulement les alarmes des box qui la préviennent.

**Importer depuis les box** reprend les destinataires déjà configurés sur les box.

## Affecter les personnes aux box

- Vue **Par box** : pour chaque box, la liste des personnes prévenues, leurs canaux (**mail**, **SMS**, **appel**) et les types d'alarme reçus (error, warning, info).
- Vue **Tableau** : toutes les box et toutes les personnes, pour un réglage en masse.
- **Copier les destinataires** d'une box vers d'autres box.

## Escalade

Pour une box, l'escalade prévient les personnes **par niveaux** : chaque niveau a son délai ; si l'alarme est toujours là une fois le délai écoulé, le niveau suivant est prévenu. Sans escalade, toutes les personnes sont prévenues immédiatement.

## Envoyer aux box

Les modifications ne prennent effet qu'une fois **envoyées** à la box. L'état de synchronisation de chaque box indique si elle a bien reçu ses destinataires.
