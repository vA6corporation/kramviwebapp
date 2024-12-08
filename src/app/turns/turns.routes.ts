import { Routes } from '@angular/router';
import { DetailTurnsComponent } from './detail-turns/detail-turns.component';
import { OpenTurnComponent } from './open-turn/open-turn.component';
import { TurnsComponent } from './turns/turns.component';
import { CanActivateTeam } from '../auth/can-activate-team';

export const routes: Routes = [
    { path: '', component: TurnsComponent },
    { path: 'openTurn', component: OpenTurnComponent },
    { path: ':turnId/details', component: DetailTurnsComponent, canActivate: [CanActivateTeam], data: { routeName: 'turns' } }
];
