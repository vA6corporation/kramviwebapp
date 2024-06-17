import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialtiesRoutingModule } from './specialties-routing.module';
import { SpecialtiesComponent } from './specialties/specialties.component';
import { CreateSpecialtiesComponent } from './create-specialties/create-specialties.component';
import { EditSpecialtiesComponent } from './edit-specialties/edit-specialties.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SpecialtiesComponent,
    CreateSpecialtiesComponent,
    EditSpecialtiesComponent
  ],
  imports: [
    CommonModule,
    SpecialtiesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class SpecialtiesModule { }
