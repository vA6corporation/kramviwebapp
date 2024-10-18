import { Routes } from '@angular/router';
import { PaymentOrdersComponent } from './payment-orders/payment-orders.component';
import { CreatePaymentOrdersComponent } from './create-payment-orders/create-payment-orders.component';
import { EditPaymentOrdersComponent } from './edit-payment-orders/edit-payment-orders.component';

export const routes: Routes = [
    { path: '', component: PaymentOrdersComponent },
    { path: 'create', component: CreatePaymentOrdersComponent },
    { path: ':paymentOrderId/edit', component: EditPaymentOrdersComponent },
];
