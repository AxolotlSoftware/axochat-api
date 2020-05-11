import WebSocket from "ws";
import * as events from 'events';

import { PacketDeserializer } from "./packet/PacketDeserializer";
import { PacketSerializer } from "./packet/PacketSerializer";
import { ServerRequestMojangInfoPacket, ServerLoginMojangPacket, ServerMessagePacket, ServerPrivateMessagePacket, ServerBanUserPacket, ServerUnbanUserPacket, ServerRequestJWTPacket, ServerLoginJWTPacket } from "./packet/packets/ServerPackets";
import { ClientMojangInfoPacket, ClientNewJWTPacket, ClientMessagePacket, ClientPrivateMessagePacket, ClientErrorPacket, ClientSuccessPacket } from "./packet/packets/ClientPackets";
import { Packet } from "./packet/Packet";
import { SerializedPacket } from "./packet/SerializedPacket";


export class Client extends events.EventEmitter {
    packetDeserializer: PacketDeserializer;
    packetSerializer: PacketSerializer;
    webSocket: WebSocket;
    options?: ClientOptions;

    constructor(options?: ClientOptions) {
        super();

        this.options = options;
        this.packetSerializer = new PacketSerializer();
        this.packetDeserializer = new PacketDeserializer();

        this.packetSerializer.registerPacket("RequestMojangInfo", ServerRequestMojangInfoPacket);
        this.packetSerializer.registerPacket("LoginMojang", ServerLoginMojangPacket);
        this.packetSerializer.registerPacket("Message", ServerMessagePacket);
        this.packetSerializer.registerPacket("PrivateMessage", ServerPrivateMessagePacket);
        this.packetSerializer.registerPacket("BanUser", ServerBanUserPacket);
        this.packetSerializer.registerPacket("UnbanUser", ServerUnbanUserPacket);
        this.packetSerializer.registerPacket("RequestJWT", ServerRequestJWTPacket);
        this.packetSerializer.registerPacket("LoginJWT", ServerLoginJWTPacket);

        this.packetDeserializer.registerPacket("MojangInfo", ClientMojangInfoPacket);
        this.packetDeserializer.registerPacket("NewJWT", ClientNewJWTPacket);
        this.packetDeserializer.registerPacket("Message", ClientMessagePacket);
        this.packetDeserializer.registerPacket("PrivateMessage", ClientPrivateMessagePacket);
        this.packetDeserializer.registerPacket("Error", ClientErrorPacket);
        this.packetDeserializer.registerPacket("Success", ClientSuccessPacket);
    }

    connect(webSocketUrl: string) {
        this.webSocket = new WebSocket(webSocketUrl, {
            perMessageDeflate: false
        });

        this.webSocket.on("open", (ws: WebSocket) => this.onOpen(ws));
        this.webSocket.on("message", (data: WebSocket.Data) => this.onMessage(data));

        if (this.options) {
            if (this.options.onOpen) this.webSocket.on("open", this.options.onOpen);
            if (this.options.onMessage) this.webSocket.on("message", this.options.onMessage);
            if (this.options.onClose) this.webSocket.on("close", this.options.onClose);
        }
    }

    onOpen(ws: WebSocket) {
        if (this.options && this.options.jwtToken) {
            this.loginJWT(this.options.jwtToken, this.options.allowMessages)
        } else {
            console.error("You must provide a JWT token in the options object to login.")
        }
    }

    onMessage(data: WebSocket.Data) {
        try {
            this.onPacket(this.packetDeserializer.deserializePacket(data.toString()));
        } catch (e) {
            console.error("An error occured while deserializing a packet", e)
        }
    }

    onPacket(packet: SerializedPacket) {
        // There's probably a way to make this less shitty but I honestly don't care anymore
        switch (packet.m) {
            case "MojangInfo": {
                this.emit("mojangInfo", packet.c as ClientMojangInfoPacket)
                break;
            }
            case "NewJWT": {
                this.emit("newJWT", packet.c as ClientNewJWTPacket)
                break;
            }
            case "Message": {
                this.emit("message", packet.c as ClientMessagePacket)
                break;
            }
            case "PrivateMessage": {
                this.emit("privateMessage", packet.c as ClientPrivateMessagePacket)
                break;
            }
            case "Success": {
                this.emit("success", packet.c as ClientSuccessPacket)
                break;
            }
            case "Error": {
                this.emit("error", packet.c as ClientErrorPacket)
                break;
            }
            //This exists just to make the switch case exhaustive, normally this will never be reached
            default: {
                console.log("Unhandled packet", packet)
                break;
            }
        }
    }

    loginJWT(token: string, allowMessages: boolean = false) {
        this.sendPacket(new ServerLoginJWTPacket(token, allowMessages))
    }

    sendMessage(message: string) {
        this.sendPacket(new ServerMessagePacket(message))
    }

    sendPacket(packet: Packet) {
        this.webSocket.send(JSON.stringify(this.packetSerializer.serializePacket(packet)))
    }
}

interface ClientOptions {
    onOpen?: () => void;
    onMessage?: () => void;
    onClose?: () => void;
    jwtToken: string;
    allowMessages?: boolean;
}