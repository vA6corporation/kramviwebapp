import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovesRoutingModule } from './moves-routing.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PosMovesComponent } from './pos-moves/pos-moves.component';
import { ChargeMovesComponent } from './charge-moves/charge-moves.component';
import { MoveItemsComponent } from './move-items/move-items.component';
import { DialogDetailMovesComponent } from './dialog-detail-moves/dialog-detail-moves.component';
import { PosEditMovesComponent } from './pos-edit-moves/pos-edit-moves.component';
import { ChargeEditMovesComponent } from './charge-edit-moves/charge-edit-moves.component';
import { MovesComponent } from './moves/moves.component';
import { DialogMoveItemsComponent } from './dialog-move-items/dialog-move-items.component';


@NgModule({
  declarations: [
    PosMovesComponent,
    ChargeMovesComponent,
    MoveItemsComponent,
    DialogDetailMovesComponent,
    PosEditMovesComponent,
    ChargeEditMovesComponent,
    MovesComponent,
    DialogMoveItemsComponent
  ],
  imports: [
    CommonModule,
    MovesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class MovesModule { }
