---
title: "Data-Plug"
description: "Le Data-Plug, moteur d'acquisition de HAI-OS : lecture multi-protocoles, unification par MQTT interne et remontée vers le cloud."
sidebar:
  order: 1
---
![](./data-plug-1.webp)
Index

- 🔙 Configurer l'acquisition de données

- 🔝 Configuration Store & Forward

- 🗨️ Envoyer & recevoir des SMS

## Qu'est-ce que le Data-Plug ?

Le Data-Plug est le moteur d'acquisition et de gestion de données intégré à votre contrôleur HAI-P200-4G (sous HAI-OS).

Il agit comme un hub universel entre vos équipements industriels (OT) et vos applications informatiques ou cloud (IT). Son rôle est de collecter les données brutes, de les standardiser, de les historiser et de les mettre à disposition de l'ensemble de l'écosystème.

## Les 3 Fonctions Clés

### 1. Acquisition Multi-Protocoles

Le Data-Plug interroge simultanément plusieurs types d'équipements grâce à ses connecteurs natifs. Il supporte :

- **Modbus TCP** (automates, variateurs, compteurs…), et le **Modbus RTU** série via la passerelle intégrée du contrôleur
- **OPC-UA** (communication sécurisée et structurée, avec navigateur de serveur intégré)
- **Siemens S7** (communication native avec automates Siemens)
- **BACnet/IP** (équipements de gestion technique du bâtiment — beta)
- **NMEA 0183** (beta) : lecture de trames marines sur le réseau, en client TCP, serveur TCP ou UDP. Un mode écoute affiche le flux entrant et transforme n'importe quel champ reçu en variable en un clic. Un équipement série se raccorde via un convertisseur série ↔ Ethernet externe.
- **Internal MQTT (Node-RED)** : déclarez des variables alimentées par vos propres flux Node-RED, scripts ou supervisions tierces, et faites-les bénéficier de toute la chaîne du Data-Plug

Les connecteurs Modbus, OPC-UA et S7 s'appuient sur l'agent performant Telegraf. BACnet/IP et NMEA 0183 disposent chacun de leur propre collecteur intégré, et Internal MQTT reçoit directement les données publiées sur le broker.

**Position sur une carte** : une variable NMEA peut être déclarée comme une position — un seul canal portant le point GPS d'une trame. Le Data-Explorer affiche alors la trace sur une carte au lieu d'une courbe, sur la période sélectionnée et en direct.

### 2. Unification via MQTT (Le Broker Interne)

Une fois les données collectées, le Data-Plug les convertit et les publie sur le Broker MQTT interne du contrôleur.

Cela signifie que peu importe la source (S7, Modbus, OPC-UA, BACnet ou NMEA), la donnée de sortie est toujours au même format standardisé.

Cette architecture rend les données immédiatement consommables par :

- **Le Data-Explorer** (courbes, comparaisons de périodes, cartes) et les **Rapports et Notifications d'alarmes**, nativement.
- **Node-RED** (pour créer des logiques et des flux de données).
- **Grafana** (pour la visualisation locale, après avoir configuré votre propre source de données).
- **Vos propres applications** (client MQTT).

### 3. Remontée vers le Cloud

Au-delà de l'usage local, le Data-Plug embarque une passerelle cloud (_Cloud Gateway_) qui pousse les données vers une plateforme distante en MQTT, au choix dans deux formats :

- **MQTT (Scorp-IO JSON Format)**
- **MQTT (Reflex-report JSON Format)** — un message par variable, sur son propre topic, avec QoS configurable

C'est cette sortie que le Store & Forward alimente et protège en cas de coupure réseau.

### 4. Services Système & SMS

Le Data-Plug sert aussi d'interface de pilotage pour le contrôleur via MQTT :

- **Gestion SMS** : envoi et réception de SMS via des topics MQTT (permettant à Node-RED d'envoyer des alertes facilement). Les SMS reçus servent également à l'acquittement des alarmes, en répondant « OK » à l'alerte.
- **Contrôle Système** : possibilité de redémarrer (Reboot) ou d'éteindre (Shutdown) le contrôleur via une simple commande MQTT.
- **Historisation** : l'enregistrement des données peut être démarré et arrêté par commande MQTT, en plus de l'interrupteur de l'interface.

## Pourquoi utiliser le Data-Plug ?

**Centralisation** : une seule interface pour gérer toutes vos sources de données.

**Double Rôle de la Base de Données (SQLite)** :

- **Historian Local** : elle stocke les données pour permettre une consultation immédiate de l'historique sur site, depuis le Data-Explorer, sans avoir besoin d'internet.
- **Store & Forward** : elle agit comme une mémoire tampon sécurisée. En cas de coupure réseau vers le Cloud, elle conserve les données et les retransmet automatiquement une fois la connexion rétablie.

**Interopérabilité & Outils natifs** : il casse les silos entre l'atelier (automates, capteurs, GTB) et l'informatique (Node-RED, Cloud). De plus, (à partir de la version 1.3.0), il alimente de façon native les outils intégrés à HAI-OS : le Data-Explorer (pour visualiser vos courbes historiques et vos positions) et le système de Rapports et Notifications d'alarmes.
