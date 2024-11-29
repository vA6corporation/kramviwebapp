import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentSuppliesRoutingModule } from './incident-supplies-routing.module';
import { DialogDetailIncidentSuppliesComponent } from './dialog-detail-incident-supplies/dialog-detail-incident-supplies.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DialogDetailIncidentSuppliesComponent
  ],
  imports: [
    CommonModule,
    IncidentSuppliesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class IncidentSuppliesModule { }
