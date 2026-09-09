---
title: Vue d'ensemble
description: Les protocoles d'acquisition supportés par HAI-OS et leur niveau de maturité.
sidebar:
  order: 1
---

Six entrées configurables depuis la même interface web, sans passerelle
intermédiaire — et toujours **en lecture seule**.

| Protocole | Statut | Portée |
| --- | --- | --- |
| [Modbus TCP](/protocols/modbus-tcp/) | Production | Holding & input registers, coils, discrete inputs |
| Modbus RTU | Production | RS232 / RS485 sur les 4 ports du bornier |
| S7 · ISO-on-TCP | Production | Blocs de données sur S7-300/400/1200/1500 |
| OPC-UA | Production | Navigateur de nodes, anonyme / mot de passe / certificat |
| BACnet/IP | Beta | Découverte Who-Is, objets analogiques, binaires, multi-états |
| NMEA 0183 | Beta | TCP client, TCP serveur ou UDP, filtre par talker |
| MQTT interne | Via Node-RED | Tout flux Node-RED devient une variable historisée |

## Vers vos systèmes

En sortie : MQTT et webhook HTTPS JSON avec jeton, avec rejeu des messages
échoués.

## Constructeurs raccordés

Rien dans la box n'est spécifique à un constructeur : tout équipement qui
parle Modbus, S7, OPC-UA, BACnet/IP ou NMEA 0183 se raccorde — Siemens,
Schneider Electric, Wago, Beckhoff, Rockwell / Allen-Bradley, Omron,
Mitsubishi, ABB, Phoenix Contact, Delta, Johnson Controls, Isma Controlli,
CODESYS.
