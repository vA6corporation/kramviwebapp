import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosFastFoodComponent } from './pos-fast-food/pos-fast-food.component';

const routes: Routes = [
  { path: '', component: PosFastFoodComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosFastFoodRoutingModule { }
