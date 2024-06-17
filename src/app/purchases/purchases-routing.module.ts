import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeCreditComponent } from './charge-credit/charge-credit.component';
import { ChargeEditPurchasesComponent } from './charge-edit-purchases/charge-edit-purchases.component';
import { ChargePurchasesComponent } from './charge-purchases/charge-purchases.component';
import { CreatePurchasesComponent } from './create-purchases/create-purchases.component';
import { EditPurchasesComponent } from './edit-purchases/edit-purchases.component';
import { IndexPurchasesComponent } from './index-purchases/index-purchases.component';

const routes: Routes = [
  { path: '', component: IndexPurchasesComponent },
  { path: 'create', component: CreatePurchasesComponent },
  { path: ':purchaseId/edit', component: EditPurchasesComponent },
  { path: 'charge', component: ChargePurchasesComponent },
  { path: 'chargeEdit', component: ChargeEditPurchasesComponent },
  { path: 'chargeCredit', component: ChargeCreditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
