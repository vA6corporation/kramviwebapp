import { Routes } from '@angular/router';
import { SuppliesComponent } from './supplies/supplies.component';
import { CreateSuppliesComponent } from './create-supplies/create-supplies.component';
import { EditSuppliesComponent } from './edit-supplies/edit-supplies.component';

export const routes: Routes = [
    { path: '', component: SuppliesComponent },
    { path: 'create', component: CreateSuppliesComponent },
    { path: ':supplyId/edit', component: EditSuppliesComponent },
];
