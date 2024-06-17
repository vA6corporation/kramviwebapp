import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { IncomesComponent } from './incomes/incomes.component';
import { MaterialModule } from '../material.module';
import { CollectionsComponent } from './collections/collections.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';
import { SuppliesComponent } from './supplies/supplies.component';
import { SuppliesOutComponent } from './supplies-out/supplies-out.component';
import { SuppliesInComponent } from './supplies-in/supplies-in.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SummaryComponent } from './summary/summary.component';
import { WorkersComponent } from './workers/workers.component';
import { CustomersComponent } from './customers/customers.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProformasComponent } from './proformas/proformas.component';
import { IndexReportsComponent } from './index-reports/index-reports.component';
import { InoutComponent } from './inout/inout.component';


@NgModule({
  declarations: [
    IncomesComponent,
    CollectionsComponent,
    UtilitiesComponent,
    ProductsComponent,
    SuppliesComponent,
    SuppliesOutComponent,
    SuppliesInComponent,
    InvoicesComponent,
    SummaryComponent,
    WorkersComponent,
    CustomersComponent,
    PurchasesComponent,
    CategoriesComponent,
    ProformasComponent,
    IndexReportsComponent,
    InoutComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class ReportsModule { }
