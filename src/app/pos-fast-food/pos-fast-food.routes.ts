import { Routes } from '@angular/router';
import { PosFastFoodComponent } from './pos-fast-food/pos-fast-food.component';
import { PreFastFoodComponent } from '../pre-pos-fast-food/pre-fast-food/pre-fast-food.component';

export const routes: Routes = [
    { path: '', component: PosFastFoodComponent },
    { path: 'pre', component: PreFastFoodComponent },
];