import { Routes } from '@angular/router';
import { CreatePatientsComponent } from './create-patients/create-patients.component';
import { EditPatientsComponent } from './edit-patients/edit-patients.component';
import { PatientsComponent } from './patients/patients.component';

export const routes: Routes = [
  { path: '', component: PatientsComponent },
  { path: 'create', component: CreatePatientsComponent },
  { path: ':patientId/edit', component: EditPatientsComponent }
];