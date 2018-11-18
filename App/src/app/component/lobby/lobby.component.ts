import { Component, OnInit } from '@angular/core';
import { SocketWrapper } from 'src/app/service/socket.wrapper';
import { SocketMessage } from 'src/app/models/socket.message';
import { SocketActions } from 'src/app/models/socket.actions';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

    private socket: any;
    private msg: SocketMessage;

    constructor(private socketWrapper: SocketWrapper) { }

    ngOnInit() {
        this.socket = this.socketWrapper.getSocket();
    }

    sendMessage(): void {
        this.msg = new SocketMessage();
        this.msg.action = SocketActions.GETUSERS;
        this.socket.send(JSON.stringify(this.msg));
    }

}
