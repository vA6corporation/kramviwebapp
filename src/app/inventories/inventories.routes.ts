import { Routes } from '@angular/router';
import { DetailInventoriesComponent } from './detail-inventories/detail-inventories.component';
import { InventoriesComponent } from './inventories/inventories.component';

export const routes: Routes = [
    { path: '', component: InventoriesComponent },
    { path: ':productId/details', component: DetailInventoriesComponent }
];