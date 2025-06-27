import { Routes } from '@angular/router';
import { ChargeInIncidentsComponent } from './charge-in-incidents/charge-in-incidents.component';
import { ChargeOutIncidentsComponent } from './charge-out-incidents/charge-out-incidents.component';
import { CreateInIncidentsComponent } from './create-in-incidents/create-in-incidents.component';
import { CreateOutIncidentsComponent } from './create-out-incidents/create-out-incidents.component';
import { IndexIncidentsComponent } from './index-incidents/index-incidents.component';

export const routes: Routes = [
    { path: '', component: IndexIncidentsComponent },
    { path: 'createIn', component: CreateInIncidentsComponent },
    { path: 'createOut', component: CreateOutIncidentsComponent },
    { path: 'chargeInIncidents', component: ChargeInIncidentsComponent },
    { path: 'chargeOutIncidents', component: ChargeOutIncidentsComponent },
];