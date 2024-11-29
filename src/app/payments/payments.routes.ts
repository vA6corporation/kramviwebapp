import { Routes } from '@angular/router';
import { TurnPaymentsComponent } from './turn-payments/turn-payments.component';

export const routes: Routes = [
    { path: ':turnId', component: TurnPaymentsComponent },
];