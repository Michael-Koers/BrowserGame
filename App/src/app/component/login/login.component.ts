import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SocketMessage } from 'src/app/models/socket.message';
import { SocketWrapper } from 'src/app/service/socket.wrapper';
import { UserProfile } from 'src/app/models/user-profile.model';
import { SocketActions } from 'src/app/models/socket.actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private messages: string[] = [];
    private socket: any;
    private loggedIn: boolean = false;

    private form: FormGroup;

    constructor(private fb: FormBuilder, private socketWrapper: SocketWrapper, private router: Router, private userProfile: UserProfile) { }

    ngOnInit() {
        this.form = this.fb.group({
            username: ['', [Validators.required]],
            IP: ['', [Validators.required]]
        })
    }

    submit() {

        let ip_address = this.form.value.IP;
        this.socket = this.socketWrapper.connect(`ws://${ip_address}:3000/lobby`);

        // this.socket = this.socketWrapper.connect('ws://localhost:3000/lobby');

        this.socket.messages.subscribe(m => {
            console.log("return msg", m);
            let response = <SocketMessage>JSON.parse(m);

            this.socketWrapper.pushSocketMessage(response);

            this.userProfile.username = this.form.value.username;

            console.log("Connection made - Userprofile: ", this.userProfile);

            if (response.status) {
                this.socketWrapper.setSocket(this.socket);

                this.socket.send(JSON.stringify({
                    action: SocketActions.LOGIN,
                    user: this.userProfile.username,
                    data: this.userProfile.username
                }));

                this.router.navigate(['lobby']);
            }
        });
    }
}
