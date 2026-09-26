import { Routes } from '@angular/router';
import { BanksComponent } from './banks/banks.component';
import { CreateBanksComponent } from './create-banks/create-banks.component';
import { EditBanksComponent } from './edit-banks/edit-banks.component';

export const routes: Routes = [
    { path: '', component: BanksComponent },
    { path: 'create', component: CreateBanksComponent },
    { path: ':bankId/edit', component: EditBanksComponent },
];
