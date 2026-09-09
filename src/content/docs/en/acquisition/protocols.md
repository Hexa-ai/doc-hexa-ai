---
title: Overview
description: Acquisition protocols supported by HAI-OS and their maturity level.
sidebar:
  order: 2
---

Six inputs, all configurable from the same web interface, with no intermediate
gateway — and always **read-only**.

| Protocol | Status | Scope |
| --- | --- | --- |
| Modbus TCP | Production | Holding & input registers, coils, discrete inputs |
| Modbus RTU | Production | RS232 / RS485 on the 4 terminal-block ports |
| S7 · ISO-on-TCP | Production | Data blocks on S7-300/400/1200/1500 |
| OPC-UA | Production | Node browser, anonymous / password / certificate |
| BACnet/IP | Beta | Who-Is discovery, analog, binary and multi-state objects |
| NMEA 0183 | Beta | TCP client, TCP server or UDP, talker filtering |
| Internal MQTT | Through Node-RED | Any Node-RED flow becomes a historised tag |

## Towards your systems

Outbound: MQTT and HTTPS JSON webhook with a token, including replay of failed
messages.

## Connected vendors

Nothing in the gateway is vendor-specific: any device speaking Modbus, S7,
OPC-UA, BACnet/IP or NMEA 0183 connects — Siemens, Schneider Electric, Wago,
Beckhoff, Rockwell / Allen-Bradley, Omron, Mitsubishi, ABB, Phoenix Contact,
Delta, Johnson Controls, Isma Controlli, CODESYS.
