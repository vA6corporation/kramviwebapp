import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexKitchenComponent } from './index-kitchen/index-kitchen.component';

const routes: Routes = [
  { path: 'kitchen', component: IndexKitchenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
