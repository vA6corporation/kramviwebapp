import { Routes } from '@angular/router'
import { ChargeEditPurchasesComponent } from './charge-edit-purchases/charge-edit-purchases.component'
import { ChargePurchasesComponent } from './charge-purchases/charge-purchases.component'
import { CreatePurchasesComponent } from './create-purchases/create-purchases.component'
import { EditPurchasesComponent } from './edit-purchases/edit-purchases.component'
import { DetailPurchasesComponent } from './detail-purchases/detail-purchases.component'
import { DetailPurchaseItemsComponent } from './detail-purchase-items/detail-purchase-items.component'
import { PurchasesComponent } from './purchases/purchases.component'

export const routes: Routes = [
    { path: '', component: PurchasesComponent },
    { path: ':productId/purchaseItems', component: DetailPurchaseItemsComponent },
    { path: 'create', component: CreatePurchasesComponent },
    { path: ':purchaseId/edit', component: EditPurchasesComponent },
    { path: 'charge', component: ChargePurchasesComponent },
    { path: 'chargeEdit', component: ChargeEditPurchasesComponent },
    { path: ':purchaseId/details', component: DetailPurchasesComponent }
]
