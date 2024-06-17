import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePaymentMethodsComponent } from './create-payment-methods/create-payment-methods.component';
import { EditPaymentMethodsComponent } from './edit-payment-methods/edit-payment-methods.component';
import { IndexPaymentMethodsComponent } from './index-payment-methods/index-payment-methods.component';

const routes: Routes = [
  { path: '', component: IndexPaymentMethodsComponent },
  { path: 'create', component: CreatePaymentMethodsComponent },
  { path: ':paymentMethodId/edit', component: EditPaymentMethodsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule { }
