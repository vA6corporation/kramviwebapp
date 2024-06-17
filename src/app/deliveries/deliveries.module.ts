import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveriesRoutingModule } from './deliveries-routing.module';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DeliveriesComponent
  ],
  imports: [
    CommonModule,
    DeliveriesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DeliveriesModule { }
