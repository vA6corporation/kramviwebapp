import { Routes } from '@angular/router';
import { CouponsComponent } from './coupons/coupons.component';
import { CreateCouponsComponent } from './create-coupons/create-coupons.component';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';

export const routes: Routes = [
    { path: '', component: CouponsComponent },
    { path: 'create', component: CreateCouponsComponent },
    { path: ':couponId/edit', component: EditCouponsComponent },
];
