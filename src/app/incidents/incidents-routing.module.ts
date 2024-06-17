import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeIncidentsComponent } from './charge-incidents/charge-incidents.component';
import { CreateIncidentsComponent } from './create-incidents/create-incidents.component';
import { EditIncidentsComponent } from './edit-incidents/edit-incidents.component';
import { IncidentsComponent } from './incidents/incidents.component';

const routes: Routes = [
  { path: '', component: IncidentsComponent },
  { path: 'create', component: CreateIncidentsComponent },
  { path: ':incidentId/edit', component: EditIncidentsComponent },
  { path: 'chargeIncidents', component: ChargeIncidentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentsRoutingModule { }
