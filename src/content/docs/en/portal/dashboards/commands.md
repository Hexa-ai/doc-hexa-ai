---
title: Live, weather and commands
description: "Recent dashboard features: switch to live, show a box's weather, and send commands to the PLC (beta) with confirmation and read-back."
sidebar:
  order: 4
  badge:
    text: Beta
    variant: caution
---

:::caution[Beta feature]
The Command block (PLC control) is in beta: how it works may change.
:::

## Live mode

By default, a box's values are sampled every 30 minutes. The **Direct** (Live) button at the top of a dashboard refreshes them **about every 2 seconds for 15 minutes**, then the dashboard returns to the normal pace. A message shows the age of the last value and the time left.

For a wall screen, tick **affichage permanent** (permanent display) in edit mode: values update about every 10 seconds, with no time limit (**Direct · permanent**).

## The Weather block

The **Météo** block shows the weather at the **box's address**: now, next 24 hours or 5 days, with the information you choose. The portal fetches it every 15 minutes. Without an address, the block says so ("renseignez son adresse dans sa fiche", fill in its address in its sheet).

## The Command block (beta)

The **Commande** block sends a setpoint or a start/stop order to a box's PLC.

**Prepare it** (manager or administrator): in edit mode, **+ Bloc ▸ Commande (bêta)**, then choose the **controlled box** and, for each field, the **writable variable** announced by the box. Depending on the field type, set the label, the **Min** / **Max** bounds, the **Pas** (step), the unit, decimals, or the "run" / "stop" labels and values, or a button's value. **Demander confirmation avant l'envoi** (ask for confirmation before sending) adds a validation step. **Save** the dashboard to activate the command.

**Use it** (operator and above): enter the value, **Envoyer** (Send), and confirm if asked. The box writes the value to the PLC then **reads it back**: the block shows **Appliquée · relu : …** (applied, read back), or **Non appliquée** (not applied) if the PLC stayed at another value, or "La box n'a pas répondu à temps" (the box did not answer in time).

Two conditions: **remote control** must be enabled for your company and for the equipment (otherwise the block says "Pilotage à distance désactivé…" or "Pilotage coupé pour cet équipement"), and the box must have announced writable variables. A **viewer** cannot send commands.
