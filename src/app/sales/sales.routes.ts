import { Routes } from '@angular/router';
import { ChargeComponent } from './charge/charge.component';
import { ChargeFastFoodComponent } from './charge-fast-food/charge-fast-food.component';
import { ChargeCreditComponent } from './charge-credit/charge-credit.component';
import { ChargeEditComponent } from './charge-edit/charge-edit.component';
import { ChargeCopyComponent } from './charge-copy/charge-copy.component';
import { ChargeFromComponent } from './charge-from/charge-from.component';

export const routes: Routes = [
    { path: '', component: ChargeComponent },
    { path: 'fastFood', component: ChargeFastFoodComponent },
    { path: 'credit', component: ChargeCreditComponent },
    { path: ':saleId/edit', component: ChargeEditComponent },
    { path: 'copy', component: ChargeCopyComponent },
    { path: 'from', component: ChargeFromComponent },
];