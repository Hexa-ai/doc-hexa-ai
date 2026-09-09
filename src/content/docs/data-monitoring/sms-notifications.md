---
title: "Envoyer & recevoir des SMS"
description: "Envoyer et recevoir des SMS depuis le HAI-P200-4G, via son modem 4G."
sidebar:
  order: 5
---

Au-delà de la simple collecte de données, le **DataPlug** a une vocation plus large : il est le **vecteur de communication central** de nos contrôleurs. Il permet de piloter de nombreux services internes, y compris l'envoi et la réception de SMS.

Comme pour les données de vos équipements, ces échanges se font très simplement en utilisant notre **broker MQTT interne**.

### Comment envoyer un SMS
Pour envoyer un SMS, le principe est simple : il suffit de publier un message au format JSON sur un _topic_ MQTT dédié.

- **Topic MQTT à utiliser :** service/sms/send
- **Format du message (Payload) :** Le message doit être un objet JSON structuré de la manière suivante :

```json
{"number": "+33666740007", "message": "Hello World" }
```

## Comment recevoir un SMS
Pour être notifié de l'arrivée d'un nouveau SMS, le principe est l'inverse de l'envoi : il faut **souscrire** à un _topic_ MQTT spécifique pour écouter les messages entrants.

Dans Node-RED, vous utiliserez un nœud **mqtt in** configuré avec les informations suivantes :

- **Topic MQTT auquel souscrire :** service/sms/received
- **Format du message (Payload) :** Chaque SMS reçu sera publié sur ce _topic_ sous la forme d'un objet JSON structuré comme suit :

```json
{"number": "+33666740007", "message": "Hello Hexa-ai" }
```
