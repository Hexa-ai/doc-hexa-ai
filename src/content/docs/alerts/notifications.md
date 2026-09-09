---
title: "Notifications"
description: "Configurer l'envoi des notifications : serveur SMTP, destinataires, déclenchement sur alarme, escalade par paliers et limitation du débit."
sidebar:
  order: 1
---


Le système de **Notifications et Rapports** transforme les données brutes collectées par le Data-Plug en informations exploitables. Il permet d'alerter les opérateurs en temps réel en cas d'anomalie et de générer des rapports périodiques automatiques (par e-mail) sur vos installations.

## Prérequis

- Le contrôleur HAI-P200-4G

- HAI-OS

- Des variables configurées dans le Data-Plug (des variables de type **Alarm** pour les alertes, et des variables mises en **Favoris (⭐)** pour les rapports).

## Activation et Configuration de l'envoi (SMTP)

Pour utiliser ce module, vous devez d'abord activer l'interrupteur global **Enable notifications** situé en haut de la page. Ensuite, vous devez configurer le serveur de messagerie (SMTP) qui sera utilisé par le contrôleur pour expédier les e-mails.

Cliquez sur le bouton **SMTP Configuration** pour accéder aux réglages :

- **SMTP Server & Port** : L'adresse de votre serveur mail (ex: smtp.gmail.com) et son port (généralement 587 pour STARTTLS ou 465 pour SSL).

- **Security** : Sélectionnez le mode de sécurité (STARTTLS, SSL ou NONE).

- **Username, From Email Address & Password** : Le nom d'utilisateur du compte SMTP, l'adresse e-mail d'expédition (peut différer du username selon les fournisseurs), et le mot de passe associé.

![](./notifications-1.png)

**Astuce** : Utilisez le bouton **Test Connection** pour vérifier la connexion avec le serveur de mails et valider vos paramètres avant de quitter la page.

## Gestion des Destinataires

La section **Recipients** permet de créer la liste des contacts (individus ou groupes) qui recevront les alertes et les rapports. Cliquez sur **Add Recipient** pour créer une nouvelle fiche.

Pour chaque contact, vous pouvez configurer :

- **Name & Email / Phone** : L'identité du contact et ses coordonnées (pour l'e-mail et le SMS).

- **Subscriptions** : Cochez les niveaux d'alarmes (Error, Warning, Info) que ce contact est autorisé à recevoir.

- ****Channels** :** Choisissez par quel moyen le contact peut être joint — E-mail, SMS et/ou Call. La case Call est une autorisation : un appel n'est passé que lorsqu'un palier d'escalade le demande, jamais sur une notification simple.

- **Active Days** : Sélectionnez les jours de la semaine durant lesquels ce contact recevra des notifications (pratique pour gérer les astreintes).

![](./notifications-2.png)

**Gain de temps** : Tout comme pour le Data-Plug, vous pouvez utiliser les boutons **Export CSV** et **Import CSV** pour gérer une longue liste de destinataires directement depuis Excel.

## Fonctionnement des Notifications d'Alarmes

Contrairement aux autres systèmes, vous n'avez pas besoin de créer des règles d'alarmes compliquées dans cette page. Le système s'appuie **nativement sur le Data-Plug**.

1.  Dès qu'une variable configurée en catégorie **Alarm** dans le Data-Plug passe à l'état Actif (1), le système le détecte instantanément.

2.  Il croise le niveau de dangerosité de cette alarme (Error, Warning ou Info) avec les **Subscriptions** de vos destinataires.

3.  Il expédie l'alerte !

**L'Analyse de Cause Racine (RCA) intégrée** : Lorsqu'une alarme se déclenche, l'e-mail envoyé ne se contente pas de vous prévenir. Il inclut automatiquement une analyse intelligente (RCA) affichant, dans un tableau, le Top 5 des variables (mesures) ayant le plus varié juste avant le déclenchement de l'alarme, complété par un graphique de tendance centré sur les 3 principales d'entre elles, pour vous aider à diagnostiquer le problème avant même de vous connecter au contrôleur.

Le calcul du RCA peut être désactivé individuellement pour une variable d'alarme donnée (option "Compute RCA" dans la configuration de la variable au niveau du Data-Plug). Si désactivé, l'e-mail d'alarme est envoyé normalement mais sans le tableau ni les graphiques d'analyse de cause racine.

Ce fonctionnement est celui de la notification immédiate. Si vous activez l'escalade pour un niveau d'alarme donné, les alarmes de ce niveau ne sont plus envoyées ainsi : elles suivent la chaîne de paliers (voir _**Escalade**_).

<details>
<summary>Exemple de notification</summary>

![](./notifications-3.png)

</details>

## Escalade (paliers)

Par défaut, une alarme est notifiée immédiatement à tous les destinataires dont l'abonnement correspond à son niveau. L'escalade remplace ce fonctionnement par une chaîne : on contacte un premier groupe, et si personne ne se manifeste, on passe au suivant.

Activez l'interrupteur **Enable escalation** pour faire apparaître la configuration.

**Point important** : l'escalade _remplace_ la notification immédiate, elle ne s'y ajoute pas. Une alarme prise en charge par la chaîne ne part que par la chaîne — un destinataire qui ne figure sur aucun palier n'est pas contacté du tout. Les niveaux d'alarme que vous laissez décochés dans **Apply to** continuent, eux, d'être envoyés immédiatement à tout le monde.

#### Portée et options de la chaîne

- **Apply to** : les niveaux d'alarme confiés à la chaîne (Error, Warning, Info). Par défaut, seul Error.
- **Keep previous levels engaged** : une fois le palier 2 atteint, le palier 1 continue de recevoir les messages de relance.
- **Stop when the alarm clears** : la chaîne s'arrête d'elle-même si l'alarme repasse à l'état inactif avant que quelqu'un ait acquitté.
- **Send a closure notice when acknowledged** : toutes les personnes déjà contactées sont informées de qui a pris l'incident en charge.

#### Construire les paliers

Les paliers se configurent sur un tableau en colonnes, à faire glisser :

- **Add someone** place une personne sur un palier. La même personne peut figurer sur plusieurs paliers — c'est ainsi qu'on la prévient par SMS au premier, puis par appel au troisième.
- Faites glisser une carte d'une colonne à l'autre pour déplacer quelqu'un, cliquez sur le ✕ de la carte (ou sortez-la du tableau) pour le retirer de la chaîne. La poignée ⠿ en tête de colonne réordonne les paliers.
- Les icônes ✉ / 💬 / 📞 sur chaque carte choisissent les canaux utilisés _pour cette personne à ce palier_. Les cases en haut de colonne sont une action groupée : elles activent ou désactivent un canal pour toutes les cartes du palier, chaque carte restant modifiable ensuite.
- **Wait** : le temps d'attente avant de passer au palier suivant (300 secondes par défaut, 10 au minimum). **Reminders** : le nombre de relances envoyées au sein du palier avant d'escalader.
- La zone **Outside the chain** liste les destinataires qui ne sont sur aucun palier. Ils ne recevront pas les alarmes couvertes par l'escalade.

Une frise **Chain timeline** sous le tableau récapitule le déroulé dans le temps (T+0, T+5 min, …), pour vérifier d'un coup d'œil qu'un incident non traité finit bien par remonter, et en combien de temps.

#### Acquitter

Un destinataire acquitte de trois façons :

- en répondant **OK** au SMS d'alerte (le numéro de l'expéditeur suffit à l'identifier, aucun code à saisir) ;
- en appuyant sur la **touche 1** pendant l'appel vocal ;
- depuis le bouton d'acquittement de la page **Alarmes**.

La chaîne s'arrête aussitôt. **Acquitter signifie seulement « j'ai vu l'alerte » : cela n'acquitte pas l'alarme elle-même**, qui reste active dans l'interface et dans les rapports.

À noter : les chaînes en cours sont gardées en mémoire vive. Un redémarrage de l'application annule les escalades en attente.

#### Le canal appel vocal

Un palier peut faire sonner un téléphone et énoncer l'alarme à voix haute. Deux règles de bon usage : les appels sont passés **un par un** (le modem ne tient qu'une ligne), il vaut donc mieux les réserver aux derniers paliers, une fois les canaux discrets déjà partis ; et la case **Call** d'un destinataire n'est qu'une autorisation — un appel n'est jamais passé sur une notification simple, uniquement quand un palier le demande. Si le service d'appel n'est pas disponible sur le contrôleur, la case est grisée et la raison affichée.

## Limitation des Notifications (Throttling)

Pour éviter d'être submergé de notifications lors d'une alarme instable ("flapping") ou d'un incident majeur touchant plusieurs variables à la fois, trois mécanismes de limitation sont disponibles, cumulables entre eux :

- **Minimum active duration (seconds)** : durée pendant laquelle une alarme doit rester active avant qu'une notification soit envoyée. Si l'alarme redevient inactive avant la fin de ce délai, aucune notification n'est envoyée. Désactivé par défaut (0 seconde).
- **Cooldown per alarm (seconds)** : délai minimum entre deux notifications successives pour une même alarme. Par défaut : 60 secondes.
- **Limit notification rate** : interrupteur activant une limite globale, toutes alarmes confondues, du nombre de notifications envoyées sur une fenêtre de temps glissante (**Max notifications** et **Window (seconds)**, par défaut 10 notifications / 300 secondes). Désactivé par défaut. Au-delà du quota, la notification n'est pas envoyée mais l'alarme reste visible sur la page des alarmes et dans les rapports.

![](./notifications-4.png)

## Génération de Rapports Périodiques

La section **Report Settings** vous permet d'automatiser l'envoi de rapports récapitulatifs de vos données. Ces rapports se basent exclusivement sur les variables que vous avez marquées comme **Favorites** (⭐) dans le Data-Plug.

L'interface est divisée en trois colonnes :

- **Daily Report (Rapport Quotidien)** : Pour recevoir un résumé tous les jours à une heure précise.

- **Weekly Report (Rapport Hebdomadaire)** : Pour recevoir un résumé une fois par semaine.

- **Batch Report (Rapport de Lot)** : Génère et envoie automatiquement un rapport complet à chaque fois qu'un lot (Batch) se termine (défini par une variable identifiante dans le Data-Plug). Vous pouvez y configurer une "Minimum duration (seconds)" pour éviter de générer des rapports pour des lots trop courts.

Pour chaque type de rapport, vous pouvez configurer :

- **Enabled** : Active ou désactive l'envoi de ce rapport.

- **Send Time** : L'heure d'envoi.

- **Attach CSV export** : Si activé, le contrôleur joindra un fichier CSV contenant l'historique brut des données de la période (pratique pour l'archiver ou le retravailler dans Excel).

- **Export only favorites** : Si coché, le fichier CSV ne contiendra que vos variables favorites. Si décoché, le fichier CSV contiendra l'intégralité des variables enregistrées par le contrôleur sur la période.

- **Delete old reports / Delete old batches** : Si activé, le contrôleur supprimera automatiquement les anciens rapports stockés localement.
- **Retention (days) :** Définit la durée de conservation (en jours). Pour les rapports Quotidiens/Hebdomadaires, cela supprime uniquement les anciens fichiers PDF. Pour les rapports de Lots (Batches), cela supprime l'historique d'identification du lot ainsi que son PDF, **mais les données brutes mesurées restent intactes** (leur conservation est gérée séparément par la configuration du Data-Plug).

![](./notifications-5.png)

L'e-mail de rapport (au format HTML) contiendra un tableau récapitulatif avec les statistiques (Min, Max, Moyenne) et les graphiques de vos 5 premières variables favorites classées par ordre alphabétique, ainsi qu'un historique des alarmes déclenchées sur la période.

Une variable favorite de catégorie Position dont l'option _Map in reports_ est activée dans le Data-Plug apparaît sous forme de carte avec la trace parcourue sur la période, à la place d'une courbe. Le fond de carte est téléchargé à la génération ; sans internet, le tracé reste dessiné sur fond neutre.

<details>
<summary>Exemple de rapport</summary>

![](./notifications-6.png)

</details>

Les rapports générés sont archivés sur le contrôleur et consultables depuis la page **PDF Reports** : filtrage par type et par date, consultation dans le navigateur, téléchargement et suppression, y compris par lot.

## Configuration Générale (Fuseau Horaire)

La section **General Settings** contient un paramètre crucial : le fuseau horaire (Timezone).

Veillez à sélectionner le bon fuseau (ex: Europe/Paris). Ce réglage garantit que l'heure d'envoi de vos rapports et les horodatages affichés dans les e-mails d'alarmes correspondent bien à votre heure locale.

![](./notifications-7.png)
