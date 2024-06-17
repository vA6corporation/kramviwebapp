import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePromotionsComponent } from './create-promotions/create-promotions.component';
import { EditPromotionsComponent } from './edit-promotions/edit-promotions.component';
import { PromotionsComponent } from './promotions/promotions.component';

const routes: Routes = [
  { path: '', component: PromotionsComponent },
  { path: 'create', component: CreatePromotionsComponent },
  { path: ':promotionId/edit', component: EditPromotionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule { }
