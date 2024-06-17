import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentPurchasesRoutingModule } from './payment-purchases-routing.module';
import { PaymentPurchasesComponent } from './payment-purchases/payment-purchases.component';
import { DialogPaymentPurchasesComponent } from './dialog-payment-purchases/dialog-payment-purchases.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PaymentPurchasesComponent,
    DialogPaymentPurchasesComponent
  ],
  imports: [
    CommonModule,
    PaymentPurchasesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    PaymentPurchasesComponent
  ]
})
export class PaymentPurchasesModule { }
