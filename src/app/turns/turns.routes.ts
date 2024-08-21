import { Routes } from '@angular/router';
import { DetailTurnsComponent } from './detail-turns/detail-turns.component';
import { OpenTurnComponent } from './open-turn/open-turn.component';
import { TurnsComponent } from './turns/turns.component';

export const routes: Routes = [
    { path: '', component: TurnsComponent },
    { path: 'openTurn', component: OpenTurnComponent },
    { path: ':turnId/details', component: DetailTurnsComponent }
];
