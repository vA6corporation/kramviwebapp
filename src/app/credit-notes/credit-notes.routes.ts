import { Routes } from '@angular/router';
import { CreateCreditNoteItemsComponent } from './create-credit-note-items/create-credit-note-items.component';
import { CreateCreditNotesComponent } from './create-credit-notes/create-credit-notes.component';
import { CreditNotesComponent } from './credit-notes/credit-notes.component';
import { EditCreditNoteItemsComponent } from './edit-credit-note-items/edit-credit-note-items.component';
import { EditCreditNotesComponent } from './edit-credit-notes/edit-credit-notes.component';

export const routes: Routes = [
    { path: '', component: CreditNotesComponent },
    { path: ':saleId/createItems', component: CreateCreditNoteItemsComponent },
    { path: ':saleId/create', component: CreateCreditNotesComponent },
    { path: ':creditNoteId/editItems', component: EditCreditNoteItemsComponent },
    { path: 'editCreditNote', component: EditCreditNotesComponent },
];