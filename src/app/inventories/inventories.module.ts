import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoriesRoutingModule } from './inventories-routing.module';
import { InventoriesComponent } from './inventories/inventories.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddStockComponent } from './dialog-add-stock/dialog-add-stock.component';
import { DialogRemoveStockComponent } from './dialog-remove-stock/dialog-remove-stock.component';
import { DetailInventoriesComponent } from './detail-inventories/detail-inventories.component';
import { DialogMoveStockComponent } from './dialog-move-stock/dialog-move-stock.component';


@NgModule({
  declarations: [
    InventoriesComponent,
    DialogAddStockComponent,
    DialogRemoveStockComponent,
    DialogMoveStockComponent,
    DetailInventoriesComponent
  ],
  imports: [
    CommonModule,
    InventoriesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class InventoriesModule { }
