import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosCopyRoutingModule } from './pos-copy-routing.module';
import { PosCopyComponent } from './pos-copy/pos-copy.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SaleItemsComponent } from '../sales/sale-items/sale-items.component';


@NgModule({
  declarations: [
    PosCopyComponent
  ],
  imports: [
    CommonModule,
    PosCopyRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SaleItemsComponent
  ]
})
export class PosCopyModule { }
