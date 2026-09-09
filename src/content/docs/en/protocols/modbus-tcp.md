---
title: Modbus TCP
description: Declare a Modbus TCP device and map its registers to historised tags.
sidebar:
  order: 2
---

:::caution[Sample page]
Layout skeleton — to be replaced by the real procedure.
:::

## Data types

17 data types are available, with byte order configurable over 16, 32 or 64
bits, plus a scale factor and a unit per tag.

## Addressable areas

- Holding registers
- Input registers
- Coils
- Discrete inputs

## Configuration example

```yaml
source:
  type: modbus-tcp
  host: 192.168.1.50
  port: 502
  unit_id: 1
variables:
  - name: tank_temperature
    zone: holding
    address: 40001
    datatype: float32
    byte_order: big-endian
    scale: 0.1
    unit: "°C"
```

## RTU to TCP gateway

A Modbus RTU device wired to one of the 4 serial ports is exposed over TCP by
the built-in gateway — acquisition-side configuration is then identical to a
native TCP device.
