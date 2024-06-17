import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreSalesRoutingModule } from './pre-sales-routing.module';
import { PreSalesComponent } from './pre-sales/pre-sales.component';
import { CreatePreSalesComponent } from './create-pre-sales/create-pre-sales.component';
import { EditPreSalesComponent } from './edit-pre-sales/edit-pre-sales.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PosPreSalesComponent } from './pos-pre-sales/pos-pre-sales.component';
import { PosPreSalesEditComponent } from './pos-pre-sales-edit/pos-pre-sales-edit.component';
import { SaleItemsComponent } from '../sales/sale-items/sale-items.component';


@NgModule({
  declarations: [
    PreSalesComponent,
    CreatePreSalesComponent,
    EditPreSalesComponent,
    PosPreSalesComponent,
    PosPreSalesEditComponent
  ],
  imports: [
    CommonModule,
    PreSalesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SaleItemsComponent
  ]
})
export class PreSalesModule { }
