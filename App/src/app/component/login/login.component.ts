import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SocketMessage } from 'src/app/models/socket.message';
import { SocketWrapper } from 'src/app/service/socket.wrapper';

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

    constructor(private fb: FormBuilder, private socketWrapper: SocketWrapper, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            nickname: ['', [Validators.required]],
            // IP: ['', [Validators.required]]
        })
    }

    submit() {

        let ip_address = this.form.value.IP;
        // this.socket = this.socketWrapper.connect(`ws://${ip_address}:3000/lobby`);
        this.socket = this.socketWrapper.connect('ws://localhost:3000/lobby');

        this.socket.messages.subscribe(m => {
            let response = <SocketMessage>JSON.parse(m);

            this.socketWrapper.pushSocketMessage(m);

            if (response.status) {
                this.socketWrapper.setSocket(this.socket);
                this.router.navigate(['lobby']);
            }
        });
    }
}
