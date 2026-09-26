import { Routes } from '@angular/router';
import { CreateOfficesComponent } from './create-offices/create-offices.component';
import { EditOfficesComponent } from './edit-offices/edit-offices.component';
import { IndexOfficesComponent } from './index-offices/index-offices.component';

export const routes: Routes = [
    { path: '', component: IndexOfficesComponent },
    { path: 'create', component: CreateOfficesComponent },
    { path: ':officeId/edit', component: EditOfficesComponent }
];