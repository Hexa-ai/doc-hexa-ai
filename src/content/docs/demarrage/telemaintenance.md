---
title: Accès distant
description: Joindre l'interface de la box et les automates raccordés depuis votre bureau.
sidebar:
  order: 2
---

:::caution[Page d'exemple]
Squelette de mise en page — à remplacer par la procédure réelle.
:::

## Le principe

La box établit elle-même un tunnel sortant. Il n'y a donc **aucun port à
ouvrir** sur le pare-feu du site, et aucune règle entrante à faire valider
par l'IT du client.

<figure class="plain wide">

![Architecture du tunnel entre le poste d'exploitation, le service Tailscale et la box installée en armoire](../../../assets/schema-tailscale.png)

<figcaption>Le schéma porte la classe <code>plain</code> : ni cadre ni fond, puisqu'il est déjà sur fond transparent.</figcaption>
</figure>

## Lien redondant

Le HAI-P200-4G dispose d'un lien filaire et d'un lien 4G LTE. En cas de perte
du lien principal, la bascule est automatique — la télémaintenance reste
disponible pendant l'incident réseau, ce qui est précisément le moment où on
en a besoin.

## Accès invité

Un accès temporaire peut être délivré à un intégrateur tiers sans lui ouvrir
l'ensemble du parc.
