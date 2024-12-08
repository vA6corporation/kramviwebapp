import { Routes } from '@angular/router';
import { CreateSpecialtiesComponent } from './create-specialties/create-specialties.component';
import { EditSpecialtiesComponent } from './edit-specialties/edit-specialties.component';
import { SpecialtiesComponent } from './specialties/specialties.component';

export const routes: Routes = [
    { path: '', component: SpecialtiesComponent },
    { path: 'create', component: CreateSpecialtiesComponent },
    { path: ':specialtyId/edit', component: EditSpecialtiesComponent }
];