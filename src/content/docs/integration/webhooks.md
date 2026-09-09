---
title: "Webhooks"
description: "Pousser les données vers vos propres serveurs : configuration de la connexion, routes ciblées, mise en tampon et test."
sidebar:
  order: 2
---


Le module **Webhooks** permet d'interfacer votre contrôleur HAI-P200-4G avec vos propres serveurs informatiques ou plateformes Cloud. Au lieu d'attendre que vous vous connectiez au boîtier pour lire les données, le contrôleur se charge de **pousser (Push) activement et de manière sécurisée** son état de santé et ses rapports périodiques vers l'API de votre choix.

## Prérequis

- Le contrôleur HAI-P200-4G

- HAI-OS

- Un serveur distant (endpoint API) capable de recevoir des requêtes HTTP POST au format JSON.

## Qu'est-ce qui est envoyé par Webhook ?

Le contrôleur utilise les webhooks pour transmettre deux types d'informations majeures, de façon automatique et planifiée :

1.  **Le Statut du Système (System Status) :** Envoyé automatiquement toutes les 30 minutes. Il contient une "photographie" (snapshot) complète et standardisée de l'état du contrôleur : informations sur l'appareil (hostname, version, uptime), état détaillé de chaque interface réseau (eth0, eth1, WiFi, 4G, Tailscale), statut des services internes (Data-Plug, Notifications, Node-RED, Grafana, etc.), et les toutes dernières valeurs connues de tous les capteurs.

2.  **Les Rapports Périodiques (Daily, Weekly & Batch Reports)** : Envoyés tous les jours (vers minuit) et toutes les semaines. Ils contiennent exactement les mêmes données (statistiques et alarmes) que celles envoyées par e-mail via le module _Notifications et Rapports_, mais au format pur JSON.

## Configuration de la Connexion

Pour activer cette fonctionnalité, basculez l'interrupteur **Enable Webhooks** sur ON en haut de la page. Dans la carte _Connection_, vous pouvez configurer les identifiants de votre propre serveur ou utiliser notre infrastructure par défaut :

- **Mode automatique (Serveurs myHexa) :** Laissez les champs "Base URL" et "Bearer Token" **vides**. Le contrôleur se connectera automatiquement aux serveurs par défaut myHexa et s'auto-attribuera un jeton de sécurité (token) de manière totalement transparente.

- **Mode personnalisé :**

    - **Base URL :** L'adresse racine de votre API (ex: https://api.mon-serveur.com). Veillez à utiliser le protocole https:// pour garantir la confidentialité des données.

    - **Bearer Token (JWT) :** Un jeton de sécurité qui sera glissé dans l'en-tête HTTP de chaque requête (Authorization: Bearer <token>). Cela permet à votre serveur de vérifier que la requête provient bien d'un équipement de confiance.

![](./webhooks-1.png)

## Comprendre les URLs cibles (Routes)

Le contrôleur construit dynamiquement les URLs complètes vers lesquelles il va "pousser" les données. La structure dépend du mode de connexion choisi (automatique ou personnalisé).

Dans le panneau _Target URLs_, vous pouvez voir un aperçu en temps réel des routes qui seront appelées par le contrôleur :

**1\. Si vous utilisez une API personnalisée :** La structure est \[Base URL\] / \[Hostname\] / \[Type de donnée\] :

- System status : https://api.mon-serveur.com/hai-a1b2c3/status

- Daily Report : https://api.mon-serveur.com/hai-a1b2c3/report/daily

- Weekly Report : https://api.mon-serveur.com/hai-a1b2c3/report/weekly

- Batch Report : https://api.mon-serveur.com/hai-a1b2c3/report/batch

**2\. Si vous utilisez les serveurs par défaut (auto-provisionnement myHexa) :** La structure intègre le terme /ingress/ (\[Base URL\] / ingress / \[Hostname\] / \[Type de donnée\]) :

- System status : https://srv.../ingress/hai-a1b2c3/status

- Daily Report : https://srv.../ingress/hai-a1b2c3/report/daily

_(Ici, hai-a1b2c3 représente le nom unique de votre contrôleur)._

![](./webhooks-2.png)

## Gestion des pertes de connexion (Buffering)

C'est une spécificité forte et industrielle de ce module : il fait la différence entre les données "temps réel" et les données "historiques" en cas de coupure de réseau (perte du WiFi ou de la 4G).

- **Pour le "System Status"** : Si le contrôleur n'a pas accès à internet au moment d'envoyer son état (toutes les 30 min), il est conservé en dernier instantané et rejoué. Les rapports en file expirent après le délai de rétention réglé sur la page _Notifications_.

- **Pour les "Rapports"** : Les rapports de fin de journée ou de fin de semaine contiennent des données comptables précieuses. S'ils ne peuvent pas être envoyés (erreur serveur ou coupure réseau), **le contrôleur les place dans une file d'attente sécurisée (Buffer)**. Dès que la connexion est rétablie, les rapports en attente sont automatiquement expédiés à votre serveur.

## Tester la configuration

Une fois votre configuration prête :

1.  Cliquez sur **Save** pour mémoriser la configuration.

2.  Cliquez sur **Send Test**.

3.  Le contrôleur va immédiatement générer un "Status" et un "Daily Report" et tenter de les envoyer en POST. Des notifications visuelles en bas de l'écran vous confirmeront la réussite de l'opération ou vous indiqueront si une erreur est survenue.

Si vous utilisez le mode automatique myHexa, il peut arriver qu'une bannière rouge "Provisioning error" apparaisse. Cela signifie généralement que l'appareil est déjà enregistré côté serveur mais que le jeton local a été perdu. Dans ce cas, contactez le support technique.
