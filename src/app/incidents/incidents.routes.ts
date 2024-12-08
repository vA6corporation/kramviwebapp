import { Routes } from '@angular/router';
import { ChargeIncidentsComponent } from './charge-incidents/charge-incidents.component';
import { CreateIncidentsComponent } from './create-incidents/create-incidents.component';
import { IncidentsComponent } from './incidents/incidents.component';

export const routes: Routes = [
    { path: '', component: IncidentsComponent },
    { path: 'create', component: CreateIncidentsComponent },
    { path: 'chargeIncidents', component: ChargeIncidentsComponent }
];