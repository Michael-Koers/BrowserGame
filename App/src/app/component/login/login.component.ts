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

    private WS_URL: string = "ws://localhost:3000/lobby";
    private messages: string[] = [];
    private socket: any;
    private loggedIn: boolean = false;

    private form: FormGroup;

    constructor(private fb: FormBuilder, private socketWrapper: SocketWrapper, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            nickname: ['', [Validators.required]]
        })
    }

    submit(event: User) {
        this.socket = this.socketWrapper.connect(this.WS_URL);
        this.socket.messages.subscribe(m => {
            let response = <SocketMessage>JSON.parse(m);
            
            this.messages.push(m);

            console.log(response);

            if(response.status){
                console.log("response succes");
                localStorage.setItem('nickname', event.username);
                this.loggedIn = true;
                this.router.navigate(['lobby']);
            }
        });

        this.socketWrapper.setSocket(this.socket);
    }


}
