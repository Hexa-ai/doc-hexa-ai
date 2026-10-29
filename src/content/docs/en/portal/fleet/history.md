---
title: History
description: "View the history of a box's variables: choosing variables, period, zoom, minimum and maximum."
sidebar:
  order: 3
---

The history shows how a box's variables change over the period of your choice. You reach it with the **Historique** (History) button on the box page.

![History of a box](../../../portal/fleet/history.png)

## Choose what to display

- **Variables**: tick the ones to display (search by name, **tout cocher** (tick all), **aucune** (none)). Each variable has its own chart, with its unit.
- **Période** (Period): duration buttons at the top of the page, or **Tout** (All) for the whole history.
- **Navigation**: **◀** and **▶** to move back and forward, **−** to zoom out.
- **min/max**: ticked by default; shows the minimum-maximum envelope in addition to the average, so you do not miss a peak.

## Zoom

On a chart, click and drag over the area that interests you: the period narrows to it. Hovering shows the exact date and value.

<video class="hai-clip" autoplay loop muted playsinline preload="metadata" poster="/portal/videos/historique-poster.jpg" aria-label="Zooming with the mouse on a history curve"><source src="/portal/videos/historique.webm" type="video/webm"><source src="/portal/videos/historique.mp4" type="video/mp4"></video>

## Long periods: what you see

Over several weeks, a box has recorded far more values than the screen can display. The portal then splits the period into **time buckets** (at most 1,500 per variable) and keeps the **average**, the **minimum** and the **maximum** for each. The curve plots the average; the **min/max** option shows the envelope, so a brief peak stays visible. Counters (volumes, energy) are totalled per hour, per day or per week, depending on the period displayed.

<img class="hai-anim" src="/portal/anim/en/points.svg" alt="Animation: thousands of points grouped into time buckets, each bucket keeping average, minimum and maximum; the peak stays visible" loading="lazy">

Narrow the period (or zoom in) to get back to point-by-point detail.

## Good to know

- The history depends on what the box records: only variables that are logged on the box appear in it.
- Data arrives in batches: the last few minutes may not be there yet. The live value remains visible on the box page.
