import { Packet } from "./Packet";

export class PacketDeserializer {
    packetRegistry: Map<String, Packet>

    constructor() {
        this.packetRegistry = new Map();
    }

    registerPacket(name: string, packet: Packet) {
        this.packetRegistry.set(name, packet);
    }

    deserializePacket?(json: string): any {
        let parsedPacket = JSON.parse(json);

        if (!parsedPacket) return;

        const packetName = parsedPacket.m;

        if (!this.packetRegistry.has(packetName)) return;

        return parsedPacket;
    }

    getClientPacketByName(name: String): Packet {
        return this.packetRegistry.get(name);
    }
}