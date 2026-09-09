---
title: Modbus TCP
description: Déclarer un équipement Modbus TCP et mapper ses registres en variables historisées.
sidebar:
  order: 2
---

:::caution[Page d'exemple]
Squelette de mise en page — à remplacer par la procédure réelle.
:::

## Types de données

17 types de données sont disponibles, avec byte order configurable en
16, 32 ou 64 bits, ainsi qu'une échelle et une unité par variable.

## Zones adressables

- Holding registers
- Input registers
- Coils
- Discrete inputs

## Exemple de configuration

```yaml
source:
  type: modbus-tcp
  host: 192.168.1.50
  port: 502
  unit_id: 1
variables:
  - name: temperature_cuve
    zone: holding
    address: 40001
    datatype: float32
    byte_order: big-endian
    scale: 0.1
    unit: "°C"
```

## Passerelle RTU vers TCP

Un équipement Modbus RTU raccordé sur l'un des 4 ports série du bornier est
exposé en TCP par la passerelle intégrée — la configuration côté acquisition
est alors identique à celle d'un équipement TCP natif.
