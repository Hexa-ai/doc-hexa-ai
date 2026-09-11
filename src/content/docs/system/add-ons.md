---
title: "Add-ons"
description: "Installer, démarrer et administrer les applications embarquées : catalogue, identifiants, sauvegarde, versions, désinstallation et limites."
sidebar:
  order: 3
---

Les **add-ons** sont les applications embarquées que le boîtier peut faire
tourner à côté du firmware : Node-RED, Grafana, Ignition, PostgreSQL et pgAdmin.
Chacune tourne dans son propre conteneur, isolée du reste du système, et se pilote
entièrement depuis la page **Add-ons** de l'interface — aucune ligne de commande
n'est nécessaire.

Aucun add-on n'est démarré par défaut : vous n'installez que ce dont vous avez
besoin, ce qui laisse les ressources du boîtier aux autres.

<!-- CAPTURE A VENIR — la page Add-ons complete, avec les cartes des cinq
     applications et au moins une carte en Online. C'est la seule vue
     d'ensemble de la page. Deposer le fichier add-ons-1.png a cote de cette
     page, puis remplacer ce commentaire par la ligne ci-dessous.

![Page Add-ons de HAI-OS : les cartes Node-RED, Grafana, Ignition, PostgreSQL et pgAdmin, avec leur statut](./add-ons-1.png)
-->

## 1. Le catalogue

| Add-on | À quoi ça sert | Accès | Versions au choix |
|---|---|---|---|
| **Node-RED** | Automatisation et passerelle de protocoles (Modbus, BACnet, MQTT…). Le cœur de la plupart des installations. | `/node-red/` sur l'interface | 4.0.9, 4.1.13, 5.0.4 |
| **Grafana** | Tableaux de bord et courbes à partir des données collectées. | port `3000` | version fixe |
| **Ignition** | Plateforme SCADA Inductive Automation, édition Edge. | port `8088` | 8.1.47, 8.1.54, 8.3.8 |
| **PostgreSQL** | Base de données relationnelle, pour l'historisation. | port `5432` | version fixe |
| **pgAdmin** | Interface web d'administration de PostgreSQL. | port `5050` | version fixe |

Les applications sont fournies telles quelles, packagées avec le contrôleur.
Hexa-AI n'assure pas le support de leur contenu applicatif (flux, tableaux de
bord, requêtes).

## 2. Installer et démarrer

Chaque carte propose quatre boutons :

- **Start** — installe l'add-on s'il ne l'est pas encore, puis le démarre. Au
  premier lancement, l'image est **téléchargée depuis internet** : comptez de
  quelques minutes à une dizaine selon le débit (une image Ignition pèse
  plusieurs Go). Un message vous le signale, laissez la page ouverte.
- **Stop** — arrête le conteneur. Les données sont conservées.
- **Logs** — affiche les journaux de l'application, utile pour comprendre un
  démarrage qui échoue.
- **Open** — ouvre l'interface web de l'application dans un nouvel onglet.

Le statut affiché sous le nom se rafraîchit tout seul : ⏳ Starting, 🟢 Online,
🔴 Stopped.

:::caution
**Une connexion internet est indispensable pour la première installation** et
pour tout changement de version. Une fois l'image téléchargée, l'add-on démarre
et fonctionne hors ligne.
:::

## 3. Le menu ⋮ de chaque carte

<!-- CAPTURE A VENIR — une carte d'add-on avec le menu a trois points deroule
     (Node-RED ou Grafana), pour montrer les entrees Credentials, Backup,
     Restore, Version et Uninstall. Deposer le fichier add-ons-2.png a cote de
     cette page, puis remplacer ce commentaire par la ligne ci-dessous.

