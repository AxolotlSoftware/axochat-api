import { Packet } from "../Packet";
import { AuthorInfo } from "../../data/AuthorInfo";

export class ClientMojangInfoPacket implements Packet {
    session_hash: string
}

export class ClientNewJWTPacket implements Packet {
    token: string;
}

export class ClientMessagePacket implements Packet {
    author_info: AuthorInfo;
    content: string;
}

export class ClientPrivateMessagePacket implements Packet {
    author_info: AuthorInfo;
    content: string;
}

export class ClientSuccessPacket implements Packet {
    reason: "Login" | "Ban" | "Unban";
}

export class ClientErrorPacket implements Packet {
    message: "NotSupported" | "LoginFailed" | "NotLoggedIn" | "AlreadyLoggedIn" | "MojangRequestMissing" | "NotPermitted" | "NotBanned" | "Banned" | "RateLimited" | "PrivateMessageNotAccepted" | "EmptyMessage" | "MessageTooLong" | "InvalidCharacter" | "InvalidId" | "Internal" | string;
}