import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GameComponent } from './component/game/game.component';
import { LobbyComponent } from './component/lobby/lobby.component';
import { LoginComponent } from './component/login/login.component';

import { router } from './app.router'

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LobbyComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(router)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
