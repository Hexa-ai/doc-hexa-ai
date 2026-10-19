---
title: "Cloisonner ses passerelles sur Tailscale"
description: "Une politique d'accès Tailscale à coller une seule fois : vos techniciens voient toutes les passerelles, une passerelle ne voit jamais les autres. Ensuite, chaque nouvelle passerelle est cloisonnée d'office."
sidebar:
  order: 3
---

Un intégrateur installe en général une passerelle HAI-P200-4G par machine ou par site client, toutes reliées au **même réseau Tailscale** (le « tailnet »). Ces clients peuvent être concurrents : il faut donc que vos techniciens joignent toutes les passerelles, mais **qu'une passerelle, ou un équipement du réseau usine derrière elle, ne puisse jamais rebondir vers une autre**.

Or un tailnet neuf est créé avec une règle **« tout le monde voit tout »** : tous les appareils du tailnet se joignent entre eux. Cette page remplace cette règle par une politique cloisonnée, **à coller une seule fois**. Ensuite, il suffit d'enrôler chaque nouvelle passerelle avec la bonne clé : le cloisonnement s'applique tout seul, sans retoucher la politique.

## Le principe : une étiquette pour les équipements

Tailscale distingue deux sortes d'identités :

- les **utilisateurs** (vos techniciens, sur leur PC ou leur téléphone), identifiés par leur compte ;
- les **équipements**, identifiés par une **étiquette** (*tag*). Ici, une seule : `tag:hai-box`.

La politique dit simplement :

1. les utilisateurs du tailnet peuvent joindre les passerelles étiquetées `tag:hai-box`, ainsi que les réseaux usine qu'elles exposent ;
2. **rien n'autorise une passerelle à joindre quoi que ce soit**. Tailscale refusant tout ce qui n'est pas explicitement autorisé, une passerelle ne peut ni joindre une autre passerelle, ni joindre le PC d'un technicien, ni servir de rebond à un équipement de son réseau usine.

Les sous-réseaux annoncés par les passerelles sont en plus **approuvés automatiquement** : plus besoin de passer par **Edit** dans la console à chaque nouvelle passerelle.

## Étape 1 — Coller la politique (une seule fois)

Dans la console Tailscale, ouvrez **Access controls**, passez en **JSON editor**, remplacez tout le contenu par le modèle ci-dessous, puis cliquez sur **Save**.

```jsonc
{
  // Qui peut poser l'étiquette « équipement » : les administrateurs du tailnet.
  "tagOwners": {
    "tag:hai-box": ["autogroup:admin"],
  },

  "grants": [
    // 1. Les utilisateurs du tailnet joignent toutes les passerelles (interface web, SSH, ports redirigés).
    {
      "src": ["autogroup:member"],
      "dst": ["tag:hai-box"],
      "ip":  ["*"],
    },
    // 2. ... et les réseaux usine exposés par les passerelles (mode Subnet Route).
    {
      "src": ["autogroup:member"],
      "dst": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"],
      "ip":  ["*"],
    },
    // 3. Chaque utilisateur joint ses propres appareils (facultatif).
    {
      "src": ["autogroup:member"],
      "dst": ["autogroup:self"],
      "ip":  ["*"],
    },
    // Aucune règle ne part de tag:hai-box : une passerelle ne peut rien joindre.
  ],

  // Les sous-réseaux privés annoncés par une passerelle sont approuvés d'office.
  "autoApprovers": {
    "routes": {
      "10.0.0.0/8":     ["tag:hai-box"],
      "172.16.0.0/12":  ["tag:hai-box"],
      "192.168.0.0/16": ["tag:hai-box"],
    },
  },

  // Garde-fou : la sauvegarde est refusée si une future modification
  // autorisait une passerelle à en joindre une autre ou un réseau usine.
  "tests": [
    {
      "src":  "tag:hai-box",
      "deny": ["tag:hai-box:80", "tag:hai-box:443", "tag:hai-box:22", "192.168.1.10:502"],
    },
  ],
}
```

:::caution
Coller ce modèle **remplace** la règle « tout le monde voit tout ». Si votre tailnet contient déjà d'autres serveurs ou appareils partagés, ajoutez leurs règles avant de sauvegarder. La console affiche un aperçu des accès (**Preview rules**) avant l'enregistrement : vérifiez-le.
:::

## Étape 2 — Enrôler chaque passerelle avec une clé étiquetée

C'est la seule chose à faire à chaque nouvelle passerelle.

1. Dans la console, **Settings > Keys > Generate auth key**.
2. Activez **Tags** et choisissez `tag:hai-box`.
3. Laissez **Reusable** décoché (une clé par passerelle) et une durée de validité courte.
4. Collez la clé dans la page **VPN Tailscale** de la passerelle, comme décrit dans [VPN Tailscale](/network/tailscale-vpn/), puis **Apply**.

La passerelle apparaît dans la console avec l'étiquette `tag:hai-box`. Elle est cloisonnée immédiatement, et son sous-réseau est approuvé sans intervention.

:::tip
Une passerelle étiquetée n'appartient plus à aucun utilisateur : elle reste connectée si le technicien qui l'a installée quitte l'entreprise, et **sa clé n'expire plus** (Tailscale désactive l'expiration des clés pour les appareils étiquetés). Plus de passerelle qui décroche au bout de 180 jours.
:::

Une passerelle déjà enrôlée sans étiquette : dans la console, menu **⋯ > Edit ACL tags** sur la ligne de la passerelle, ajoutez `tag:hai-box`, puis réenrôlez-la avec une clé étiquetée pour que l'expiration soit désactivée.

## Donner accès à un client à sa seule passerelle

Votre client final veut se connecter à sa machine, et seulement à la sienne ? Ne l'invitez pas comme utilisateur du tailnet : il verrait toutes les passerelles. **Partagez-lui la passerelle** : dans la console, menu **⋯ > Share** sur la ligne de la passerelle, puis envoyez-lui le lien. Il la rejoint depuis son propre compte Tailscale et ne voit qu'elle.

Le partage donne accès à la passerelle elle-même, pas aux sous-réseaux qu'elle expose : pour que le client atteigne un équipement de sa machine (IHM, automate), utilisez une règle de [Port Forwarding](/network/tailscale-vpn/#port-forwarding).

## Deux sites avec le même plan d'adressage

Deux machines sur `192.168.1.0/24` ne peuvent pas être exposées toutes les deux en mode Subnet Route : Tailscale ne saurait pas laquelle joindre. Dans ce cas, passez ces passerelles en mode **Port Forwarding** : on joint alors chaque équipement par l'adresse Tailscale de sa passerelle, sans conflit d'adresses. Le cloisonnement reste le même.

## Vérifier

- Depuis votre PC : l'interface web de chaque passerelle répond sur son adresse Tailscale.
- Depuis une passerelle (en SSH) : l'adresse Tailscale d'une autre passerelle **ne répond pas**.
- Dans la console, **Access controls > Preview rules**, choisissez une passerelle : la liste des destinations autorisées est vide.
