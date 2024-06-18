import { Routes } from '@angular/router';
import { CreateBillerComponent } from './create-biller/create-biller.component';
import { CreateCreditBillerComponent } from './create-credit-biller/create-credit-biller.component';
import { EditBillerComponent } from './edit-biller/edit-biller.component';
import { IndexBillerComponent } from './index-biller/index-biller.component';

export const routes: Routes = [
    { path: '', component: IndexBillerComponent },
    { path: 'create', component: CreateBillerComponent },
    { path: 'createCredit', component: CreateCreditBillerComponent },
    { path: ':saleId/edit', component: EditBillerComponent },
];