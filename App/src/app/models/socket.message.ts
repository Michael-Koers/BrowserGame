import { SocketActions } from "./socket.actions";

export class SocketMessage{
    action: SocketActions;
    status: string;
    data: any;
    user: string;
}