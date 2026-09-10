---
title: "First connection"
description: Power the HAI-P200-4G with 24 VDC, connect its Ethernet port and open its web interface for the first time.
sidebar:
  order: 1
---

![The HAI-P200-4G mounted on a DIN rail, powered by a WAGO Eco 2 supply, connected over Ethernet to a laptop](../../getting-started/first-connection-1.webp)

Here is an overview of a first connection to the HAI-P200-4G. Power your controller with 24 VDC — in our case we used an Eco 2 supply from our long-standing partner WAGO Contact (part number 2687-2142). Plug your PC into the lower Ethernet port and give it a static IP address, 192.168.1.5 for example.

![Annotated diagram of the interfaces: 24 VDC power connector, Gigabit port on DHCP by default, 100 Mbit/s port at 192.168.1.16 by default](../../getting-started/first-connection-2.png)

The HAI-P200-4G's two Ethernet interfaces are set by default to DHCP for the upper port and to a static IP for the lower one (address: 192.168.1.16).

To connect, type the IP address 192.168.1.16 into your browser's address bar and log in (user admin, password hai1@). Since the connection is over HTTPS, a security message about the certificate should appear in your browser on first access: confirm it to log in.

:::caution[This password does not survive the first setup]
Right after that login, the box opens a configuration screen and **asks you to set your own administrator password**. Until that is done, no setting is reachable.

The factory password therefore only serves for that first access: it will never be the one you administer the controller with. Have one ready before you start, and keep it — see [Security](/en/system/security/) for the rules it has to obey.
:::

[Watch the getting-started video](https://www.youtube.com/watch?v=arMbBaHQpJU)
