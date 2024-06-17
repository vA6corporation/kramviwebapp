import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditNotesRoutingModule } from './credit-notes-routing.module';
import { CreditNotesComponent } from './credit-notes/credit-notes.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCreditNotesComponent } from './create-credit-notes/create-credit-notes.component';
import { DialogCreditNotesComponent } from './dialog-credit-notes/dialog-credit-notes.component';
import { EditCreditNotesComponent } from './edit-credit-notes/edit-credit-notes.component';
import { CreditNoteItemsComponent } from './credit-note-items/credit-note-items.component';
import { DialogCreditNoteItemsComponent } from './dialog-credit-note-items/dialog-credit-note-items.component';
import { EditCreditNoteItemsComponent } from './edit-credit-note-items/edit-credit-note-items.component';
import { CreateCreditNoteItemsComponent } from './create-credit-note-items/create-credit-note-items.component';
import { DialogAdminCreditNotesComponent } from './dialog-admin-credit-notes/dialog-admin-credit-notes.component';
import { DialogDetailCreditNotesComponent } from './dialog-detail-credit-notes/dialog-detail-credit-notes.component';
import { SheetExportPdfCreditNotesComponent } from './sheet-export-pdf-credit-notes/sheet-export-pdf-credit-notes.component';
import { SheetPrintCreditNotesComponent } from './sheet-print-credit-notes/sheet-print-credit-notes.component';
import { SaleItemsComponent } from '../sales/sale-items/sale-items.component';


@NgModule({
  declarations: [
    CreditNotesComponent,
    CreateCreditNotesComponent,
    DialogCreditNotesComponent,
    EditCreditNotesComponent,
    CreditNoteItemsComponent,
    DialogCreditNoteItemsComponent,
    EditCreditNoteItemsComponent,
    CreateCreditNoteItemsComponent,
    DialogAdminCreditNotesComponent,
    DialogDetailCreditNotesComponent,
    SheetExportPdfCreditNotesComponent,
    SheetPrintCreditNotesComponent
  ],
  imports: [
    SaleItemsComponent,
    CommonModule,
    CreditNotesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    CreditNotesComponent,
  ]
})
export class CreditNotesModule { }
