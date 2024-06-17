import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsRoutingModule } from './credits-routing.module';
import { CreditsComponent } from './credits/credits.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailCreditsComponent } from './detail-credits/detail-credits.component';
import { DialogPaymentComponent } from './dialog-payment/dialog-payment.component';
import { DialogCreditExpirationComponent } from './dialog-credit-expiration/dialog-credit-expiration.component';
import { PayedCreditsComponent } from './payed-credits/payed-credits.component';
import { DialogCreditDuesComponent } from './dialog-credit-dues/dialog-credit-dues.component';
import { DialogPaymentCreditsComponent } from './dialog-payment-credits/dialog-payment-credits.component';


@NgModule({
  declarations: [
    CreditsComponent,
    DetailCreditsComponent,
    DialogPaymentComponent,
    DialogCreditExpirationComponent,
    PayedCreditsComponent,
    DialogCreditDuesComponent,
    DialogPaymentCreditsComponent
  ],
  imports: [
    CommonModule,
    CreditsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class CreditsModule { }
