import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { CreatePaymentMethodsComponent } from './create-payment-methods/create-payment-methods.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPaymentMethodsComponent } from './edit-payment-methods/edit-payment-methods.component';
import { DisabledPaymentMethodsComponent } from './disabled-payment-methods/disabled-payment-methods.component';
import { IndexPaymentMethodsComponent } from './index-payment-methods/index-payment-methods.component';


@NgModule({
  declarations: [
    PaymentMethodsComponent,
    CreatePaymentMethodsComponent,
    EditPaymentMethodsComponent,
    DisabledPaymentMethodsComponent,
    IndexPaymentMethodsComponent
  ],
  imports: [
    CommonModule,
    PaymentMethodsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PaymentMethodsModule { }
