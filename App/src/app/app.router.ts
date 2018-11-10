import { Route } from '@angular/router';

import { GameComponent } from './component/game/game.component';
import { LobbyComponent } from './component/lobby/lobby.component';
import { LoginComponent } from './component/login/login.component';


export const router: Route[] = [
    {
        path: 'lobby',
        component: LobbyComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'game',
        component: GameComponent
    },
    {
        path: '**',
        redirectTo: '/login'
    }
]