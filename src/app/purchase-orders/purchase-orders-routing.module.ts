import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeEditPurchaseOrdersComponent } from './charge-edit-purchase-orders/charge-edit-purchase-orders.component';
import { ChargePurchaseOrdersComponent } from './charge-purchase-orders/charge-purchase-orders.component';
import { CreatePurchaseOrdersComponent } from './create-purchase-orders/create-purchase-orders.component';
import { EditPurchaseOrdersComponent } from './edit-purchase-orders/edit-purchase-orders.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';

const routes: Routes = [
  { path: '', component: PurchaseOrdersComponent },
  { path: 'create', component: CreatePurchaseOrdersComponent },
  { path: ':purchaseOrderId/edit', component: EditPurchaseOrdersComponent },
  { path: 'chargeEdit', component: ChargeEditPurchaseOrdersComponent },
  { path: 'charge', component: ChargePurchaseOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrdersRoutingModule { }
