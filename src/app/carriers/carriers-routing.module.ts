import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarriersComponent } from './carriers/carriers.component';
import { CreateCarriersComponent } from './create-carriers/create-carriers.component';
import { EditCarriersComponent } from './edit-carriers/edit-carriers.component';

const routes: Routes = [
  { path: '', component: CarriersComponent },
  { path: 'create', component: CreateCarriersComponent },
  { path: ':carrierId/edit', component: EditCarriersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarriersRoutingModule { }
