import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnPaymentsComponent } from './turn-payments/turn-payments.component';

const routes: Routes = [
  { path: ':turnId', component: TurnPaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
