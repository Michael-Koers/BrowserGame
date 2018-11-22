import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { SocketWrapper } from 'src/app/service/socket.wrapper';
import { SocketMessage } from 'src/app/models/socket.message';
import { SocketActions } from 'src/app/models/socket.actions';
import { UserProfile } from 'src/app/models/user-profile.model';
import { ChatMessage } from 'src/app/models/chat.message';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

    private socket: any;
    private msg: SocketMessage;

    private form: FormGroup;

    private messages: SocketMessage[] = [];
    private chatMessages: ChatMessage[] = [];
    private onlineUsers: String[] = [];

    constructor(private fb: FormBuilder, private socketWrapper: SocketWrapper, private userProfile: UserProfile) { }

    ngOnInit() {
        this.form = this.fb.group({
            message: ['', [Validators.required]]
        })

        this.socket = this.socketWrapper.getSocket();

        this.socket.send(JSON.stringify({
            action: SocketActions.GETUSERS
        }));

        //Socket message handling
        this.socket.messages.subscribe(msg => {
            let parsedMsg = <SocketMessage>JSON.parse(msg);
            console.log(parsedMsg);
            switch(parsedMsg.action){
                case SocketActions.NEWUSER:
                    console.log("New user online!");
                    this.onlineUsers.push(parsedMsg.data);
                    break;
                case SocketActions.GETUSERS:
                    console.log("Got users!");
                    this.onlineUsers = parsedMsg.data;
                    break;
                case SocketActions.RECEIVECHAT:
                    console.log("Got chat!");
                    this.chatMessages.push({
                        message: parsedMsg.data,
                        username: parsedMsg.user
                    })
                    break;
            }
        })


    }

    sendMessage(): void {
        this.msg = new SocketMessage();
        this.msg.action = SocketActions.SENDCHAT;
        this.msg.user = this.userProfile.username;
        this.msg.data = this.form.value.message;

        this.chatMessages.push({
            message: this.form.value.message,
            username: this.userProfile.username
        })

        this.socket.send(JSON.stringify(this.msg));
    }
}
