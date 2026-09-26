import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreateIncidentItemModel } from '../create-incident-item.model'
import { DialogIncidentItemsComponent } from '../dialog-incident-items/dialog-incident-items.component'
import { IncidentsService } from '../incidents.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-incident-items',
    imports: [MaterialModule],
    templateUrl: './incident-items.component.html',
    styleUrls: ['./incident-items.component.sass'],
})
export class IncidentItemsComponent {

    private readonly incidentsService = inject(IncidentsService)
    private readonly matDialog = inject(MatDialog)

    $incidentItems = signal<CreateIncidentItemModel[]>([])
    $charge = signal<number>(0)
    $countProducts = signal<number>(0)
    igvCode = IgvCode

    private handleIncidentItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleIncidentItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleIncidentItems$ = this.incidentsService.handleIncidentItems().subscribe(incidentItems => {
            this.$incidentItems.set(incidentItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const incidentItem of incidentItems) {
                countProducts += incidentItem.quantity
                if (incidentItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += incidentItem.cost * incidentItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
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
