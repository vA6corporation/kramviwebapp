import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentsRoutingModule } from './incidents-routing.module';
import { IncidentsComponent } from './incidents/incidents.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateIncidentsComponent } from './create-incidents/create-incidents.component';
import { EditIncidentsComponent } from './edit-incidents/edit-incidents.component';
import { ChargeIncidentsComponent } from './charge-incidents/charge-incidents.component';
import { IncidentItemsComponent } from './incident-items/incident-items.component';
import { DialogIncidentItemsComponent } from './dialog-incident-items/dialog-incident-items.component';
import { DialogDetailIncidentsComponent } from './dialog-detail-incidents/dialog-detail-incidents.component';


@NgModule({
  declarations: [
    IncidentsComponent,
    CreateIncidentsComponent,
    EditIncidentsComponent,
    ChargeIncidentsComponent,
    IncidentItemsComponent,
    DialogIncidentItemsComponent,
    DialogDetailIncidentsComponent
  ],
  imports: [
    CommonModule,
    IncidentsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class IncidentsModule { }
