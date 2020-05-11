import { Packet } from "./Packet";

export class SerializedPacket {
    constructor(public m: String, public c?: Packet) { }
}