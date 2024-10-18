import { Routes } from '@angular/router';
import { ProvidersComponent } from './providers/providers.component';
import { CreateProvidersComponent } from './create-providers/create-providers.component';
import { EditProvidersComponent } from './edit-providers/edit-providers.component';

export const routes: Routes = [
    { path: '', component: ProvidersComponent },
    { path: 'create', component: CreateProvidersComponent },
    { path: ':providerId/edit', component: EditProvidersComponent },
];
