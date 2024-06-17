import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeInvoiceComponent } from './change-invoice/change-invoice.component';
import { DialogDeleteSaleComponent } from './dialog-delete-sale/dialog-delete-sale.component';
import { DialogAdminComponent } from './dialog-admin/dialog-admin.component';
import { SheetPrintComponent } from './sheet-print/sheet-print.component';
import { SheetExportPdfComponent } from './sheet-export-pdf/sheet-export-pdf.component';
import { CreditNotesModule } from '../credit-notes/credit-notes.module';
import { RemissionGuidesModule } from '../remission-guides/remission-guides.module';
import { InvoicesIndexComponent } from './invoices-index/invoices-index.component';
import { SheetInvoicesComponent } from './sheet-invoices/sheet-invoices.component';
import { DialogSendEmailComponent } from './dialog-send-email/dialog-send-email.component';
import { DialogCheckCdrsComponent } from './dialog-check-cdrs/dialog-check-cdrs.component';
import { InvoicesCheckComponent } from './invoices-check/invoices-check.component';
import { DialogBadCdrsComponent } from './dialog-bad-cdrs/dialog-bad-cdrs.component';


@NgModule({
  declarations: [
    InvoicesComponent,
    ChangeInvoiceComponent,
    DialogDeleteSaleComponent,
    DialogAdminComponent,
    SheetPrintComponent,
    SheetExportPdfComponent,
    InvoicesIndexComponent,
    SheetInvoicesComponent,
    DialogSendEmailComponent,
    DialogCheckCdrsComponent,
    InvoicesCheckComponent,
    DialogBadCdrsComponent,
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    CreditNotesModule,
    RemissionGuidesModule
  ]
})
export class InvoicesModule { }
