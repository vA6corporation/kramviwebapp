import { Routes } from '@angular/router'
import { ChargeInIncidentsComponent } from './charge-in-incidents/charge-in-incidents.component'
import { ChargeOutIncidentsComponent } from './charge-out-incidents/charge-out-incidents.component'
import { CreateInIncidentsComponent } from './create-in-incidents/create-in-incidents.component'
import { CreateOutIncidentsComponent } from './create-out-incidents/create-out-incidents.component'
import { IndexIncidentsComponent } from './index-incidents/index-incidents.component'
import { DetailInIncidentsComponent } from './detail-in-incidents/detail-in-incidents.component'
import { DetailOutIncidentsComponent } from './detail-out-incidents/detail-out-incidents.component'

export const routes: Routes = [
    { path: '', component: IndexIncidentsComponent },
    { path: 'createIn', component: CreateInIncidentsComponent },
    { path: 'createOut', component: CreateOutIncidentsComponent },
    { path: 'chargeInIncidents', component: ChargeInIncidentsComponent },
    { path: 'chargeOutIncidents', component: ChargeOutIncidentsComponent },
    { path: ':productId/inIncidentItems', component: DetailInIncidentsComponent },
    { path: ':productId/outIncidentItems', component: DetailOutIncidentsComponent },
]
