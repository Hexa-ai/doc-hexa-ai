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

- **DB Path** : champ automatique, non modifiable.

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

## 2. Relais vers le Cloud (Forward) : connecteur de sortie MQTT

Le Data-Plug agit comme une passerelle (Gateway) capable de pousser les données historisées vers un broker MQTT externe. Dans la section **Cloud Gateway Configuration**, vous choisissez d'abord le format de sortie, puis vous renseignez les paramètres de connexion.

**Principe Store & Forward :** chaque valeur historisée est marquée « à transmettre ». Tant que le broker est joignable, les valeurs partent au fil de l'eau, environ une fois par seconde. En cas de coupure réseau, elles restent en attente dans la base locale et sont transmises dans l'ordre chronologique dès que la connexion revient. Aucune valeur n'est perdue, dans la limite de la durée de rétention. Le compteur **Unforwarded**, en haut de la page du Data-Plug, indique le nombre de valeurs en attente d'envoi.

### Deux formats de sortie

Le premier champ, **Driver**, détermine le format des messages et les champs affichés en dessous :

- **MQTT (Scorp-IO JSON Format)** : format attendu par la plateforme Scorp-IO. Les valeurs sont regroupées par lots dans un message unique, dont le topic est construit à partir de trois identifiants (voir section 3).
- **MQTT (Reflex-report JSON Format)** : format attendu par Reflex-report. Chaque variable est publiée sur son propre topic, sous un topic de base que vous choisissez (voir section 4).
- **None** : aucun relais. Le Data-Plug se contente d'historiser localement.

### Paramètres de connexion communs

Quel que soit le format choisi :

- **Host** et **Port** : adresse du broker MQTT. Le port par défaut est 1883 (généralement 8883 avec TLS).
- **Client ID** : identifiant présenté au broker. Chaque boîtier doit utiliser un Client ID distinct, sinon le broker déconnecte l'un au profit de l'autre.
- **Username** et **Password** : identifiants d'authentification. Ils ne sont utilisés que si les deux champs sont renseignés.
- **Use TLS** : chiffre les échanges avec le broker. Activé par défaut. Le certificat du broker doit être émis par une autorité de certification reconnue ; un certificat auto-signé n'est pas accepté.

Cliquez sur **Save** pour appliquer. Le format de sortie, l'hôte, le port, les identifiants Scorp-IO, le base topic et la QoS sont pris en compte immédiatement. Un changement de Client ID, de Username, de Password ou de l'option Use TLS, ainsi que le passage à None, ne prennent effet qu'après un redémarrage du boîtier. L'état de la connexion est visible en haut de la page du Data-Plug.

## 3. Format Scorp-IO

### Identifiants

Trois champs identifient la source des données auprès de Scorp-IO :

- **Project ID** : identifiant du projet Scorp-IO.
- **Edge Node ID** : identifiant du nœud, c'est-à-dire du boîtier passerelle.
- **Device ID** : identifiant de l'équipement final dont proviennent les variables.

Ces trois valeurs doivent correspondre à ce qui est déclaré côté Scorp-IO : ce sont elles qui composent les topics de publication.

### Topics

Les topics sont générés automatiquement à partir des identifiants :

```
mqtts/{PROJECT_ID}/{TYPE_MESSAGE}/{EDGE_NODE_ID}/{DEVICE_ID}
```

Le préfixe `mqtts` est fixe. `TYPE_MESSAGE` vaut `DBIRTH` pour le message de connexion et `DDATA` pour les données.

### Message de connexion (DBIRTH)

Publié à chaque connexion ou reconnexion au broker, avec le flag **Retained**, sur le topic `mqtts/{PROJECT_ID}/DBIRTH/{EDGE_NODE_ID}/{DEVICE_ID}`.

Dans la version actuelle, le tableau `metrics` de ce message est vide : la liste des variables n'y est pas déclarée.

```json
{
  "metrics": []
}
```

### Message de données (DDATA)

Publié en **QoS 1**, sans flag Retained, sur le topic `mqtts/{PROJECT_ID}/DDATA/{EDGE_NODE_ID}/{DEVICE_ID}`. Un message regroupe jusqu'à 1 000 valeurs. Les messages partent environ toutes les secondes tant qu'il reste des valeurs à transmettre.

```json
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

- `name` : nom de la variable, tel que déclaré dans la configuration du Data-Plug.
- `timestamp` : horodatage de la mesure, en millisecondes (Epoch).
- `dataType` : type de la valeur, déduit automatiquement de la donnée reçue. Quatre types sont produits : `Integer`, `Float`, `Boolean` et `String`.
- `value` : la valeur.

## 4. Format Reflex-report

### Paramètres

- **Base topic** : préfixe commun à tous les topics de publication, choisi librement, par exemple `usine-A/ligne-2`. Un `/` en fin de base topic est toléré.
- **QoS** : qualité de service MQTT des publications, 0, 1 ou 2. Valeur par défaut : 1.

### Topics

Chaque variable est publiée sur son propre topic, formé du base topic suivi du nom de la variable :

```
{BASE_TOPIC}/{NOM_VARIABLE}
```

Avec le base topic `usine-A/ligne-2` et la variable `pompe-1/etats`, le topic est `usine-A/ligne-2/pompe-1/etats`. Si le base topic est vide, le topic est le nom de la variable seul.

### Format des messages

Un message par valeur, sans flag Retained :

```json
{"ts": 1486144502122, "v": 0}
```

- `ts` : horodatage de la mesure, en millisecondes (Epoch).
- `v` : la valeur. Les booléens sont transmis sous forme `0` ou `1`, les entiers et réels sous forme numérique, les chaînes telles quelles.

Il n'y a pas de message de connexion en format Reflex-report.
