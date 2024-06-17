import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSpecialtiesComponent } from './create-specialties/create-specialties.component';
import { EditSpecialtiesComponent } from './edit-specialties/edit-specialties.component';
import { SpecialtiesComponent } from './specialties/specialties.component';

const routes: Routes = [
  { path: '', component: SpecialtiesComponent },
  { path: 'create', component: CreateSpecialtiesComponent },
  { path: ':specialtyId/edit', component: EditSpecialtiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialtiesRoutingModule { }
