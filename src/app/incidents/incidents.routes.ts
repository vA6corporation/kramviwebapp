import { Routes } from '@angular/router';
import { ChargeIncidentsComponent } from './charge-incidents/charge-incidents.component';
import { CreateIncidentsComponent } from './create-incidents/create-incidents.component';
import { IndexIncidentsComponent } from './index-incidents/index-incidents.component';

export const routes: Routes = [
    { path: '', component: IndexIncidentsComponent },
    { path: 'create', component: CreateIncidentsComponent },
    { path: 'chargeIncidents', component: ChargeIncidentsComponent }
];