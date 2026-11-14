---
title: Periodic reports
description: "Schedule the automatic email of a dashboard PDF report: frequency, time, recipients, attachments, logo."
sidebar:
  order: 2
---

A report automatically emails the content of a dashboard, every day, every week or every month.

![Creating a report](../../../portal/dashboards/dashboard_reports.png)

## Create a report

1. Open the dashboard, then **Rapports** (Reports).
2. **+ Rapport** (Report) (for administrators, and for managers on the dashboards in their scope; viewers and operators can read reports but not change them), and give it a name.
3. Choose the **frequency** (**Journalier** (Daily), **Hebdomadaire** (Weekly), **Mensuel** (Monthly)), the day (a weekday, or the 1st to the 28th of the month) and the time of sending.
4. Tick the attachments: **PDF** (A4 format) and/or **CSV des données** (data CSV).
5. Select the **recipients** from the people in your company (only people who have an email address can be selected; the list is the same for a manager and an administrator).
6. **Enregistrer** (Save).

The report covers the elapsed period: the previous day for a daily report, otherwise the previous week or month. Comparisons are the ones set on the dashboard blocks.

## Check before sending

- **Aperçu PDF** (PDF preview, in the report editor): downloads the document as it will be sent.
- **Aperçu** (Preview): the email, in **Ordinateur** (Desktop) or **Téléphone** (Phone) version.
- **Envoyer maintenant** (Send now): an immediate send, outside the schedule.

## Logo and tracking

- **Logo des rapports** (Report logo): the administrator adds the company logo (PNG or JPEG, 2 MB maximum). It is shared across the whole company and appears at the top of the emails and PDFs; it is a company setting that managers cannot change.
- **Derniers rapports générés** (Latest reports generated; the last 30): period covered, status (sent, archived but not sent, error), recipients, and access to the PDF and CSV of each send.

A report can be disabled without being deleted (untick **actif** (active)); the dashboard of a closed project is read-only, so its reports can no longer be changed.

## Who can manage reports

A report is managed like the dashboard it is attached to: **create, edit, enable or disable, delete** and **Envoyer maintenant** (Send now) are open to the administrator and to the **manager whose scope covers the box or the project of the dashboard**. Outside their scope, a manager does not see those reports; viewers and operators see the reports and their history and can open a **Aperçu** (Preview), but cannot change anything.
