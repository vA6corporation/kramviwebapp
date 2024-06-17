import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosCopyComponent } from './pos-copy/pos-copy.component';

const routes: Routes = [
  { path: ':saleId', component: PosCopyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosCopyRoutingModule { }
