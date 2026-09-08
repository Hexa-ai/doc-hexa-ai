---
title: Modbus TCP
description: Declarer un equipement Modbus TCP et mapper ses registres en variables historisees.
sidebar:
  order: 2
---

:::caution[Page d'exemple]
Squelette de mise en page — a remplacer par la procedure reelle.
:::

## Types de donnees

17 types de donnees sont disponibles, avec byte order configurable en
16, 32 ou 64 bits, ainsi qu'une echelle et une unite par variable.

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

Un equipement Modbus RTU raccorde sur l'un des 4 ports serie du bornier est
expose en TCP par la passerelle integree — la configuration cote acquisition
est alors identique a celle d'un equipement TCP natif.
