import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoriesComponent } from './inventories/inventories.component';
import { DetailInventoriesComponent } from './detail-inventories/detail-inventories.component';

const routes: Routes = [
  { path: '', component: InventoriesComponent },
  { path: ':productId/details', component: DetailInventoriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoriesRoutingModule { }
