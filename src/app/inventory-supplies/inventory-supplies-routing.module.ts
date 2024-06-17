import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInventorySuppliesComponent } from './detail-inventory-supplies/detail-inventory-supplies.component';
import { InventorySuppliesComponent } from './inventory-supplies/inventory-supplies.component';

const routes: Routes = [
  { path: '', component: InventorySuppliesComponent },
  { path: ':supplyId/details', component: DetailInventorySuppliesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventorySuppliesRoutingModule { }
