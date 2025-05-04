import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../users/user.model';
import { IncidentModel } from '../incident.model';
import { IncidentsService } from '../incidents.service';
import { IncidentItemModel } from '../incident-item.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-incidents',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-incidents.component.html',
    styleUrls: ['./dialog-detail-incidents.component.sass'],
})
export class DialogDetailIncidentsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly incidentId: string,
        private readonly incidentsService: IncidentsService,
        private readonly matDialogRef: MatDialogRef<DialogDetailIncidentsComponent>
    ) { }

    incident: IncidentModel | null = null
    incidentOutItems: IncidentItemModel[] = []
    incidentInItems: IncidentItemModel[] = []
    user: UserModel | null = null
    isLoading = false

    ngOnInit(): void {
        this.incidentsService.getIncidentById(this.incidentId).subscribe(incident => {
            console.log(incident)
            this.incident = incident
            this.incidentOutItems = incident.incidentOutItems
            this.incidentInItems = incident.incidentInItems
            this.user = incident.user
        })
    }

    onDeleteIncident() {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.matDialogRef.disableClose = true
            this.isLoading = true
            this.incidentsService.deleteIncident(this.incidentId).subscribe(() => {
                this.isLoading = false
                this.matDialogRef.close(true)
            })
        }
    }

}
