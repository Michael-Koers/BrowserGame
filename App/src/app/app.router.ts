import { Route } from '@angular/router';

import { GameComponent } from './component/game/game.component';
import { LobbyComponent } from './component/lobby/lobby.component';
import { LoginComponent } from './component/login/login.component';

import { AuthGuardService } from './auth/auth-guard.service';


export const router: Route[] = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'lobby',
        component: LobbyComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'game',
        component: GameComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
]