import { Routes } from '@angular/router';
import { PosStandardEditComponent } from './pos-standard-edit/pos-standard-edit.component';
import { PosStandardComponent } from './pos-standard/pos-standard.component';

export const routes: Routes = [
    { path: '', component: PosStandardComponent },
    { path: ':saleId/edit', component: PosStandardEditComponent },
];
