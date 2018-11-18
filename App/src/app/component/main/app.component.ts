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
export class AppComponent {}
