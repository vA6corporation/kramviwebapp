import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeInvoiceComponent } from './change-invoice/change-invoice.component';
import { InvoicesCheckComponent } from './invoices-check/invoices-check.component';
import { InvoicesIndexComponent } from './invoices-index/invoices-index.component';

const routes: Routes = [
  { path: '', component: InvoicesIndexComponent },
  { path: 'check', component: InvoicesCheckComponent },
  { path: ':saleId/change', component: ChangeInvoiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
