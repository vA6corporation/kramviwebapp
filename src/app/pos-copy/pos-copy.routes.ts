import { Routes } from '@angular/router';
import { PosCopyComponent } from './pos-copy/pos-copy.component';

export const routes: Routes = [
    { path: ':saleId', component: PosCopyComponent }
];