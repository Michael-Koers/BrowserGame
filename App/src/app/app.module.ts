import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './component/main/app.component';
import { GameComponent } from './component/game/game.component';
import { LobbyComponent } from './component/lobby/lobby.component';
import { LoginComponent } from './component/login/login.component';

import { router } from './app.router'
import { SocketWrapper } from './service/socket.wrapper';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LobbyComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(router),
    ReactiveFormsModule
  ],
  providers: [SocketWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
