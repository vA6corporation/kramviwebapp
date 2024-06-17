import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePatientsComponent } from './create-patients/create-patients.component';
import { EditPatientsComponent } from './edit-patients/edit-patients.component';
import { PatientsComponent } from './patients/patients.component';

const routes: Routes = [
  { path: '', component: PatientsComponent },
  { path: 'create', component: CreatePatientsComponent },
  { path: ':patientId/edit', component: EditPatientsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
