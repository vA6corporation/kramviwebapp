import { Routes } from '@angular/router';
import { ChangeInvoiceComponent } from './change-invoice/change-invoice.component';
import { InvoicesCheckComponent } from './invoices-check/invoices-check.component';
import { InvoicesIndexComponent } from './invoices-index/invoices-index.component';

export const routes: Routes = [
  { path: '', component: InvoicesIndexComponent },
  { path: 'check', component: InvoicesCheckComponent },
  { path: ':saleId/change', component: ChangeInvoiceComponent }
];