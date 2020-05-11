import { Packet } from "../Packet";

export class ServerRequestMojangInfoPacket implements Packet { }

export class ServerLoginMojangPacket implements Packet {
    constructor(public name: string, public uuid: string, public allow_messages: boolean) { }
}

export class ServerLoginJWTPacket implements Packet {
    constructor(public token: string, public allow_messages: boolean) { }
}

export class ServerMessagePacket implements Packet {
    constructor(public content: string) { }
}

export class ServerPrivateMessagePacket implements Packet {
    constructor(public receiver: string, public content: string) { }
}

export class ServerBanUserPacket implements Packet {
    constructor(public user: string) { }
}

export class ServerUnbanUserPacket implements Packet {
    constructor(public user: string) { }
}

export class ServerRequestJWTPacket implements Packet { }