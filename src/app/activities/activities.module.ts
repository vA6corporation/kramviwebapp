import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesComponent } from './activities/activities.component';
import { CreateActivitiesComponent } from './create-activities/create-activities.component';
import { EditActivitiesComponent } from './edit-activities/edit-activities.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ActivitiesComponent,
    CreateActivitiesComponent,
    EditActivitiesComponent
  ],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ActivitiesModule { }
