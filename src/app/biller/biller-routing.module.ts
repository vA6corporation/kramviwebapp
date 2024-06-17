import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBillerComponent } from './edit-biller/edit-biller.component';
import { IndexBillerComponent } from './index-biller/index-biller.component';
import { CreateBillerComponent } from './create-biller/create-biller.component';
import { CreateCreditBillerComponent } from './create-credit-biller/create-credit-biller.component';

const routes: Routes = [
  { path: '', component: IndexBillerComponent },
  { path: 'create', component: CreateBillerComponent },
  { path: 'createCredit', component: CreateCreditBillerComponent },
  { path: ':saleId/edit', component: EditBillerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillerRoutingModule { }
