import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosFastFoodRoutingModule } from './pos-fast-food-routing.module';
import { PosFastFoodComponent } from './pos-fast-food/pos-fast-food.component';
import { MaterialModule } from '../material.module';
import { DialogLastCommandComponent } from './dialog-last-command/dialog-last-command.component';
import { SaleItemsComponent } from '../sales/sale-items/sale-items.component';

@NgModule({
  declarations: [
    PosFastFoodComponent,
    DialogLastCommandComponent
  ],
  imports: [
    CommonModule,
    PosFastFoodRoutingModule,
    MaterialModule,
    SaleItemsComponent,
  ]
})
export class PosFastFoodModule { }
