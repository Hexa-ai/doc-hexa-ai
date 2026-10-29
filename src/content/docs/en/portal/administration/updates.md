---
title: Box updates
description: "Update the software of HAI-P200 boxes remotely from the myHexa portal, and what to know before you start."
sidebar:
  order: 2
---

The **Mises à jour** (Updates) page lists your boxes, their version and the available version, and lets you update them remotely.

![Box updates](../../../portal/administration/updates.png)

:::note[Beta feature]
This feature is recent and may still change.
:::

:::note
Only an administrator of your company can start an update.
:::

## Start an update

1. Tick the boxes to update (or **tout cocher** (tick all)). The option "seulement celles qui ont quelque chose à faire" (only those with something to do) hides the boxes that are already up to date.
2. **Mettre à jour la sélection** (Update the selection), check the summary (current version → new version), then **Lancer la mise à jour** (Start the update).

## Before you start

:::caution
- The box **restarts** at the end: monitoring and alarms are cut off for **a few minutes**.
- Confirmation can take **1 to 2 hours**: do not conclude it has failed before then.
- There is **no rollback** to the previous version.

Choose a time when a short interruption of monitoring is acceptable.
:::

## Boxes concerned

Only boxes running version **1.3.7 or later**, with remote control enabled, can be updated from the portal. The others are marked **mise à jour sur site** (update on site).

A box that has not reported in for more than 2 hours is flagged: the update will only reach it when it reconnects. As long as it has not yet been sent to the box, a scheduled update can be cancelled.
