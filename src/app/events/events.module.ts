import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events/events.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateEventsComponent } from './create-events/create-events.component';
import { CreateItemEventsComponent } from './create-item-events/create-item-events.component';
import { DialogEventItemsComponent } from './dialog-event-items/dialog-event-items.component';
import { EventItemsComponent } from './event-items/event-items.component';
import { ChargeEventsComponent } from './charge-events/charge-events.component';
import { DialogDateEventsComponent } from './dialog-date-events/dialog-date-events.component';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { EditChargeEventsComponent } from './edit-charge-events/edit-charge-events.component';
import { EditItemEventsComponent } from './edit-item-events/edit-item-events.component';
import { SaleItemsComponent } from '../sales/sale-items/sale-items.component';


@NgModule({
  declarations: [
    EventsComponent,
    CreateEventsComponent,
    CreateItemEventsComponent,
    DialogEventItemsComponent,
    EventItemsComponent,
    ChargeEventsComponent,
    DialogDateEventsComponent,
    EditEventsComponent,
    EditChargeEventsComponent,
    EditItemEventsComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SaleItemsComponent,
  ]
})
export class EventsModule { }
