---
title: Vue d'ensemble
description: Les protocoles d'acquisition supportes par HAI-OS et leur niveau de maturite.
sidebar:
  order: 1
---

Six entrees configurables depuis la meme interface web, sans passerelle
intermediaire — et toujours **en lecture seule**.

| Protocole | Statut | Portee |
| --- | --- | --- |
| [Modbus TCP](/protocoles/modbus-tcp/) | Production | Holding & input registers, coils, discrete inputs |
| Modbus RTU | Production | RS232 / RS485 sur les 4 ports du bornier |
| S7 · ISO-on-TCP | Production | Blocs de donnees sur S7-300/400/1200/1500 |
| OPC-UA | Production | Navigateur de nodes, anonyme / mot de passe / certificat |
| BACnet/IP | Beta | Decouverte Who-Is, objets analogiques, binaires, multi-etats |
| NMEA 0183 | Beta | TCP client, TCP serveur ou UDP, filtre par talker |
| MQTT interne | Via Node-RED | Tout flux Node-RED devient une variable historisee |

## Vers vos systemes

En sortie : MQTT et webhook HTTPS JSON avec jeton, avec rejeu des messages
echoues.

## Constructeurs raccordes

Rien dans la box n'est specifique a un constructeur : tout equipement qui
parle Modbus, S7, OPC-UA, BACnet/IP ou NMEA 0183 se raccorde — Siemens,
Schneider Electric, Wago, Beckhoff, Rockwell / Allen-Bradley, Omron,
Mitsubishi, ABB, Phoenix Contact, Delta, Johnson Controls, Isma Controlli,
CODESYS.
