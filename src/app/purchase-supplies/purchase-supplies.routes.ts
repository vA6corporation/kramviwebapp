import { Routes } from '@angular/router';
import { ChargeEditPurchaseSuppliesComponent } from './charge-edit-purchase-supplies/charge-edit-purchase-supplies.component';
import { ChargePurchaseSuppliesComponent } from './charge-purchase-supplies/charge-purchase-supplies.component';
import { CreatePurchaseSuppliesComponent } from './create-purchase-supplies/create-purchase-supplies.component';
import { EditPurchaseSuppliesComponent } from './edit-purchase-supplies/edit-purchase-supplies.component';
import { PurchaseSuppliesComponent } from './purchase-supplies/purchase-supplies.component';

export const routes: Routes = [
    { path: '', component: PurchaseSuppliesComponent },
    { path: 'create', component: CreatePurchaseSuppliesComponent },
    { path: ':purchaseSupplyId/edit', component: EditPurchaseSuppliesComponent },
    { path: 'charge', component: ChargePurchaseSuppliesComponent },
    { path: 'chargeEdit', component: ChargeEditPurchaseSuppliesComponent }
];