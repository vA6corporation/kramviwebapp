import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { PurchaseOrderItemsComponent } from './purchase-order-items/purchase-order-items.component';
import { CreatePurchaseOrdersComponent } from './create-purchase-orders/create-purchase-orders.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChargePurchaseOrdersComponent } from './charge-purchase-orders/charge-purchase-orders.component';
import { DialogPurchaseOrderItemsComponent } from './dialog-purchase-order-items/dialog-purchase-order-items.component';
import { EditPurchaseOrdersComponent } from './edit-purchase-orders/edit-purchase-orders.component';
import { ChargeEditPurchaseOrdersComponent } from './charge-edit-purchase-orders/charge-edit-purchase-orders.component';
import { DialogDetailPurchaseOrdersComponent } from './dialog-detail-purchase-orders/dialog-detail-purchase-orders.component';


@NgModule({
  declarations: [
    PurchaseOrdersComponent,
    PurchaseOrderItemsComponent,
    CreatePurchaseOrdersComponent,
    ChargePurchaseOrdersComponent,
    DialogPurchaseOrderItemsComponent,
    EditPurchaseOrdersComponent,
    ChargeEditPurchaseOrdersComponent,
    DialogDetailPurchaseOrdersComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrdersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class PurchaseOrdersModule { }
