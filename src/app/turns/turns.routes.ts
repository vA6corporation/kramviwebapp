import { Routes } from '@angular/router';
import { DetailTurnsComponent } from './detail-turns/detail-turns.component';
import { OpenTurnComponent } from './open-turn/open-turn.component';
import { TurnsComponent } from './turns/turns.component';

export const routes: Routes = [
    // { path: '', component: TurnsComponent, canActivate: [CanActivateTeam], data: { routeName: 'turns' } },
    // { path: 'openTurn', component: OpenTurnComponent, canActivate: [CanActivateTeam], data: { routeName: 'openBox' } },
    // { path: ':turnId/details', component: DetailTurnsComponent, canActivate: [CanActivateTeam], data: { routeName: 'turns' } },
    { path: '', component: TurnsComponent },
    { path: 'openTurn', component: OpenTurnComponent },
    { path: ':turnId/details', component: DetailTurnsComponent }
];
