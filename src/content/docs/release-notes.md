---
title: "Notes de version"
description: Historique des versions de HAI-OS — nouveautés, corrections et changements, de la plus récente à la plus ancienne.
tableOfContents:
  maxHeadingLevel: 2
---

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.9] - 2026-09-10

### Fixed

- **Remote access after a reboot**: When the 4G modem (or a DHCP cable) took longer than the gateway's start-up delay to come up, the connection sharing fell back to "local only" and stayed there. In that state the automates had no internet and, worse, could no longer answer anyone reaching them through the VPN — neither through the subnet route nor through the port forwards — until someone reset the firewall. The share now re-arms itself as soon as the link gets its gateway, and a "local only" network refuses only the connections it opens itself, never the replies to connections opened from the other side.
- **Subnet route after a firewall reset**: Resetting the firewall silently removed the address translation Tailscale relies on for the subnet route, so a device reached that way answered into the void. The gateway now keeps its own copy of that rule and puts Tailscale's back after every reset.
- **Firewall page**: Deleting a rule worked but ended with an error in the log instead of the confirmation message.
- **Recovering an interrupted update**: If a gateway lost power or rebooted in the middle of a package installation, every later update was refused ("dpkg was interrupted") and, with no terminal on the gateway, could only be unblocked by a technician on site. The gateway now finishes the interrupted step by itself at the start of the next install.

## [1.3.8] - 2026-09-08

### Added

- **Factory reset**: New page under System to erase everything the gateway holds, or to put the application settings back while keeping networks, VPN, password and recorded data. A new administrator password is required afterwards.
- **Configuration transfer**: New page under System to export the gateway's settings as an encrypted file and import them onto another one — to replace a gateway or restore it after a reset. Network, VPN identity, password and measurements stay on their own gateway.
- **Screen on the gateway**: A monitor plugged into the HDMI port now shows the addresses of every interface, the DNS servers and the address of the web interface, instead of a login prompt. A factory reset can be started from there.
- **Audit & Logs**: New page under Security listing what the gateway records about itself — logins, firewall and network changes, add-ons and updates, service start-ups, and sessions opened on the screen or the serial port. The whole archive downloads in one click, and one switch stops all recording.
- **First-time setup**: A gateway still using its factory password opens on a setup screen, and nothing else is reachable until an administrator password is set. It must be at least 12 characters and mix three kinds of characters.
- **Add-ons — credentials**: The password of Grafana, Ignition, PostgreSQL and pgAdmin, now unique to each gateway, is shown on the add-on's card.
- **Mobile link — restarting after an outage**: Optional restart of the modem when the internet connection is lost, after a delay you choose. Never during an alarm call, and repeated restarts are spaced further apart.
- **Updates — network timeouts**: An Advanced section on the Update page sets how patient the gateway is when checking for and installing an update, for sites where the mobile link barely holds.
- **Resilience**: Services are now restarted indefinitely instead of giving up after a few attempts, and the hardware watchdog reboots the gateway if the kernel freezes. Connections aimed at the gateway are rate-limited per source address.

### Changed

- **Add-ons**: Add-on passwords are no longer printed in the manuals — look them up on the add-on's card. Add-ons installed before this version keep their old password until they are reinstalled.
- **Add-ons**: Node-RED now runs with a memory, CPU and task ceiling, so a flow that runs away can no longer take the whole gateway down.
- **Firewall**: A rule now says which networks it applies to. New rules default to the local networks; reaching the 4G link is a separate choice, with a warning.
- **SSH access**: Sessions and failed attempts are recorded and the recent ones are listed on the Firewall page.
- **Updates**: The end of an installation now says plainly that the gateway is still running the previous version, with a restart reminder on every page until it is done.
- **Alarms — escalation**: A chain now hands over instead of accumulating: when level 2 is engaged, level 1 stops being contacted. Chains already configured keep their behaviour, switchable on the escalation card.
- **Logs**: Every journal is named the same way, and files written under an older name are renamed at the first start after the update.

### Fixed

