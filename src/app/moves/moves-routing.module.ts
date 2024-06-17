import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeEditMovesComponent } from './charge-edit-moves/charge-edit-moves.component';
import { ChargeMovesComponent } from './charge-moves/charge-moves.component';
import { MovesComponent } from './moves/moves.component';
import { PosEditMovesComponent } from './pos-edit-moves/pos-edit-moves.component';
import { PosMovesComponent } from './pos-moves/pos-moves.component';

const routes: Routes = [
  { path: '', component: MovesComponent },
  { path: 'create', component: PosMovesComponent },
  { path: ':moveId/edit', component: PosEditMovesComponent },
  { path: 'charge', component: ChargeMovesComponent },
  { path: 'chargeEdit', component: ChargeEditMovesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovesRoutingModule { }
