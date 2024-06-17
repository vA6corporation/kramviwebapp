import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { ImportCustomersComponent } from './import-customers/import-customers.component';
import { ToolsComponent } from './tools/tools.component';
import { MaterialModule } from '../material.module';
import { ImportProductsComponent } from './import-products/import-products.component';
import { UpdatePricesComponent } from './update-prices/update-prices.component';
import { DeleteDataComponent } from './delete-data/delete-data.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { CheckStockComponent } from './check-stock/check-stock.component';


@NgModule({
  declarations: [
    ImportCustomersComponent,
    ToolsComponent,
    ImportProductsComponent,
    UpdatePricesComponent,
    DeleteDataComponent,
    AddStockComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    MaterialModule,
    CheckStockComponent,
  ]
})
export class ToolsModule { }
