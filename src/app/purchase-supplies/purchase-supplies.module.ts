import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseSuppliesComponent } from './purchase-supplies/purchase-supplies.component';
import { CreatePurchaseSuppliesComponent } from './create-purchase-supplies/create-purchase-supplies.component';
import { EditPurchaseSuppliesComponent } from './edit-purchase-supplies/edit-purchase-supplies.component';
import { PurchaseSuppliesRoutingModule } from './purchase-supplies-routing.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseSupplyItemsComponent } from './purchase-supply-items/purchase-supply-items.component';
import { DialogPurchaseSupplyItemsComponent } from './dialog-purchase-supply-items/dialog-purchase-supply-items.component';
import { ChargePurchaseSuppliesComponent } from './charge-purchase-supplies/charge-purchase-supplies.component';
import { ChargeEditPurchaseSuppliesComponent } from './charge-edit-purchase-supplies/charge-edit-purchase-supplies.component';
import { DialogDetailPurchaseSuppliesComponent } from './dialog-detail-purchase-supplies/dialog-detail-purchase-supplies.component';



@NgModule({
  declarations: [
    PurchaseSuppliesComponent,
    CreatePurchaseSuppliesComponent,
    EditPurchaseSuppliesComponent,
    PurchaseSupplyItemsComponent,
    DialogPurchaseSupplyItemsComponent,
    ChargePurchaseSuppliesComponent,
    ChargeEditPurchaseSuppliesComponent,
    DialogDetailPurchaseSuppliesComponent
  ],
  imports: [
    CommonModule,
    PurchaseSuppliesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PurchaseSuppliesModule { }
