import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild('messageInput') input: ElementRef;

    constructor(private fb: FormBuilder, private socketWrapper: SocketWrapper, private userProfile: UserProfile) { }

    ngOnInit() {
        this.form = this.fb.group({
            message: ['', [Validators.required]]
        })

        // this.onlineUsers = ['Michael', 'Lisa', 'Joey', 'Jeffrey', 'XHero89', 'abc', 'puppy111', 'habbolover123', 'santadude112', 'Michael', 'Lisa', 'Joey', 'Jeffrey', 'XHero89', 'abc', 'puppy111', 'habbolover123', 'santadude112', 'Michael', 'Lisa', 'Joey', 'Jeffrey', 'XHero89', 'abc', 'puppy111', 'habbolover123', 'santadude112', 'Michael', 'Lisa', 'Joey', 'Jeffrey', 'XHero89', 'abc', 'puppy111', 'habbolover123', 'santadude112']

        

        this.socket = this.socketWrapper.getSocket();

        this.socket.send(JSON.stringify({
            action: SocketActions.GETUSERS
        }));

        //Socket message handling
        this.socket.messages.subscribe(msg => {
            let parsedMsg = <SocketMessage>JSON.parse(msg);
            console.log("New Message!", parsedMsg);
            switch (parsedMsg.action) {
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
                case SocketActions.DISCONNECTED:
                    console.log("Someone left the lobby :(");
                    let index = this.onlineUsers.indexOf(parsedMsg.data);
                    if (index > -1) {
                        this.onlineUsers.splice(index, 1);
                        this.chatMessages.push({
                            message: `${parsedMsg.data} has left the lobby`,
                            username: "Server"
                        })
                    }
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

        this.clearInput();
    }

    clearInput() {
        this.input.nativeElement.value = "";
    }
}
