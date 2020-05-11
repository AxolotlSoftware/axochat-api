### AxoChat API

A simple (and very bad) library to connect to AxoChat servers in TypeScript.

## Example Usage
```ts
import { Client } from "./client/Client"
import { ClientMessagePacket, ClientSuccessPacket } from "./client/packet/packets/ClientPackets";

(async () => {
    const client = new Client({
        jwtToken: "token",
        allowMessages: true
    })

    client.connect("wss://chat.liquidbounce.net:7886/ws")

    client.on("success", (success: ClientSuccessPacket) => {
        //Print "Success: {reason}" into the console, e.g. "Success: Login" after successfully logging in
        console.log("Success: " + success.reason)
    })

    client.on("message", (message: ClientMessagePacket) => {
        //Echo the received message back
        client.sendMessage(message.content);
    })
})();
```