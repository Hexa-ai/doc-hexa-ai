---
title: Mise en service
description: Alimenter le HAI-P200-4G, accéder à l'interface web et vérifier l'état des services.
sidebar:
  order: 1
---

:::caution[Page d'exemple]
Le contenu ci-dessous est un squelette destiné à valider la mise en page.
Il doit être remplacé par la procédure réelle lors de la reprise depuis Odoo.
:::

## Ce dont vous avez besoin

- Une box HAI-P200-4G et son bornier d'alimentation
- Un câble Ethernet
- Un poste sur le même réseau que le port `eth0`

## 1. Alimenter la box

Le raccordement se fait sur le bornier industriel, en respectant la polarité
sérigraphiée. La plage d'alimentation admise est indiquée dans les
[spécifications matérielles](/hardware/specifications/).

Après mise sous tension, le démarrage complet de HAI-OS prend environ une
minute. La LED de statut passe au vert fixe quand les services sont
opérationnels.

## 2. Accéder à l'interface web

L'interface d'administration est servie en HTTPS sur le port 443 du port
Ethernet `eth0`.

![L'écran d'accueil de l'interface HAI-OS](../../../assets/ui-dataplug.png)

Une image en syntaxe Markdown simple, comme celle ci-dessus, est
automatiquement plafonnée à 720 px de large : plein écran sur mobile, sans
étirement inutile sur un 27 pouces.

## 3. Déclarer un premier équipement

Rendez-vous dans **Acquisition → Sources**, puis choisissez le protocole de
votre automate. La configuration d'une source Modbus TCP est détaillée dans
[la page Modbus](/protocols/modbus-tcp/).

<figure class="wide">

![L'explorateur de données, avec la liste des variables historisées](../../../assets/ui-dataexplorer.png)

<figcaption>Capture large : la classe <code>wide</code> autorise 1100 px, pour les vues qui perdent leur sens une fois rétrécies.</figcaption>
</figure>

## Vérifier que tout tourne

| Service | Rôle | Vérification |
| --- | --- | --- |
| Acquisition | Interrogation des équipements | Les variables remontent une valeur datée |
| Historisation | Écriture en base locale | La courbe se remplit dans l'explorateur |
| Lien distant | Tunnel Tailscale | La box apparaît dans votre tailnet |
