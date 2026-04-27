import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { UserModel } from '../../users/user.model'
import { IncidentModel } from '../incident.model'
import { IncidentsService } from '../incidents.service'
import { IncidentItemModel } from '../incident-item.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-detail-out-incidents',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-out-incidents.component.html',
    styleUrl: './dialog-detail-out-incidents.component.sass',
})
export class DialogDetailOutIncidentsComponent {

    private readonly outIncidentId: any = inject(MAT_DIALOG_DATA)
    private readonly incidentsService = inject(IncidentsService)
    private readonly matDialogRef: MatDialogRef<DialogDetailOutIncidentsComponent> = inject(MatDialogRef)

    $outIncident = signal<IncidentModel | null>(null)
    $outIncidentItems = signal<IncidentItemModel[]>([])
    $user = signal<UserModel | null>(null)
    $isLoading = signal<boolean>(false)

    ngOnInit(): void {
        this.incidentsService.getOutIncidentById(this.outIncidentId).subscribe(outIncident => {
            this.$outIncident.set(outIncident)
            this.$outIncidentItems.set(outIncident.outIncidentItems)
            this.$user.set(outIncident.user)
        })
    }

    onDeleteIncident() {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.matDialogRef.disableClose = true
            this.$isLoading.set(true)
            this.incidentsService.deleteOutIncident(this.outIncidentId).subscribe(() => {
                this.$isLoading.set(false)
                this.matDialogRef.close(true)
            })
        }
    }

}
