---
title: "Store & Forward"
description: "Stockage local en SQLite et relais MQTT vers le cloud : structure des topics, format des messages et reprise après coupure."
sidebar:
  order: 1
---

Le Data-Plug intègre une architecture **Store & Forward** robuste. Cette double fonctionnalité permet d'assurer la continuité des données : il **historise** localement les informations reçues tout en étant capable de les **relayer** vers le cloud ou un système central.

En cliquant sur le bouton **Configuration** en haut de la page du Data-Plug, vous accédez à l'interface de gestion de ces deux mécanismes.

![](./store-and-forward-1.png)

## 1. Stockage Local (Store) : Base de données SQLite

Le Data-Plug ne se contente pas de faire transiter les données ; il les sauvegarde localement dans une base de données **SQLite** embarquée. Cela garantit qu'aucune donnée n'est perdue en cas de coupure réseau.

Dans la section **Store & Forward Configuration**, vous pouvez gérer la stratégie d'archivage :

- **DB Path** : Indique l'emplacement du fichier de base de données. Ce chemin est défini automatiquement et n'est pas modifiable. Si une carte microSD est insérée dans l'appareil, la base de données y sera stockée prioritairement.

    - **Note importante :** La prise en compte de la carte microSD se fait au démarrage. Si vous insérez une carte, **un redémarrage de l'appareil est nécessaire** pour que le stockage bascule dessus. En l'absence de carte (ou avant redémarrage), le stockage se fait sur la mémoire interne.

- **Rétention (Retention Days)** : Ce paramètre définit la durée de conservation des données. Les archives plus anciennes que le nombre de jours spécifié seront automatiquement purgées pour libérer de l'espace.

- **Suspendre l'historisation à la volée _(À partir de la version 1.3.0)_ :** Un interrupteur **Historization (On/Off)** est accessible en haut de l'interface. Il vous permet de mettre en pause temporairement l'enregistrement des données locales dans la base SQLite (par exemple pendant une phase de maintenance sur vos équipements), sans avoir à arrêter complètement le service d'acquisition global.

### Protection de la Mémoire Flash (Intervalle de Commit)

Une spécificité importante de la section _Store & Forward_ concerne le paramètre **Commit Interval**.

**Pourquoi ce réglage ?**

Le Data-Plug enregistre les données sur une mémoire Flash. Ce type de mémoire possède un nombre fini de cycles d'écriture avant de s'user.

- Si le système écrivait sur le disque à chaque donnée reçue (par exemple chaque seconde), la mémoire s'userait très rapidement.

- **Le mécanisme de protection** : Le système garde les données en mémoire vive (RAM) et ne réalise l'écriture physique sur le disque (le "commit") qu'à intervalles réguliers. Ce délai est **réglé par défaut à 15 minutes**, mais **il est modifiable** selon vos besoins. Une valeur plus courte sécurise mieux la donnée en cas de coupure de courant, mais sollicite davantage votre support de stockage.

### Exploitation et Visualisation des Données

L'historique des données stockées localement par le Data-Plug est exploitable via les outils disponibles sur nos **PC HAI-Edge** (accessibles depuis le menu "Add-ons") :

- **Data-Explorer (intégré)** — la page Data & Monitoring > Data-Explorer du contrôleur trace directement les variables historisées, en direct ou sur une période choisie, sans rien installer. C'est le chemin normal pour consulter ses courbes.
- **Node-RED (traitements)** — disponible depuis le menu Add-ons, Node-RED permet des traitements plus poussés. Le module Hexa-AI @hexa-ai/node-red-contrib-hexa-ai-edge ajoute un nœud _DataPlug History_ qui interroge la base SQLite du Data-Plug et renvoie des statistiques prêtes à l'emploi (moyennes, min, max, différences de compteurs), enrichies des unités et descriptions déclarées dans le Data-Plug.
- **Grafana** est également proposé dans les Add-ons, mais il est livré tel quel : aucun tableau de bord ni source de données n'est pré-configuré, et il n'a pas accès à la base du Data-Plug. Il s'adresse aux utilisateurs qui alimentent eux-mêmes une base tierce (par exemple l'add-on PostgreSQL, via Node-RED). Ses identifiants — admin et un mot de passe propre à chaque boîtier — se lisent sur la carte de l'add-on.

## 2. Relais vers le Cloud (Forward) : Connecteur MQTT

Le Data-Plug agit comme une passerelle (Gateway) capable de pousser les données vers un broker MQTT externe.

Dans la section **Configuration du Cloud Gateway**, vous configurez ce connecteur de sortie :

- **Compatibilité** : Les données sont transmises via le protocole standard MQTT.

- **Paramètres de connexion** : Vous pouvez spécifier l'adresse de l'hôte, le port, et les identifiants d'authentification (Client ID, User, Password).

- **Identification** : Les champs _Project ID_, _Edge Node ID_ et _Device ID_ permettent de structurer les topics MQTT et d'identifier la source des données.

- **Sécurité** : L'option **TLS** est disponible pour chiffrer les échanges.

## 3. Structure des Topics MQTT

Les topics de publication sont générés automatiquement en suivant une hiérarchie logique basée sur les identifiants configurés dans le Data-Plug :

mqtts/{PROJECT\_ID}/{TYPE\_MESSAGE}/{EDGE\_NODE\_ID}/{DEVICE\_ID}

- **PROJECT\_ID** : Identifiant du projet.

- **TYPE\_MESSAGE** : Type de la trame (DBIRTH pour la configuration, DDATA pour les données).

- **EDGE\_NODE\_ID** : Identifiant du nœud (passerelle).

- **DEVICE\_ID** : Identifiant de l'équipement final.

## 4. Format des Messages (Payload JSON)

Le Data-Plug utilise deux types de messages principaux formatés en JSON.

### A. Message de Configuration (DBIRTH)

Ce message est envoyé au démarrage ou lors d'une reconnexion. Il déclare la liste et le type des variables disponibles. Il est envoyé avec le flag **Retained: True**.

- **Topic** : mqtts/{PROJECT\_ID}/DBIRTH/{EDGE\_NODE\_ID}/{DEVICE\_ID}

- **Exemple de format JSON** :

```
{
  "metrics": [
    {
      "name": "pompe-1/etats",
      "dataType": "Integer"
    },
    {
      "name": "pompe-1/defaut",
      "dataType": "Boolean"
    }
  ]
}
```

- **Champs obligatoires** : name (Nom de la métrique) et dataType (Type de donnée : Integer, Short, Long, Double, Float, Boolean, String).

### B. Message de Données (DDATA)

Ce message contient les valeurs télémétriques en temps réel ou historisées.

- **Configuration** : QoS 1, Retain: False.

- **Topic** : mqtts/{PROJECT\_ID}/DDATA/{EDGE\_NODE\_ID}/{DEVICE\_ID}

- **Exemple de format JSON** :

```
{
  "metrics": [
    {
      "name": "pompe-1/etats",
      "timestamp": 1486144502122,
      "dataType": "Integer",
      "value": 0
    },
    {
      "name": "pompe-1/defaut",
      "timestamp": 1486144502122,
      "dataType": "Boolean",
      "value": false
    }
  ]
}
```

- **Champs supplémentaires** :

    - timestamp (Long) : Horodatage en millisecondes (Epoch).

    - value : La valeur effective de la donnée.