![Carte d'un add-on avec son menu à trois points déroulé : Credentials, Backup, Restore, Version et Uninstall](./add-ons-2.png)
-->

### Credentials

Affiche l'identifiant et le mot de passe de l'application. **Ces mots de passe
sont uniques à votre boîtier** : ils sont générés à sa première mise sous
tension, ne figurent dans aucun manuel et ne sont partagés avec aucun autre
appareil. C'est le seul endroit où les consulter — le mot de passe est masqué par
défaut, un bouton le révèle et un autre le copie.

Node-RED n'a pas de compte propre : il est protégé par votre session sur
l'interface du boîtier.

:::note
Les add-ons installés avant la version 1.3.8 peuvent garder un ancien mot de
passe. Le cas est détaillé dans [Sécurité](/system/security/).
:::

### Backup / Restore

**Backup** produit une archive `.tar.gz` de toutes les données de l'application
(flux Node-RED, tableaux de bord Grafana, projet Ignition, base PostgreSQL…),
téléchargée sur votre poste. À faire avant toute intervention importante.

**Restore** réinjecte une archive précédemment téléchargée.

:::caution
**Les données existantes sont écrasées** par une restauration : l'opération est
irréversible.
:::

### Version

Pour Node-RED et Ignition, vous pouvez choisir la version de l'application. La
nouvelle image est téléchargée au démarrage suivant (internet requis), et si
l'add-on est déjà en ligne il redémarre immédiatement.

Vos données sont conservées lors d'un changement de version — mais **une version
plus ancienne peut refuser de relire des données écrites par une plus récente**.
Faites un backup avant de revenir en arrière.

### Uninstall

Arrête l'add-on et **supprime les images téléchargées pour récupérer de l'espace
disque**. C'est le bon réflexe après un changement de version : l'ancienne image
reste sinon sur le disque.

Un interrupteur **« Also delete saved data »** est proposé :

- **désactivé** (par défaut) : flux, tableaux de bord et réglages sont conservés
  et repris à la réinstallation ;
- **activé** : ils sont détruits, sans récupération possible en dehors d'un
  backup.

Réinstaller implique de retélécharger l'image, donc d'avoir internet.

## 4. Le mode Safe de Node-RED

La carte Node-RED porte un interrupteur **Safe Mode**. Activé, Node-RED démarre
avec ses flux **chargés mais non exécutés** : l'éditeur s'ouvre normalement et
vous pouvez corriger le flux fautif, sans qu'il tourne.

C'est la porte de sortie quand un flux fait boucler ou saturer le boîtier.
Une fois la correction faite, désactivez l'interrupteur et redémarrez l'add-on
avec **Stop** puis **Start**.

## 5. Où sont stockées les données

En haut de la page, une ligne indique où Podman — le moteur de conteneurs —
entrepose les images et les données des add-ons.

Si une carte micro SD est présente et formatée en **ext4**, tout y est stocké, ce
qui préserve la mémoire interne du boîtier. Une carte formatée en exFAT ou FAT32
**ne peut pas** héberger les conteneurs : le boîtier bascule alors sur son disque
interne et l'affiche explicitement en orange sous le chemin.

Surveillez l'espace disponible : chaque version d'image déjà téléchargée occupe
de la place jusqu'à ce qu'un **Uninstall** la libère.

## 6. Limites à connaître

- **Node-RED ne peut pas ouvrir un port inférieur à 1024** — Modbus/TCP en
  écoute sur le port 502, en particulier, ne fonctionnera pas. Les ports 1880
  (éditeur) et 47808 (BACnet) ne sont pas concernés. Cette restriction est
  volontaire : elle empêche un flux d'obtenir les droits administrateur du
  boîtier.
- **Les ressources de Node-RED sont plafonnées** (768 Mo de mémoire, 2 cœurs sur
  4). Un flux qui s'emballe est arrêté par ce plafond au lieu de faire tomber
  tout le boîtier.
- Le boîtier n'a **que 4 Go de mémoire** : faire tourner Ignition, Grafana,
  PostgreSQL et pgAdmin simultanément n'est pas réaliste. Démarrez ce dont vous
  vous servez.

:::tip
Node-RED dispose d'un module Hexa-AI qui lit l'historique du Data-Plug. Voir
[Node-RED](/integration/node-red/).
:::
