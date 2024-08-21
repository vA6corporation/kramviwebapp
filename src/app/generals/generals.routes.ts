import { Routes } from '@angular/router';
import { CreateGeneralsComponent } from './create-generals/create-generals.component';
import { EditGeneralsComponent } from './edit-generals/edit-generals.component';
import { GeneralsComponent } from './generals/generals.component';

export const routes: Routes = [
    { path: '', component: GeneralsComponent },
    { path: 'create', component: CreateGeneralsComponent },
    { path: ':generalId/edit', component: EditGeneralsComponent }
];