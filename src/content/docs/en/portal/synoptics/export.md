---
title: Layout, printing and export
description: "Set a synoptic or diagram's page layout, export a page as PNG, JPEG or PDF, print a whole dossier as one PDF, export images for a local HMI screen."
sidebar:
  order: 3
  badge:
    text: Beta
    variant: caution
---

:::caution[Beta feature]
This feature is usable but may still change. Your feedback is welcome.
:::

A synoptic or diagram can leave the portal: image, single-page PDF, full dossier or images ready for an HMI screen. These actions are in the editor (**…** button, **Mise en page**) and in the folder menu.

## Sheet layout

The **Mise en page** (Layout) window sets:

- the **frame**: sheet size or screen resolution (portrait or landscape, or custom size);
- the page **style** and its header (logo, title, date, footer);
- the **framing**: **Ajuster au dessin** (fit to drawing) or **Comme le cadre** (fixed scale);
- the **revision** (e.g. B, 2.1, Ind. C) shown in the header and title block.

**Suivre la mise en page du dossier** applies the dossier's settings to this sheet; **Appliquer à tout le dossier** extends them to all sheets.

## Export a page

In **Exporter la page**, choose the **format** (**PNG**, **JPEG** or **PDF (une page)**), the **render theme** (**Clair (impression)** or the screen theme) and the **displayed texts** (values and units, states, free texts). The export shows the diagram at rest, without live measures. Without the [Designer option](/en/portal/synoptics/designer/), the file carries the watermark.

## Print a dossier

A folder's menu offers **Imprimer le dossier…**: a **single PDF** with cover page (company logo, project logo), clickable **table of contents** (number, name, page), all sheets and, optionally, closing pages: **bill of materials** (with CSV export), **terminal-strip plan**, and **markers to print** (wires, cables, devices, terminal strips, terminals) with a quantity margin. Each sheet keeps its layout.

Settings shared by all plans (title block, texts, logo) are in **Mon entreprise ▸ Plans et impression**: see [My company](/en/portal/administration/company/). The project title, sheet prefix, revision index and date are set per dossier (right-click the folder ▸ **Réglages du plan**).

## Export for a local HMI

**Export pour IHM locale** produces, for an animated diagram, a **background** and a folder of images per piece of equipment and state (stopped, running, fault…), all at the same position, plus a **coordinates file** (CSV and JSON: position, size, state numbers, linked myHexa variables). You overlay these images in your screen's software (EasyBuilder, TIA Portal, Vijeo…) and animate them with a variable. Set the format (PNG or JPEG, transparent background), the theme, whether equipment names appear, and the states to include.
