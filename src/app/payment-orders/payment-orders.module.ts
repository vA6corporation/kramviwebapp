import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentOrdersRoutingModule } from './payment-orders-routing.module';
import { PaymentOrdersComponent } from './payment-orders/payment-orders.component';
import { CreatePaymentOrdersComponent } from './create-payment-orders/create-payment-orders.component';
import { EditPaymentOrdersComponent } from './edit-payment-orders/edit-payment-orders.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        PaymentOrdersComponent,
        CreatePaymentOrdersComponent,
        EditPaymentOrdersComponent,
    ],
    imports: [
        CommonModule,
        PaymentOrdersRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
    ]
})
export class PaymentOrdersModule { }
