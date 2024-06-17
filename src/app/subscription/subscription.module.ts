import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription/subscription.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    MaterialModule
  ]
})
export class SubscriptionModule { }
