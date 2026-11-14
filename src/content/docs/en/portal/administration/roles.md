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
| **Gestionnaire** (Manager) | As operator, plus **edits** synoptics, dashboards (and their periodic reports) and documents within their scope, and manages alarm subscriptions for the boxes in their scope. No users, commercial subscriptions or company alarm settings (details below). |
| **Administrateur** (Administrator) | The whole company: users, subscriptions, settings (including alarm settings). Never restricted. |

## The three scopes

| Scope | What the person sees |
|---|---|
| **Toute l'entreprise** (whole company) | All boxes, including those added later. |
| **Des projets** (projects) | The boxes of the chosen projects, current and future, with their synoptics, dashboards and documents. |
| **Des box** (boxes) | Only the ticked boxes. |

An administrator always covers the whole company. The scope also limits what a manager can edit: only within the projects or boxes entrusted to them.

## What a manager can edit

Within their scope, a manager edits what an administrator edits, except what concerns the company itself:

| Action | Manager | Administrator |
|---|---|---|
| Synoptics | Yes | Yes |
| Dashboards, including the **affichage permanent (écran mural)** (permanent display, wall screen) | Yes: dashboards of the projects and boxes in their scope | Yes |
| **Periodic reports** of dashboards (create, edit, enable or disable, delete, **Envoyer maintenant** (Send now)) | Yes: reports of the dashboards in their scope (the report logo remains a company setting) | Yes |
| Documents (add, edit, delete) | Yes: documents of the boxes and projects in their scope | Yes |
| Alarm and link-loss subscriptions, sending to the boxes, escalation, copying to other boxes, alert **Maintenance** | Yes: on the boxes in their scope | Yes |
| People to notify **without portal access** (add, edit, delete) | Yes | Yes |
| Company alarm settings (link-loss delay, who receives, status summary) and **Importer depuis les box** (Import from boxes) | No | Yes |
| Users, roles, invitations and sharing (**Destinataires ▸ Accès portail**) | No | Yes |
| Projects: creation, settings, deletion | No | Yes |
| **Mon entreprise**, box updates, subscriptions | No | Yes |

Depending on the manager's scope:

- **Toute l'entreprise** (whole company): all boxes and projects, plus the documents **Général** (General) space;
- **Des projets** (projects): the chosen projects and their boxes (not the General space);
- **Des box** (boxes): only the ticked boxes, for their documents, dashboards and alarm subscriptions; a project cannot be edited with this scope.

The interface only shows the edit buttons where the portal accepts them.

## What each role sees in the menu

- **All roles**: Projets, Carte, Alarmes, Interventions, and under **Administration**: Destinataires (alarm settings can be viewed; a manager edits them on the boxes in their scope), Mises à jour and, as soon as a subscription is visible, Mes abonnements.
- **Administrator**: additionally user and sharing management (**Destinataires ▸ Accès portail**), **Mon entreprise**, launching updates and the company's alarm settings.

## People outside your company

A subcontractor, end client or design office does not need an account in your company: you **share** a project, box, synoptic or dashboard with them, with the role of your choice. See [Sharing with an outside person](/en/portal/administration/external-sharing/).

## Giving a role

Roles and scopes are chosen when inviting or from the user list: see [Users and access](/en/portal/administration/users/).
