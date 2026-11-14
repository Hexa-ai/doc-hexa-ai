---
title: Roles and scopes
description: "The four myHexa roles (viewer, operator, manager, administrator) and the three scopes (whole company, projects, boxes): who can do what."
sidebar:
  order: 0
---

Everyone who accesses the portal has a **role** (what they can do) and a **scope** (where they can do it).

## The four roles

Roles **add up**: each includes everything the previous one allows.

<img class="hai-anim" src="/portal/anim/en/roles.svg" alt="Animation: four bars getting longer, Viewer, Operator, Manager, Administrator; each role includes the previous one and adds rights" loading="lazy">

| Role | What it allows |
|---|---|
| **Lecteur** (Viewer) | Views measures, alarms, dashboards, documents. Does not acknowledge alarms, send commands or edit anything. |
| **Opérateur** (Operator) | As viewer, plus **acknowledges alarms** and **sends commands** on boxes where remote control is enabled. Does not edit synoptics, dashboards, documents or alarm settings. |
| **Gestionnaire** (Manager) | As operator, plus **edits** synoptics, dashboards, documents and alarm settings within their scope. No users, subscriptions or company settings. |
| **Administrateur** (Administrator) | The whole company: users, subscriptions, settings. Never restricted. |

## The three scopes

| Scope | What the person sees |
|---|---|
| **Toute l'entreprise** (whole company) | All boxes, including those added later. |
| **Des projets** (projects) | The boxes of the chosen projects, current and future, with their synoptics, dashboards and documents. |
| **Des box** (boxes) | Only the ticked boxes. |

An administrator always covers the whole company. The scope also limits what a manager can edit: only within the projects or boxes entrusted to them.

## What each role sees in the menu

- **All roles**: Projets, Carte, Alarmes, Interventions, and under **Administration**: Destinataires (alarm settings can be viewed), Mises à jour and, as soon as a subscription is visible, Mes abonnements.
- **Administrator**: additionally user and sharing management (**Destinataires ▸ Accès portail**), **Mon entreprise**, launching updates and editing alarm settings.

## People outside your company

A subcontractor, end client or design office does not need an account in your company: you **share** a project, box, synoptic or dashboard with them, with the role of your choice. See [Sharing with an outside person](/en/portal/administration/external-sharing/).

## Giving a role

Roles and scopes are chosen when inviting or from the user list: see [Users and access](/en/portal/administration/users/).
