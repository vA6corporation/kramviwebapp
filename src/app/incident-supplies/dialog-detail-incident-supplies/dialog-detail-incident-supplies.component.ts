import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from '../../users/user.model';
import { IncidentSuppliesService } from '../incident-supplies.service';
import { IncidentSupplyItemModel } from '../incident-supply-item.model';
import { IncidentSupplyModel } from '../incident-supply.model';

@Component({
    selector: 'app-dialog-detail-incident-supplies',
    templateUrl: './dialog-detail-incident-supplies.component.html',
    styleUrls: ['./dialog-detail-incident-supplies.component.sass']
})
export class DialogDetailIncidentSuppliesComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly incidentId: string,
        private readonly incidentSuppliesService: IncidentSuppliesService,
    ) { }

    user: UserModel | null = null
    incidentSupply: IncidentSupplyModel | null = null
    incidentSupplyItems: IncidentSupplyItemModel[] = []

    ngOnInit(): void {
        this.incidentSuppliesService.getIncidentSupplyById(this.incidentId).subscribe(incidentSupply => {
            this.incidentSupply = incidentSupply
            this.incidentSupplyItems = incidentSupply.incidentSupplyItems
            this.user = incidentSupply.user
        })
    }

}
