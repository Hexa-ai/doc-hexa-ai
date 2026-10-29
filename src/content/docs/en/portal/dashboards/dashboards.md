---
title: Dashboards and projects
description: "Create a dashboard for a box or a project, choose the period, add and configure blocks, export to CSV."
sidebar:
  order: 1
---

A dashboard presents the useful information about an installation on one page: values, curves, gauges, alarms, documents.

![A box dashboard](../../../portal/dashboards/dashboard.png)

## Box or project

A dashboard is attached to:

- **one box**: its own variables;
- **one project**: a group of boxes (a network, a site), to compare or add up.

The **Tableaux de bord** (Dashboards) page lists them by box and by project.

![Dashboard list](../../../portal/dashboards/dashboards.png)

### Projects

The **Projets** (Projects) page creates groups of boxes: a name, a description, then the boxes that belong to it. A box belongs to one project only, or to none.

![Projects](../../../portal/dashboards/projects.png)

![A project dashboard](../../../portal/dashboards/dashboard_project.png)

## Period and refresh

At the top of the dashboard, choose the period: **24 h**, **7 jours** (7 days), **30 jours** (30 days), **Aujourd'hui** (Today), **Ce mois** (This month), or a custom range. The refresh menu updates the values automatically (from 30 s to 5 min, or **Arrêt** (Off)).

The **CSV** button exports the dashboard data for the period displayed, in either the **Détaillée** (Detailed) version (5 min step, volumes per hour) or **Comme affiché** (As displayed) (lighter). A detailed export over a long period can take a few minutes.

## Build a dashboard

Administrators build the dashboards; other users view them. **Modifier** (Edit) switches to edit mode: add blocks, reorder them by drag and drop, then **Enregistrer** (Save) (or **Enregistrer sous…** (Save as…) to make a new dashboard).

![Adding a block](../../../portal/dashboards/dashboard_edit.png)

Available blocks:

| Block | Use |
|---|---|
| **Courbe** (Curve) | Trend of one or more variables, with optional comparison to the previous period and [thresholds](#thresholds-on-curves) |
| **Barres de consommation** (Consumption bars) | Counters (volumes, energy) as bars, per interval |
| **Tuile valeur** (Value tile) | A current value, displayed large |
| **Jauge** (Gauge) | A value between a minimum and a maximum |
| **Voyant d'état** (Status indicator) | On / off, fault, with colours |
| **Créneaux d'états** (State timeline) | Running and stopped periods over time |
| **Tableau min / moy / max** (Min / avg / max table) | Numerical summary of several variables |
| **Statut** (Status) | Connection and version of the box |
| **Carte** (Map) | Location |
| **Historique d'alarmes** (Alarm history) / **Statistiques d'alarmes** (Alarm statistics) | Alarms of the period |
| **Documents** | Links to documents of the box |
| **Signalements** (Field reports) | The latest field report, displayed large, with its photos (see [below](#field-reports-block)) |
| **Image** / **Texte** (Text) | Diagram, photo, instructions |

The settings of each block (title, variables, comparison period, width on large screens, etc.) open from the block in edit mode.

## Thresholds on curves

On a **Courbe** (Curve) or **Barres** (Bars) block, add **seuils** (thresholds): a dotted horizontal line, with its description and value, for example *Niveau haut · 2.6 m* (High level · 2.6 m). Handy for seeing at a glance whether a measurement is approaching a limit.

<video class="hai-clip" autoplay loop muted playsinline preload="metadata" poster="/portal/videos/seuils-poster.jpg" aria-label="Adding a threshold to a curve on a dashboard"><source src="/portal/videos/seuils.webm" type="video/webm"><source src="/portal/videos/seuils.mp4" type="video/mp4"></video>

In the block settings, **Seuils** section:

1. **+ Ajouter un seuil** (Add a threshold);
2. enter the **value** and a **description** (optional);
3. choose a colour (red, orange, blue, green or grey);
4. confirm, then **Enregistrer** (Save) the dashboard.

Thresholds are read on the left axis. The scale widens if needed so that a threshold is always visible, even when the values for the period are far from it. They also appear in the [PDF reports](/en/portal/dashboards/reports/).

![A curve block with a high and a low threshold](../../../portal/dashboards/seuils_courbe.png)

## Field reports block

The **Signalements** (Field reports) block highlights what technicians have reported in the field (see [Interventions](/en/portal/alarms/interventions/)):

- the **latest field report, displayed large**: box, severity, category, author, description and **photo gallery**; clicking a photo enlarges it;
- below it, the **previous ones**; clicking one displays it large.

<video class="hai-clip" autoplay loop muted playsinline preload="metadata" poster="/portal/videos/signalements-poster.jpg" aria-label="Field reports block: photo gallery and previous field reports"><source src="/portal/videos/signalements.webm" type="video/webm"><source src="/portal/videos/signalements.mp4" type="video/mp4"></video>

Settings: the **boxes** concerned, what to **display** (field reports, interventions, photos), **which ones** (the open ones, or those within the dashboard period) and the **number displayed**. The block updates with the dashboard refresh: on a wall-mounted screen, a new field report appears on its own.
