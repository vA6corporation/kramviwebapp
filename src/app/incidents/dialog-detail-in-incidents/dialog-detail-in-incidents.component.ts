import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { UserModel } from '../../users/user.model'
import { IncidentModel } from '../incident.model'
import { IncidentsService } from '../incidents.service'
import { IncidentItemModel } from '../incident-item.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-detail-in-incidents',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-in-incidents.component.html',
    styleUrl: './dialog-detail-in-incidents.component.sass',
})
export class DialogDetailInIncidentsComponent {

    private readonly inIncidentId: any = inject(MAT_DIALOG_DATA)
    private readonly incidentsService = inject(IncidentsService)
    private readonly matDialogRef: MatDialogRef<DialogDetailInIncidentsComponent> = inject(MatDialogRef)

    $inIncident = signal<IncidentModel | null>(null)
    $inIncidentItems = signal<IncidentItemModel[]>([])
    $user = signal<UserModel | null>(null)
    $isLoading = signal<boolean>(false)

    ngOnInit(): void {
        this.incidentsService.getInIncidentById(this.inIncidentId).subscribe(inIncident => {
            this.$inIncident.set(inIncident)
            this.$inIncidentItems.set(inIncident.inIncidentItems)
            this.$user.set(inIncident.user)
        })
    }

    onDeleteIncident() {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.matDialogRef.disableClose = true
            this.$isLoading.set(true)
            this.incidentsService.deleteInIncident(this.inIncidentId).subscribe(() => {
                this.$isLoading.set(false)
                this.matDialogRef.close(true)
            })
        }
    }

}
