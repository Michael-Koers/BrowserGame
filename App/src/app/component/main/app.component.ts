import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { SocketWrapper } from 'src/app/service/socket.wrapper';
import { SocketMessage } from 'src/app/models/socket.message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private WS_URL: string = "ws://localhost:3000/lobby";
    private messages: string[] = [];
    private socket: any;
    private loggedIn: boolean = false;

    constructor(private socketWrapper: SocketWrapper, private router: Router){}

    logInUser(event: User){

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
