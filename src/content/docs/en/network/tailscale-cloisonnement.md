---
title: "Isolating your gateways on Tailscale"
description: "A Tailscale access policy to paste once: your technicians reach every gateway, a gateway never reaches another one. After that, every new gateway is isolated automatically."
sidebar:
  order: 3
---

An integrator usually installs one HAI-P200-4G gateway per machine or per customer site, all joined to the **same Tailscale network** (the "tailnet"). Those customers may be competitors: your technicians must reach every gateway, but **a gateway, or a plant device behind it, must never be able to bounce to another one**.

A new tailnet, however, is created with an **"everyone reaches everything"** rule: every device in the tailnet can reach every other device. This page replaces that rule with an isolating policy that you **paste once**. After that, you only enroll each new gateway with the right key: isolation applies on its own, with no change to the policy.

## The principle: one tag for devices

Tailscale distinguishes two kinds of identity:

- **users** (your technicians, on their PC or phone), identified by their account;
- **devices**, identified by a **tag**. Here, just one: `tag:hai-box`.

The policy simply says:

1. tailnet users can reach the gateways tagged `tag:hai-box`, and the plant networks they expose;
2. **nothing allows a gateway to reach anything**. Because Tailscale denies everything that is not explicitly allowed, a gateway can reach neither another gateway nor a technician's PC, and cannot be used as a relay by a device on its plant network.

On top of that, the subnets advertised by the gateways are **approved automatically**: no more clicking **Edit** in the console for each new gateway.

## Step 1 — Paste the policy (once)

In the Tailscale console, open **Access controls**, switch to the **JSON editor**, replace the whole content with the template below, then click **Save**.

```jsonc
{
  // Who can apply the "device" tag: the tailnet administrators.
  "tagOwners": {
    "tag:hai-box": ["autogroup:admin"],
  },

  "grants": [
    // 1. Tailnet users reach every gateway (web interface, SSH, forwarded ports).
    {
      "src": ["autogroup:member"],
      "dst": ["tag:hai-box"],
      "ip":  ["*"],
    },
    // 2. ... and the plant networks exposed by the gateways (Subnet Route mode).
    {
      "src": ["autogroup:member"],
      "dst": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"],
      "ip":  ["*"],
    },
    // 3. Each user reaches their own devices (optional).
    {
      "src": ["autogroup:member"],
      "dst": ["autogroup:self"],
      "ip":  ["*"],
    },
    // No rule starts from tag:hai-box: a gateway cannot reach anything.
  ],

  // Private subnets advertised by a gateway are approved automatically.
  "autoApprovers": {
    "routes": {
      "10.0.0.0/8":     ["tag:hai-box"],
      "172.16.0.0/12":  ["tag:hai-box"],
      "192.168.0.0/16": ["tag:hai-box"],
    },
  },

  // Safeguard: saving is rejected if a future change
  // allowed a gateway to reach another gateway or a plant network.
  "tests": [
    {
      "src":  "tag:hai-box",
      "deny": ["tag:hai-box:80", "tag:hai-box:443", "tag:hai-box:22", "192.168.1.10:502"],
    },
  ],
}
```

:::caution
Pasting this template **replaces** the "everyone reaches everything" rule. If your tailnet already contains other servers or shared devices, add their rules before saving. The console shows a preview of the resulting access (**Preview rules**) before you save: check it.
:::

## Step 2 — Enroll each gateway with a tagged key

This is the only thing to do for each new gateway.

1. In the console, **Settings > Keys > Generate auth key**.
2. Enable **Tags** and choose `tag:hai-box`.
3. Leave **Reusable** unchecked (one key per gateway) and keep the validity short.
4. Paste the key into the gateway's **VPN Tailscale** page, as described in [Tailscale VPN](/en/network/tailscale-vpn/), then **Apply**.

The gateway shows up in the console with the `tag:hai-box` tag. It is isolated immediately, and its subnet is approved with no manual step.

:::tip
A tagged gateway no longer belongs to any user: it stays connected if the technician who installed it leaves the company, and **its key no longer expires** (Tailscale disables key expiry for tagged devices). No more gateways dropping off after 180 days.
:::

A gateway already enrolled without a tag: in the console, open the **⋯ > Edit ACL tags** menu on the gateway's row, add `tag:hai-box`, then re-enroll it with a tagged key so that key expiry is disabled.

## Giving a customer access to their own gateway only

Your end customer wants to connect to their machine, and only theirs? Do not invite them as a tailnet user: they would see every gateway. **Share the gateway with them** instead: in the console, open the **⋯ > Share** menu on the gateway's row, then send them the link. They join it from their own Tailscale account and see only that gateway.

Sharing gives access to the gateway itself, not to the subnets it exposes: for the customer to reach a device on their machine (HMI, PLC), use a [Port Forwarding](/en/network/tailscale-vpn/#port-forwarding) rule.

## Two sites with the same addressing plan

Two machines on `192.168.1.0/24` cannot both be exposed in Subnet Route mode: Tailscale would not know which one to reach. In that case, switch those gateways to **Port Forwarding** mode: each device is then reached through its gateway's Tailscale address, with no address conflict. Isolation stays the same.

## Checking

- From your PC: each gateway's web interface answers on its Tailscale address.
- From a gateway (over SSH): another gateway's Tailscale address **does not answer**.
- In the console, **Access controls > Preview rules**, pick a gateway: its list of allowed destinations is empty.
