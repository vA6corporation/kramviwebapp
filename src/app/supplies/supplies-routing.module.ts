import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSuppliesComponent } from './create-supplies/create-supplies.component';
import { EditSuppliesComponent } from './edit-supplies/edit-supplies.component';
import { SuppliesComponent } from './supplies/supplies.component';

const routes: Routes = [
  { path: '', component: SuppliesComponent },
  { path: 'create', component: CreateSuppliesComponent },
  { path: ':supplyId/edit', component: EditSuppliesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliesRoutingModule { }
