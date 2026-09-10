---
title: "SMS"
description: "Send and receive SMS messages from the HAI-P200-4G through its 4G modem."
sidebar:
  order: 2
---

Beyond simply collecting data, the **DataPlug** has a broader purpose: it is the **central communication channel** of our controllers. It drives a number of internal services, including sending and receiving SMS messages.

As with your equipment data, these exchanges go through our **internal MQTT broker**.

## Sending an SMS

The principle is simple: publish a JSON message on a dedicated MQTT _topic_.

- **MQTT topic to use:** service/sms/send
- **Message format (payload):** a JSON object structured as follows:

```json
{"number": "+33666740007", "message": "Hello World" }
```

## Receiving an SMS

To be notified when a new SMS arrives, the principle is the reverse: **subscribe** to a specific MQTT _topic_ and listen for incoming messages.

In Node-RED, use an **mqtt in** node configured as follows:

- **MQTT topic to subscribe to:** service/sms/received
- **Message format (payload):** every SMS received is published on that _topic_ as a JSON object structured as follows:

```json
{"number": "+33666740007", "message": "Hello Hexa-ai" }
```
