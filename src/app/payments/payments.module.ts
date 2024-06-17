import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { DialogEditPaymentsComponent } from './dialog-edit-payments/dialog-edit-payments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { TurnPaymentsComponent } from './turn-payments/turn-payments.component';


@NgModule({
  declarations: [
    DialogEditPaymentsComponent,
    TurnPaymentsComponent,
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class PaymentsModule { }