- **Alarms — voice calls**: Calls are now placed over voice-over-4G. Without it a call could be released after about thirty seconds without ever ringing, and be recorded as "no answer".
- **Alarms — voice calls**: A call no longer takes the mobile link down for its duration, no longer causes the modem to be reset in the middle of it, and the last people of a level are no longer hung up on.
- **Alarms — SMS**: A refused SMS is now logged as failed and retried instead of being reported as delivered. An SMS raised during a call is queued and sent as soon as the call is over.
- **Alarms — escalation**: An acknowledgement is no longer lost when the gateway restarts, which used to call and text the same people again. Escalations are never resumed at start-up.
- **Alarms**: A gateway that could not read the state of its alarms as it started no longer notifies every one of them as freshly triggered.
- **Mobile link**: The health of the link is now measured through the modem itself, in whichever protocol the subscription provides. A working modem was declared dead and restarted every few minutes on an IPv6-only SIM, or on a gateway connected by cable.
- **Mobile link**: Restarts after an outage are now spaced out instead of every two minutes, the modem is given four minutes to attach at boot, and a single lost ping no longer reports the link as degraded.
- **Mobile link**: Reconnecting works without disconnecting first, enabling the SIM no longer requires a network cable, and pressing Apply while the gateway is reconnecting no longer leaves the link down.

### Security

- **Passwords**: Every gateway used to ship with the same administrator password, and the same add-on passwords. Both are now unique per device. Grafana and PostgreSQL are repaired on existing gateways where the shared password is still in use; Ignition and pgAdmin pick up theirs when reinstalled with "delete data".
- **Sessions**: The key signing browser sessions was identical on every gateway built since April 2025, so a copy of it opened any of them. Each gateway now generates its own — updating logs everyone out once.
- **Web interface**: It answered on every network interface, the 4G link included, which put it on the internet on a SIM with a public address. It is now restricted to the local networks and the VPN.
- **Login**: Five wrong passwords now delay further attempts, up to five minutes. Nobody is locked out permanently.
- **Factory reset**: A gateway reset to factory settings came back with its firewall wide open, and rules added by the customer could survive the reset. It now returns to the firewall it is delivered with, SSH closed.
- **Updates**: The web interface no longer installs anything: it files the request, and an isolated service checks the Hexa-AI signature and performs the installation. Uploaded .deb files are checked against that same signature, and updates are only ever downloaded over HTTPS.
- **Node-RED**: The add-on runs as an ordinary user instead of as an administrator, so a flow can no longer take control of the gateway. Two consequences: a flow acting as a _server_ on a port below 1024 must move above it — a Modbus/TCP server on 502 to 1502, for instance, while polling a device on port 502 is unaffected — and exec nodes no longer run as administrator.
- **Temporary directory**: /tmp is now a separate area from which no program or script can be run, emptied at every restart.
- **System access**: The admin account now requires its password to run administrator commands, and SSH passwords are removed where a key is already authorised. The kernel is also hardened against SYN floods and against routes dictated by someone else on the network.

## [1.3.7] - 2026-08-14

### Added

- **NMEA 0183**: New input protocol in the Data-Plug, reading marine sentences over the network (TCP client, TCP server or UDP), with a listen mode that shows the incoming stream and turns any received field into a channel in one click, and CSV import/export. A serial talker connects through an external serial-to-Ethernet converter.
- **Position on a map**: NMEA variables can be declared as a position — a single channel carrying the GPS point of a sentence. The Data-Explorer then shows the trace on a map instead of a curve, over the selected period and moving live, following the same interval selector as the other variables.
- **Escalation**: Alarms can now be escalated tier by tier instead of being sent to everybody at once. Each level names the people to contact, how long to wait before the next one, and which channels to use — email, SMS, voice call — down to a per-person choice inside a level. Recipients acknowledge by replying "OK" to the alert SMS, by pressing 1 during the call, or from the Alarms page; the chain then stops. Acknowledging only confirms the alert was seen, it does not clear the alarm.
- **Accessibility**: A new button in the header opens a panel where each user adapts the interface to their own sight and comfort: larger text, high contrast, no animation, underlined links and a clearly visible keyboard focus. The choice follows the user across every page, including the login and guest screens, and a device that asks for reduced motion is honoured automatically.
- **Add-ons — version choice**: Ignition Edge and Node-RED can now be run in the version chosen from a list on their card, instead of the single version imposed before. The change takes effect at the next start of the add-on.
- **Add-ons — uninstall**: An add-on can now be removed from the controller. Uninstalling frees the storage it occupied — every version ever installed, which can amount to several gigabytes. Its data is kept, so installing it again finds the previous configuration; a second option deletes the data as well.

### Fixed

- **Batches**: A batch now appears in the interface as soon as it is opened, instead of up to fifteen minutes later.

## [1.3.6] - 2026-07-30

### Added

- **WiFi hotspot**: The controller can broadcast its own WiFi network (with optional internet sharing) and display a QR code to join it. Connected clients are listed and can be blocked.
- **Captive portal**: Optional welcome page shown to devices joining the hotspot.
- **Modbus RTU gateway**: New page to expose each serial port (RS232/RS485) as a Modbus TCP server, with configurable port settings.
- **Connection Test**: New page to ping a server, the gateway or a custom address from a chosen interface, with packet loss and latency.
- **Storage**: New page showing internal storage and micro SD usage, with the ability to format the micro SD card. Usage is also shown on the home page.
- **Port forwarding**: Remote access to a specific port of a device on the local network through Tailscale, as an alternative to subnet routing.
- **Guest access**: The guest menu is now configurable — pages can be shown or hidden individually, and custom links can be added.
- **Landing page**: The page shown when entering the controller's address in a browser can now be chosen (any page of the interface or an external URL).
- **Notifications — flood protection**: Limit the number of alarm notifications sent: minimum alarm duration, delay between two notifications for the same alarm, and a maximum per period. Alarms remain visible in the interface and in the reports.
- **Alarms**: The analysis and charts attached to an alarm notification can now be disabled per alarm.
- **Ethernet**: Each interface now shows whether a cable is connected.
- **Mobile**: The interface is now usable from a phone or a tablet.
- **4G location**: Optional estimation of the controller's position from the mobile network, shown on a map on the Modem page and on the home page, and published over MQTT. Disabled by default.
- **BACnet/IP**: New input protocol in the Data-Plug, with device discovery, object browsing and CSV import/export.

### Changed

- **SMTP**: New "From Email Address" field. Notifications could not be sent when the SMTP username was not an email address.
- **Menu**: "Applications" is renamed "Add-ons".
- **Updates**: A long or interrupted update no longer looks frozen — progress and the log stay visible even after refreshing the page, a failure can be retried, and the final reboot can be postponed.
- **Web access**: ip/node-red now opens Node-RED directly, and an open session is no longer dropped during an installation.

### Fixed

- **Batches**: Deleting the variable used as Batch ID now disables the Batch ID automatically instead of leaving the page unusable.
- **Notifications**: A send is no longer reported as successful when some recipients were refused.
- **Alarms**: Correct trigger time, removal of alarms deleted from the configuration, and non-numeric variables no longer disturb the calculations.
- **Interface**: Fixed an error that could appear right after an update.

### Removed

- **Grafana**: Obsolete pre-installed dashboards.

## [1.3.5] - 2026-06-17

### Fixed

- **Applications**: Remove Grafana SQLite datasource and fix PGAdmin version to 9.13

## [1.3.4] - 2026-05-08

### Added

- **Data-Plug — OPC-UA browser**: New "Browse server" button next to the endpoint URL opens a tree view of the live OPC-UA server (pre-loaded up to 6 levels deep). Multi-select with checkboxes; only Variables with a supported runtime type (BOOL/INT/FLOAT/STRING) are tickable. Each imported variable inherits its full BrowseName path (e.g. Plant/Line1/Temperature), description and value type read from the server. Reuses the input's connection settings (endpoint, security policy/mode, client cert/key, auth, remote cert).
- **Data-Plug — OPC-UA security**: Generate and download a self-signed client cert/key directly from the UI (10-year validity, SAN matching the input name). New "Trusted Server Certificate" field for explicit server pinning via Telegraf's remote\_certificate option (visible when security\_policy ≠ None).
- **Data-Plug — Floating "Save and restart" button**: New FAB at the bottom-right of the configurator page, visible only when the top button has scrolled out of view. Expands on hover to show the full label.
- **Data-Plug — Variable name uniqueness**: Inline validation refuses duplicate channel names across all protocols.

### Changed

- **Data-Plug — OPC-UA UI compaction**: Variable rows now fit on a single line on standard displays. Timeouts, Security & Authentication and Timestamp Source are grouped under a collapsible "Advanced parameters" toggle on the same row as "Browse server". Field widths and labels tightened (NS, Type, dropdown labels shortened).
- **Data-Plug — OPC-UA cert defaults**: certificate and private\_key are now empty by default (Telegraf auto-generates a temporary self-signed cert when both are empty, per upstream documentation). Existing files in /etc/telegraf/OPC\_UA/ are auto-detected and pre-filled when the security row becomes visible.

### Fixed

- **Data-Plug — OPC-UA cert leakage**: Switching security\_policy back to None now properly clears the client certificate and private-key paths from the generated TOML (the UI hid the row but values persisted before). Same for username/password when auth\_method is no longer UserName. Defensive sanitisation also added in get\_toml\_content as a safety net.
- **Data-Plug — CSV import**: Auto-detects ; or , separators and strips a UTF-8 BOM if present. Previously a CSV re-saved by Excel/LibreOffice (English locale) was silently parsed as a single column, returning a misleading "imported successfully" toast with zero variables imported.

### Build

- **Nuitka**: Added --include-package=asyncua --include-package-data=asyncua so the standalone build embeds the OPC-UA client and its binary\_address\_space.pickle runtime data file.

## [1.3.3] - 2026-05-06

### Added

- **Data-Plug — Reflex (MQTT) connector**: New output connector publishing every variable on its own MQTT topic in the format <base\_topic>/<channel\_name> with a JSON payload {"ts": <epoch\_ms>, "v": <value>}. Configurable QoS (0/1/2, default 1). Boolean values are converted to 0/1, strings are forwarded as-is. Robust topic construction tolerates trailing slashes in the base topic and/or leading slashes in the channel name.
- **Data-Plug — Internal MQTT (Node-RED) protocol**: New input protocol in the Telegraf configurator that lets users declare variables (channel name, category, unit, value type, description, danger level, favorite) without generating any Telegraf config. These variables are tagged source='internal\_mqtt' in hai\_vars and are populated by an external publisher (Node-RED, custom script, third-party SCADA) that posts to data/all/<topic> on the local broker, using the standard Telegraf payload {"name": "<channel>", "fields": {"value": <v>}, "timestamp": <ms>}. They appear in Data-Explorer, status webhooks, reports and CSV import/export like any other variable.

### Changed

- **Data-Plug — Driver labels**: The output connector dropdown now displays explicit JSON format names: _MQTT (Scorp-IO JSON Format)_ and _MQTT (Reflex-report JSON Format)_. Stored configuration values remain unchanged (no migration required for existing devices).

### Fixed

- **Data-Plug — Forwarder reinitialisation**: Saving the Cloud Gateway configuration now always reinitialises the forwarder, even when no forwarder existed before (e.g. when switching from None to MQTT/Reflex). Previously the change required an application restart.
- **Data-Plug — Driver switching**: Switching between two MQTT drivers (Scorp-IO ↔ Reflex) now properly stops the previous forwarder and resets its singleton before instantiating the new one.
- **Backup — Restore upload**: Lifted the nginx body size limit (default 1 MB) that caused restore uploads to fail at ~100% with a silent rejection. nginx now accepts request bodies up to 1 GB, streams them straight to the application instead of spooling, and uses extended timeouts to accommodate slower links (4G).
- **Backup — Download resume**: Switched the download endpoint to FileResponse so HTTP Range requests are honoured (status 206 + Content-Range). Chrome can now resume an interrupted download from the byte offset instead of restarting from zero, which fixes the ERR\_NETWORK\_CHANGED failures observed when the container's network interfaces are recreated on restart. Tokens stay valid until a periodic task removes archives older than one hour.
- **Backup — Download reliability**: The container is no longer restarted synchronously at the end of the export; the restart runs in a background thread after a 30 s delay so the download can start (and usually finish) on a stable network. The download is also opened in a fresh browsing context (window.open) instead of an in-tab anchor click, so Chrome can no longer poison the admin tab's HTTP/2 connection if a Podman bridge flap does happen mid-transfer.

## [1.3.2] - 2026-04-30

### Added

- **Backup & Restore**: Backup and restore for all application services. Secure archive download via token with automatic deletion after retrieval.
- **CSV Export**: CSV export from the Data-Explorer (selected time range, selected channels) and from the Data-Plug buffer.
- **PDF Reports**: New PDF report management page with integrated viewer, bulk download and bulk delete.
- **Batches**: New Batches page integrated with the Data-Explorer. Batch identifier selection, batch report configuration in Notifications and Webhooks, configurable retention.
- **Webhooks (myHexa)**: Automatic provisioning against the default myHexa servers. Leave the Base URL and Bearer Token fields empty and the device will request its own token automatically (using its eth0 MAC address) — no manual configuration required.
- **Storage Monitor**: New service that tracks disk usage and publishes storage metrics over MQTT.

