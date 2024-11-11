import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateEventItemModel } from '../create-event-item.model';
import { DialogEventItemsComponent } from '../dialog-event-items/dialog-event-items.component';
import { EventsService } from '../events.service';

@Component({
    selector: 'app-event-items',
    templateUrl: './event-items.component.html',
    styleUrls: ['./event-items.component.sass']
})
export class EventItemsComponent {

    constructor(
        private readonly eventsService: EventsService,
        private readonly matDialog: MatDialog,
    ) { }

    eventItems: CreateEventItemModel[] = []
    charge: number = 0

    private handleEventItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleEventItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleEventItems$ = this.eventsService.handleEventItems().subscribe(eventItems => {
            this.eventItems = eventItems
            let charge = 0
            for (const eventItem of this.eventItems) {
                if (eventItem.igvCode !== '11') {
                    charge += eventItem.price * eventItem.quantity
                }
            }
        })
    }

    onClickEventItem(index: number) {
        this.matDialog.open(DialogEventItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
