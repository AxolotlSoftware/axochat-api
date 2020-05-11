import { Packet } from "./Packet";
import { SerializedPacket } from "./SerializedPacket";

export class PacketSerializer {
    packetRegistry: Map<String, Packet> = new Map()

    registerPacket(name: string, packet: Packet) {
        this.packetRegistry.set(name, packet);
    }

    serializePacket(packet: Packet): SerializedPacket {
        return new SerializedPacket(this.getPacketName(packet), packet)
    }

    private getPacketName(packet: Packet): String {
        for (const [key, value] of this.packetRegistry.entries()) {
            // Yes, yes, I'm very proud of this approach and this will totally not break when the code gets minified :mmlol:
            const packetName = value.toString().match(/class ([^\s]+) {/)[1]
            if (packet.constructor.name.replace("\"", "") === packetName) {
                return key;
            }
        }
    }
}