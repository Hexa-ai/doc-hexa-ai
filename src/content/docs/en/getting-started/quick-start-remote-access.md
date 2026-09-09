---
title: "Remote access quick start"
description: Turn a HAI-P200-4G into a secure remote-access gateway — Internet uplink, Tailscale VPN tunnel and reaching your PLCs from anywhere.
sidebar:
  order: 3
---

Welcome to your **HAI-P200-4G** controller, powered by **HAI-OS**. This guide walks you through turning the gateway into a secure remote-access bridge (VPN). Within minutes you will be able to reach your industrial equipment — PLCs, HMIs — from anywhere, as if you were on site with a cable.

## Step 1: First connection

Once your HAI-P200-4G controller is connected to power, you need to reach it.

By default, the controller's **Ethernet 1 (eth1)** port — the machine-network side — is preconfigured with the static IP address **192.168.1.16** and the subnet mask **255.255.255.0**.

1.  Connect your configuration PC directly to the controller's **Ethernet 1** port with a network cable _(make sure your PC's network adapter is set to the same subnet — for example IP 192.168.1.5)_.

2.  Open a web browser and enter the address **https://192.168.1.16**.

3.  On the login page, enter the default credentials:

    - **Username**: admin

    - **Password**: hai1@

4.  The gateway opens a configuration screen and asks you to set your administrator password.

![HAI-OS login page, with the Username and Password fields and the Log in button](../../../../assets/hai-os-login.png)

## Step 2: Giving the gateway Internet access

To establish the outbound VPN tunnel, the controller needs an Internet connection.

Expand the **Connection** menu in the left sidebar and pick how it reaches the outside world:

- **Ethernet (eth0)**: configure this port — the plant or corporate side — in DHCP mode, or with a static IP provided by the IT department.

- **WiFi**: turn on the WiFi radio, scan for nearby networks and connect to the plant access point.

- **4G Modem**: if you have a SIM card, enter the APN and PIN code to bring up an independent cellular link.

:::tip[Tip]
The interface footer shows live status icons for WiFi, the 4G modem and the VPN. When the icon for the link you configured turns green — or orange for 4G — Internet access is up.
:::

## Step 3: Setting up the VPN tunnel (Tailscale)

Now that the gateway has Internet access, let's attach it to your private network so you can reach it remotely.

1.  Go to **Connection > VPN Tailscale**.

2.  Tick the **Activate Tailscale VPN** checkbox.

3.  **Key**: enter the authentication key generated from your Tailscale admin console — it usually starts with `tskey-auth-` — then click **Apply**. The status turns to **Connected** and the _Key_ field disappears: the gateway is enrolled.

4.  The **Mode** selector then appears, set to **Subnet Route**. Keep that mode for remote maintenance. _(The other mode, Port Forwarding, exposes a single device on a specific port; see [the Tailscale VPN article](/en/network/tailscale-vpn/).)_

5.  **Subnet Route Configuration**: enter the machine network — the one on the **eth1** port — that you want to make reachable remotely. Give **the network address**, not a device address: if your PLC is at 192.168.1.50, enter `192.168.1.0/24`.

6.  Click **Apply** again. It is this second click that advertises the route.

:::caution[The advertised subnet must be approved on the Tailscale side]
In your admin console, open the machine, go to the **Subnets** section, click **Edit**, tick the network and save.

Until that approval is done, the gateway reports **Connected** but no traffic reaches your machines.
:::

![Tailscale VPN screen: status Connected, Activate Tailscale VPN ticked and subnet route 192.168.1.0/24](../../getting-started/quick-start-remote-access-1.png)

The status turns to **Connected**, in green. The gateway's router now forwards traffic from your remote network straight through to your machine network.

## Step 4: Reaching your equipment

The machine-side setup is done. From now on, from your desk or on the road:

1.  Make sure the Tailscale client application is running on your work PC and signed in to the same account.

2.  Open your usual programming software (TIA Portal, CODESYS, SoMachine…) or a web browser.

3.  Enter your PLC or HMI's **local IP address directly** (e.g. 192.168.1.50).

The connection is established transparently, and encrypted end to end.

## Congratulations

Your HAI-P200-4G controller is up and secured. To go further, see the dedicated documentation on how to:

- **declare firewall rules** to strictly limit who may talk to the machine;

- **enable connection sharing** if your PLC itself needs Internet access, to synchronise its clock or reach a cloud service.
