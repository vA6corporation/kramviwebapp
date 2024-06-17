import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventorySuppliesRoutingModule } from './inventory-supplies-routing.module';
import { InventorySuppliesComponent } from './inventory-supplies/inventory-supplies.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddStockSupplyComponent } from './dialog-add-stock-supply/dialog-add-stock-supply.component';
import { DialogRemoveStockSupplyComponent } from './dialog-remove-stock-supply/dialog-remove-stock-supply.component';
import { DialogMoveStockSupplyComponent } from './dialog-move-stock-supply/dialog-move-stock-supply.component';
import { DetailInventorySuppliesComponent } from './detail-inventory-supplies/detail-inventory-supplies.component';


@NgModule({
  declarations: [
    InventorySuppliesComponent,
    DialogAddStockSupplyComponent,
    DialogRemoveStockSupplyComponent,
    DialogMoveStockSupplyComponent,
    DetailInventorySuppliesComponent
  ],
  imports: [
    CommonModule,
    InventorySuppliesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class InventorySuppliesModule { }
