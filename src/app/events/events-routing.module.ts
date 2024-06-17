import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeEventsComponent } from './charge-events/charge-events.component';
import { CreateEventsComponent } from './create-events/create-events.component';
import { CreateItemEventsComponent } from './create-item-events/create-item-events.component';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { EditItemEventsComponent } from './edit-item-events/edit-item-events.component';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'createItems', component: CreateItemEventsComponent },
  { path: 'create', component: CreateEventsComponent },
  { path: 'edit', component: EditEventsComponent },
  { path: ':eventId/charge', component: ChargeEventsComponent },
  { path: ':eventId/editItems', component: EditItemEventsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
