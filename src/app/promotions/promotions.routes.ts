import { Routes } from '@angular/router';
import { CreatePromotionsComponent } from './create-promotions/create-promotions.component';
import { EditPromotionsComponent } from './edit-promotions/edit-promotions.component';
import { PromotionsComponent } from './promotions/promotions.component';

export const routes: Routes = [
  { path: '', component: PromotionsComponent },
  { path: 'create', component: CreatePromotionsComponent },
  { path: ':promotionId/edit', component: EditPromotionsComponent }
];