## [1.3.1] - 2026-04-20

### Changed

- **Webhooks** :  The status webhook payload has been completely restructured. It now exposes a clean, standardized format: device information (hostname, version, uptime), detailed state of each network interface (eth0, eth1, WiFi, 4G, Tailscale), service statuses (Data-Plug, Notifications, reports, Node-RED, Grafana, etc.), and the latest known values of all variables.

## [1.3.0] - 2026-03-06

### Added

- **Data-Explorer**: Added a comprehensive data exploration page with advanced charts (ECharts), Historical/Live modes, period comparison tools, and custom aggregations.
- **Alarms & RCA**: Total overhaul of alarm management (Live/Historical modes). Added a Root Cause Analysis (RCA) tool to quickly identify the most impacted variables during a trigger, with synchronized charts.
- **Notifications & Reports**: New module to configure recipients (Email/SMS). Automatic generation and sending of reports (daily or weekly) with embedded charts and CSV exports as attachments.
- **Webhooks**: New interface to configure the sending of system status and telemetry data to a remote API (with Bearer Token authentication support).
- **Buffer / Spooler**: Added a queuing system for sending Emails, SMS, and Webhooks in case of network outages. Messages are stored and automatically resent as soon as the connection is restored.
- **System**: Added the ability to rename the device (hostname modification) directly from the home page.
- **Security**: Ability to enable a secure and restricted "Guest Access" mode (passwordless) for the Data-Explorer, Alarms, and WebVisu pages.
- **UI**: Global implementation of a Dark Mode with a persistent toggle button in the interface header.
- **Data-Plug**: Added configuration import/export (CSV), on-the-fly enabling/disabling of data historization, and custom adjustment of the backup (commit) interval.
- **Release Notes**: Integrated local changelog viewer in the Update page.
- **Release Notes**: Added "Print / PDF" feature for changelogs with dedicated print styling.
- **UI**: Added a custom 404 Error page with corporate identity and redirection to home.
- **System**: Added CHANGELOG.md automatic inclusion in the final Debian package (build.sh).

### Changed

- **UI**: Global modernization of the interface (rounded corners, subtle shadows, new cards) and reorganization of the side menu by categories with dropdown menus for better readability.
- **System**: Overall performance optimization for a much more responsive interface, smooth navigation, and faster startup time.
- **Data-Plug**: Reorganized the configuration interface into clear tabs (Config / Agent / Logs).
- **UI**: The footer clock is now calculated directly by the browser to reduce the controller's load.

### Fixed

- **SMS Tool**: Fixed a variable mapping bug that prevented proper reading of received SMS.
- **Data-Plug**: Fixed an unexpected disconnection issue caused by an identifier conflict when saving the configuration.
- **Firewall**: Secured the maintenance of security rules to prevent them from being occasionally cleared by other internal applications.
- **System**: Fixed timezone offsets during data exports and in report email headers.
- **Data-Plug**: Fixed a critical TypeError where retention\_days was not correctly cast to an integer, causing storage initialization failures.

## [1.2.18] - 2026-01-02

### Added

- **Firewall**: Reset Button. This button resets all firewall rules. Everything that wants to enter is blocked except for ports 80, 443, 53, and 67.

## [1.2.17] - 2025-12-30

### Added

- **Grafana**: New Dashboards.

## [1.2.16] - 2025-12-29

### Added

- **Power Supply**: Power Failure Management. Added a secure emergency shutdown procedure. The system now shuts down cleanly in the event of a power outage.

### Changed

- **Data-Plug**: System Speed. Internal database optimization (append index). Accessing historical data and processing information is now smoother and faster.

### Fixed

- **Data-Plug Configuration**: Simplified Configuration. Certain setting fields are now secured (read-only) to allow quicker and easier configuration.
- **Data-Plug Configuration**: MQTT forwarding mechanism is working again.
- **Data-Plug Configuration**: Purge mechanism is working again and retention time can extend beyond 180 days.
