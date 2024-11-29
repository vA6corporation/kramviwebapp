import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material.module';
import { ExpensesComponent } from './expenses/expenses.component';
import { CollectionsComponent } from './collections/collections.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { IndexKitchenComponent } from './index-kitchen/index-kitchen.component';
import { IndexMinimarketComponent } from './index-minimarket/index-minimarket.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ExpensesComponent,
    CollectionsComponent,
    InvoicesComponent,
    IndexKitchenComponent,
    IndexMinimarketComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
  ]
})
export class DashboardModule { }
