import { Routes } from '@angular/router';
import { PosReceptionComponent } from './pos-reception/pos-reception.component';
import { PosRoomsComponent } from './pos-rooms/pos-rooms.component';
import { ChargeReceptionsComponent } from './charge-receptions/charge-receptions.component';

export const routes: Routes = [
  { path: '', component: PosRoomsComponent },
  { path: 'charge', component: ChargeReceptionsComponent },
  { path: ':roomId', component: PosReceptionComponent },
];