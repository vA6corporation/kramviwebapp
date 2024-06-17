import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions/promotions.component';
import { CreatePromotionsComponent } from './create-promotions/create-promotions.component';
import { EditPromotionsComponent } from './edit-promotions/edit-promotions.component';
import { MaterialModule } from '../material.module';
import { PosPromotionsComponent } from './pos-promotions/pos-promotions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PromotionItemsComponent } from './promotion-items/promotion-items.component';


@NgModule({
  declarations: [
    PromotionsComponent,
    CreatePromotionsComponent,
    EditPromotionsComponent,
    PosPromotionsComponent,
    PromotionItemsComponent
  ],
  imports: [
    CommonModule,
    PromotionsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PromotionsModule { }
