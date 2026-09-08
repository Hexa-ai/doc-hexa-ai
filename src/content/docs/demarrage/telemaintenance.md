---
title: Acces distant
description: Joindre l'interface de la box et les automates raccordes depuis votre bureau.
sidebar:
  order: 2
---

:::caution[Page d'exemple]
Squelette de mise en page — a remplacer par la procedure reelle.
:::

## Le principe

La box etablit elle-meme un tunnel sortant. Il n'y a donc **aucun port a
ouvrir** sur le pare-feu du site, et aucune regle entrante a faire valider
par l'IT du client.

<figure class="plain wide">

![Architecture du tunnel entre le poste d'exploitation, le service Tailscale et la box installee en armoire](../../../assets/schema-tailscale.png)

<figcaption>Le schema porte la classe <code>plain</code> : ni cadre ni fond, puisqu'il est deja sur fond transparent.</figcaption>
</figure>

## Lien redondant

Le HAI-P200-4G dispose d'un lien filaire et d'un lien 4G LTE. En cas de perte
du lien principal, la bascule est automatique — la telemaintenance reste
disponible pendant l'incident reseau, ce qui est precisement le moment ou on
en a besoin.

## Acces invite

Un acces temporaire peut etre delivre a un integrateur tiers sans lui ouvrir
l'ensemble du parc.
