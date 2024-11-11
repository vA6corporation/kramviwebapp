import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateIncidentItemModel } from '../create-incident-item.model';
import { DialogIncidentItemsComponent } from '../dialog-incident-items/dialog-incident-items.component';
import { IncidentsService } from '../incidents.service';
import { IgvType } from '../../products/igv-type.enum';

@Component({
    selector: 'app-incident-items',
    templateUrl: './incident-items.component.html',
    styleUrls: ['./incident-items.component.sass']
})
export class IncidentItemsComponent {

    constructor(
        private readonly incidentsService: IncidentsService,
        private readonly matDialog: MatDialog,
    ) { }

    incidentItems: CreateIncidentItemModel[] = []
    charge: number = 0
    igvType = IgvType

    private handleIncidentItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleIncidentItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleIncidentItems$ = this.incidentsService.handleIncidentItems().subscribe(incidentItems => {
            this.incidentItems = incidentItems
            this.charge = 0
            for (const incidentItem of this.incidentItems) {
                if (incidentItem.igvCode !== '11') {
                    this.charge += incidentItem.cost * incidentItem.quantity
                }
            }
        })
    }

    onSelectIncidentItem(index: number) {
        this.matDialog.open(DialogIncidentItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
