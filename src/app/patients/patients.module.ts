import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { CreatePatientsComponent } from './create-patients/create-patients.component';
import { EditPatientsComponent } from './edit-patients/edit-patients.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogPatientsComponent } from './dialog-patients/dialog-patients.component';
import { DialogCreatePatientsComponent } from './dialog-create-patients/dialog-create-patients.component';
import { DialogEditPatientsComponent } from './dialog-edit-patients/dialog-edit-patients.component';


@NgModule({
  declarations: [
    PatientsComponent,
    CreatePatientsComponent,
    EditPatientsComponent,
    DialogPatientsComponent,
    DialogCreatePatientsComponent,
    DialogEditPatientsComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PatientsModule { }
