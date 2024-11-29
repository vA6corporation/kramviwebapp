import { Routes } from '@angular/router';
import { DetailInventorySuppliesComponent } from './detail-inventory-supplies/detail-inventory-supplies.component';
import { InventorySuppliesComponent } from './inventory-supplies/inventory-supplies.component';

export const routes: Routes = [
    { path: '', component: InventorySuppliesComponent },
    { path: ':supplyId/details', component: DetailInventorySuppliesComponent }
];
