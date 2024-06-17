import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesComponent } from './purchases/purchases.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePurchasesComponent } from './create-purchases/create-purchases.component';
import { EditPurchasesComponent } from './edit-purchases/edit-purchases.component';
import { PurchaseItemsComponent } from './purchase-items/purchase-items.component';
import { DialogPurchaseItemsComponent } from './dialog-purchase-items/dialog-purchase-items.component';
import { ChargeEditPurchasesComponent } from './charge-edit-purchases/charge-edit-purchases.component';
import { ChargePurchasesComponent } from './charge-purchases/charge-purchases.component';
import { DebsComponent } from './debs/debs.component';
import { ChargeCreditComponent } from './charge-credit/charge-credit.component';
import { DialogDetailPurchasesComponent } from './dialog-detail-purchases/dialog-detail-purchases.component';
import { PaymentPurchasesModule } from '../payment-purchases/payment-purchases.module';
import { IndexPurchasesComponent } from './index-purchases/index-purchases.component';
import { SheetPurchaseItemsComponent } from './sheet-purchase-items/sheet-purchase-items.component';


@NgModule({
  declarations: [
    PurchasesComponent,
    CreatePurchasesComponent,
    EditPurchasesComponent,
    PurchaseItemsComponent,
    DialogPurchaseItemsComponent,
    ChargeEditPurchasesComponent,
    ChargePurchasesComponent,
    DebsComponent,
    ChargeCreditComponent,
    DialogDetailPurchasesComponent,
    IndexPurchasesComponent,
    SheetPurchaseItemsComponent,
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    PaymentPurchasesModule
  ]
})
export class PurchasesModule { }
